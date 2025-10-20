"""
Hybrid Scraper - Scrapy + Playwright
Usa Playwright apenas quando necessário (requires_javascript: true)
"""

from scrapy_playwright.page import PageMethod
import scrapy
import yaml
from pathlib import Path
from datetime import datetime

class HybridSpider(scrapy.Spider):
    """Spider híbrido que usa Playwright quando necessário"""
    
    def __init__(self, source_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Carregar config (2 níveis acima do spiders/)
        config_path = Path(__file__).parent.parent.parent / 'config' / 'sources.yaml'
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Encontrar source
        self.source_config = None
        for source in config['sources']:
            if source['id'] == source_id:
                self.source_config = source
                break
        
        if not self.source_config or not self.source_config.get('enabled'):
            raise ValueError(f"Source {source_id} not found or disabled")
        
        # Configurar spider
        self.name = source_id
        self.source_id = source_id
        self.source_name = self.source_config['name']
        self.selectors = self.source_config.get('selectors', {})
        self.requires_js = self.source_config.get('requires_javascript', False)
        
        # URLs
        urls = self.source_config['urls']
        if 'noticias' in urls:
            self.start_urls = [urls['noticias']]
        elif 'lista' in urls:
            self.start_urls = [urls['lista']]
        else:
            self.start_urls = [urls['base']]
        
        # Configurar custom_settings como atributo de instância
        self.custom_settings = {
            'DOWNLOAD_DELAY': self.source_config.get('rate_limit', 5),
            'CONCURRENT_REQUESTS': 1,
            'USER_AGENT': 'AtlasReg/1.0 by ness. (https://atlasreg.com)',
            'ROBOTSTXT_OBEY': True,
        }
        
        # Se requer JS, adicionar Playwright
        if self.requires_js:
            self.custom_settings.update({
                'DOWNLOAD_HANDLERS': {
                    'https': 'scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler',
                    'http': 'scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler',
                },
                'PLAYWRIGHT_LAUNCH_OPTIONS': {
                    'headless': True,
                    'args': [
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-blink-features=AutomationControlled'
                    ]
                },
                'PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT': 30000,
            })
    
    def start_requests(self):
        """Gerar requests iniciais"""
        for url in self.start_urls:
            if self.requires_js:
                # Playwright mode
                yield scrapy.Request(
                    url,
                    meta={
                        'playwright': True,
                        'playwright_page_methods': [
                            PageMethod('wait_for_load_state', 'networkidle'),
                            PageMethod('wait_for_selector', 
                                      self.selectors.get('lista', 'article'),
                                      timeout=10000)
                        ],
                        'playwright_include_page': True
                    },
                    callback=self.parse_with_playwright,
                    errback=self.errback
                )
            else:
                # Scrapy normal
                yield scrapy.Request(url, callback=self.parse)
    
    def parse(self, response):
        """Parse com Scrapy normal (sites estáticos)"""
        lista_selector = self.selectors.get('lista', 'article')
        items = response.css(lista_selector)
        
        self.logger.info(f"📰 {self.source_name}: {len(items)} items (Scrapy)")
        
        for item in items:
            titulo = self.extract_text(item, self.selectors.get('titulo'))
            url = self.extract_attr(item, self.selectors.get('url'), 'href')
            data = self.extract_text(item, self.selectors.get('data'))
            resumo = self.extract_text(item, self.selectors.get('resumo'))
            
            if titulo and url:
                url_completa = response.urljoin(url)
                
                if self.should_collect(titulo, resumo):
                    yield self.create_item(titulo, url_completa, data, resumo)
    
    async def parse_with_playwright(self, response):
        """Parse com Playwright (sites JavaScript)"""
        page = response.meta['playwright_page']
        
        # Scroll para lazy loading
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.wait_for_timeout(2000)
        
        # Extrair items
        lista_selector = self.selectors.get('lista', 'article')
        items = await page.query_selector_all(lista_selector)
        
        self.logger.info(f"📰 {self.source_name}: {len(items)} items (Playwright)")
        
        results = []
        for item in items:
            # Extrair título
            titulo_sel = self.selectors.get('titulo', 'h2')
            titulo_elem = await item.query_selector(titulo_sel.split('::')[0])
            titulo = await titulo_elem.inner_text() if titulo_elem else None
            
            # Extrair URL
            url_sel = self.selectors.get('url', 'a')
            url_elem = await item.query_selector(url_sel.split('::')[0])
            url = await url_elem.get_attribute('href') if url_elem else None
            
            # Extrair data
            data_sel = self.selectors.get('data', 'time')
            data_elem = await item.query_selector(data_sel.split('::')[0])
            data = await data_elem.inner_text() if data_elem else None
            
            # Extrair resumo
            resumo_sel = self.selectors.get('resumo', 'p')
            resumo_elem = await item.query_selector(resumo_sel.split('::')[0])
            resumo = await resumo_elem.inner_text() if resumo_elem else None
            
            if titulo and url:
                url_completa = response.urljoin(url)
                
                if self.should_collect(titulo, resumo):
                    results.append(self.create_item(titulo, url_completa, data, resumo))
        
        await page.close()
        
        for result in results:
            yield result
    
    def extract_text(self, selector, css):
        """Extrair texto com fallback"""
        if not css:
            return None
        
        # Tentar múltiplos seletores (separados por vírgula)
        for sel in css.split(','):
            sel = sel.strip()
            if '::text' in sel:
                sel = sel.replace('::text', '::text').strip()
                result = selector.css(sel).get()
            else:
                result = selector.css(f"{sel}::text").get()
            
            if result:
                return result.strip()
        
        return None
    
    def extract_attr(self, selector, css, attr):
        """Extrair atributo com fallback"""
        if not css:
            return None
        
        for sel in css.split(','):
            sel = sel.strip()
            if '::attr' in sel:
                result = selector.css(sel).get()
            else:
                result = selector.css(f"{sel}::attr({attr})").get()
            
            if result:
                return result.strip()
        
        return None
    
    def should_collect(self, titulo: str, resumo: str = '') -> bool:
        """Verificar se item deve ser coletado"""
        filters = self.source_config.get('filters', {})
        keywords = filters.get('keywords', [])
        
        if not keywords:
            return True
        
        text = f"{titulo} {resumo}".lower()
        return any(kw.lower() in text for kw in keywords)
    
    def create_item(self, titulo, url, data, resumo=''):
        """Criar item estruturado"""
        return {
            'title': titulo,
            'url': url,
            'date': data,
            'summary': resumo,
            'source': self.source_name,
            'source_id': self.source_id,
            'scraped_at': datetime.now().isoformat(),
        }
    
    def errback(self, failure):
        """Tratar erros"""
        self.logger.error(f"❌ Erro: {failure}")

