"""
Base Scraper Configurável
Lê configuração do sources.yaml e cria scrapers dinamicamente
"""

import scrapy
import yaml
from pathlib import Path
from datetime import datetime
import json
import re
from typing import Dict, Any

class ConfigurableSpider(scrapy.Spider):
    """Spider base que lê configuração do YAML"""
    
    def __init__(self, source_id: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Carregar config
        config_path = Path(__file__).parent.parent / 'config' / 'sources.yaml'
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Encontrar source
        self.source_config = None
        for source in config['sources']:
            if source['id'] == source_id:
                self.source_config = source
                break
        
        if not self.source_config:
            raise ValueError(f"Source {source_id} not found in config")
        
        if not self.source_config.get('enabled', False):
            raise ValueError(f"Source {source_id} is disabled")
        
        # Configurar spider
        self.name = source_id
        self.source_id = source_id
        self.source_name = self.source_config['name']
        self.category = self.source_config['category']
        
        # URLs
        urls = self.source_config['urls']
        if 'noticias' in urls:
            self.start_urls = [urls['noticias']]
        elif 'lista' in urls:
            self.start_urls = [urls['lista']]
        else:
            self.start_urls = [urls['base']]
        
        # Selectors
        self.selectors = self.source_config.get('selectors', {})
        
        # Settings
        self.custom_settings = {
            'DOWNLOAD_DELAY': self.source_config.get('rate_limit', 5),
            'CONCURRENT_REQUESTS': 1,
            'USER_AGENT': config['global_settings']['user_agent'],
            'ROBOTSTXT_OBEY': config['global_settings']['respect_robots_txt'],
            'RETRY_TIMES': config['global_settings']['default_retries'],
            'ITEM_PIPELINES': {
                'scrapers.pipelines.MinIOPipeline': 300,
                'scrapers.pipelines.PostgreSQLPipeline': 400,
            }
        }
    
    def parse(self, response):
        """Parse genérico baseado em selectors do config"""
        
        # Seletor da lista
        lista_selector = self.selectors.get('lista', 'article, div.item')
        items = response.css(lista_selector)
        
        self.logger.info(f"📰 {self.source_name}: Encontrados {len(items)} items")
        
        for item in items:
            # Extrair dados usando selectors configurados
            data = {}
            
            # Título
            titulo_sel = self.selectors.get('titulo', 'h2::text, h3::text')
            titulo = item.css(titulo_sel).get()
            
            # URL
            url_sel = self.selectors.get('url', 'a::attr(href)')
            url = item.css(url_sel).get()
            
            # Data
            data_sel = self.selectors.get('data', 'time::attr(datetime), .data::text')
            data_pub = item.css(data_sel).get()
            
            # Resumo
            resumo_sel = self.selectors.get('resumo', 'p::text, .resumo::text')
            resumo = item.css(resumo_sel).get()
            
            if titulo and url:
                # Construir URL completa
                url_completa = response.urljoin(url)
                
                # Verificar filtros (keywords)
                if self.should_collect(titulo, resumo):
                    # Se tem callback para página completa
                    if self.source_config.get('requires_javascript'):
                        # Playwright vai buscar depois
                        yield self.create_item(titulo, url_completa, data_pub, resumo)
                    else:
                        # Seguir para página completa
                        yield response.follow(
                            url,
                            callback=self.parse_full_article,
                            meta={
                                'titulo': titulo,
                                'data': data_pub,
                                'resumo': resumo,
                                'url': url_completa
                            }
                        )
    
    def parse_full_article(self, response):
        """Parse página completa do artigo"""
        
        titulo = response.meta['titulo']
        data = response.meta['data']
        resumo = response.meta.get('resumo', '')
        url = response.meta['url']
        
        # Extrair corpo completo
        # Tentar múltiplos seletores comuns
        corpo_selectors = [
            'div.content p::text',
            'article.post-content p::text',
            'div.entry-content p::text',
            'div.noticia-corpo p::text'
        ]
        
        corpo_paragrafos = []
        for selector in corpo_selectors:
            paragrafos = response.css(selector).getall()
            if paragrafos:
                corpo_paragrafos = paragrafos
                break
        
        corpo_completo = '\n'.join([p.strip() for p in corpo_paragrafos if p.strip()])
        
        # PDFs anexos
        pdfs = response.css('a[href$=".pdf"]::attr(href)').getall()
        
        # Criar item
        yield self.create_item(titulo, url, data, resumo, corpo_completo, pdfs)
    
    def should_collect(self, titulo: str, resumo: str = '') -> bool:
        """Verifica se item deve ser coletado baseado em filtros"""
        
        filters = self.source_config.get('filters', {})
        keywords = filters.get('keywords', [])
        
        # Se não tem filtros, coleta tudo
        if not keywords:
            return True
        
        # Verifica se alguma keyword está no título ou resumo
        text = f"{titulo} {resumo}".lower()
        
        for keyword in keywords:
            if keyword.lower() in text:
                return True
        
        return False
    
    def create_item(self, titulo, url, data, resumo='', corpo='', pdfs=None):
        """Cria item estruturado"""
        
        return {
            'title': titulo.strip() if titulo else '',
            'url': url,
            'date': self.parse_date(data),
            'summary': resumo.strip() if resumo else '',
            'body': corpo.strip() if corpo else '',
            'source': self.source_name,
            'source_id': self.source_id,
            'category': self.category,
            'pdfs': pdfs or [],
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(corpo.split()) if corpo else 0,
            'has_attachments': len(pdfs) > 0 if pdfs else False
        }
    
    def parse_date(self, date_string):
        """Parse data em múltiplos formatos"""
        
        if not date_string:
            return None
        
        # ISO format
        if 'T' in date_string or '-' in date_string:
            return date_string
        
        # Formato BR: 17/10/2025
        match = re.search(r'(\d{2})/(\d{2})/(\d{4})', date_string)
        if match:
            day, month, year = match.groups()
            return f"{year}-{month}-{day}T00:00:00"
        
        # Formato textual: "17 de outubro de 2025"
        meses = {
            'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
            'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
            'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        }
        
        for mes_nome, mes_num in meses.items():
            if mes_nome in date_string.lower():
                match = re.search(r'(\d{1,2})\s+de\s+\w+\s+de\s+(\d{4})', date_string.lower())
                if match:
                    day, year = match.groups()
                    return f"{year}-{mes_num}-{day.zfill(2)}T00:00:00"
        
        return None


# Factory para criar spiders
def create_spider(source_id: str):
    """Factory para criar spider baseado em source_id"""
    
    class DynamicSpider(ConfigurableSpider):
        pass
    
    DynamicSpider.name = source_id
    return DynamicSpider

