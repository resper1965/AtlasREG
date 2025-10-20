"""
ANEEL News Scraper
Coleta notícias do site oficial da ANEEL sobre transmissão de energia
"""

import scrapy
from datetime import datetime
import json
import re

class AneelNewsSpider(scrapy.Spider):
    name = "aneel_news"
    allowed_domains = ["gov.br"]
    start_urls = [
        'https://www.gov.br/aneel/pt-br/assuntos/noticias'
    ]
    
    # Configurações éticas de scraping
    custom_settings = {
        'DOWNLOAD_DELAY': 5,  # 5 segundos entre requests
        'CONCURRENT_REQUESTS': 1,  # 1 request por vez
        'USER_AGENT': 'AtlasReg/1.0 by ness. (+https://atlasreg.com; contato@atlasreg.com)',
        'ROBOTSTXT_OBEY': True,  # Respeita robots.txt
        'RETRY_TIMES': 3,
        'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 429]
    }
    
    def parse(self, response):
        """Parse lista de notícias"""
        
        self.log(f"🔍 Scraping ANEEL notícias: {response.url}")
        
        # Selecionar notícias (ajustar seletores conforme HTML real)
        # Este é um exemplo - HTML real pode variar
        noticias = response.css('div.item-noticia, article.noticia, div.tileItem')
        
        self.log(f"📰 Encontradas {len(noticias)} notícias")
        
        for noticia in noticias:
            # Extrair dados básicos
            titulo = noticia.css('h2::text, h3::text, .noticia-titulo::text').get()
            url_relativa = noticia.css('a::attr(href)').get()
            data_publicacao = noticia.css('time::attr(datetime), .data::text').get()
            resumo = noticia.css('p.resumo::text, .noticia-desc::text').get()
            
            if titulo and url_relativa:
                # Construir URL completa
                url_completa = response.urljoin(url_relativa)
                
                # Parse data
                data_parsed = self.parse_date(data_publicacao)
                
                # Request para página completa da notícia
                yield response.follow(
                    url_relativa,
                    callback=self.parse_article,
                    meta={
                        'titulo': titulo.strip(),
                        'data': data_parsed,
                        'resumo': resumo.strip() if resumo else '',
                        'url': url_completa
                    }
                )
        
        # Pagination (se houver)
        proxima_pagina = response.css('a.proxima, a.next::attr(href)').get()
        if proxima_pagina:
            yield response.follow(proxima_pagina, callback=self.parse)
    
    def parse_article(self, response):
        """Parse página completa da notícia"""
        
        # Dados da meta (passados do parse)
        titulo = response.meta['titulo']
        data = response.meta['data']
        resumo = response.meta['resumo']
        url = response.meta['url']
        
        # Extrair corpo completo
        corpo_paragrafos = response.css('div.conteudo p::text, article p::text').getall()
        corpo_completo = '\n'.join([p.strip() for p in corpo_paragrafos if p.strip()])
        
        # Extrair PDFs anexos (se houver)
        pdfs = response.css('a[href$=".pdf"]::attr(href)').getall()
        
        # Estruturar documento
        documento = {
            'title': titulo,
            'date': data,
            'url': url,
            'summary': resumo,
            'body': corpo_completo,
            'source': 'ANEEL',
            'source_type': 'news',
            'pdfs': [response.urljoin(pdf) for pdf in pdfs],
            'scraped_at': datetime.now().isoformat(),
            'word_count': len(corpo_completo.split()),
            'has_attachments': len(pdfs) > 0
        }
        
        # Log
        self.log(f"✅ Coletada: {titulo[:50]}...")
        
        yield documento
    
    def parse_date(self, date_string):
        """Parse data em vários formatos"""
        if not date_string:
            return None
        
        # Formato ISO
        if 'T' in date_string:
            return date_string
        
        # Formato brasileiro: 17/10/2025
        match = re.search(r'(\d{2})/(\d{2})/(\d{4})', date_string)
        if match:
            day, month, year = match.groups()
            return f"{year}-{month}-{day}T00:00:00"
        
        return None

# Pipeline de processamento (Scrapy pipeline)
class AneelPipeline:
    """Pipeline para salvar dados no MinIO e PostgreSQL"""
    
    def open_spider(self, spider):
        """Inicializar conexões"""
        from minio import Minio
        
        self.minio = Minio(
            'localhost:19000',
            access_key='admin',
            secret_key='atlasreg2025',
            secure=False
        )
        
        # Garantir que bucket existe
        if not self.minio.bucket_exists('raw-documents'):
            self.minio.make_bucket('raw-documents')
        
        spider.log("📦 MinIO conectado")
    
    def process_item(self, item, spider):
        """Processar cada item coletado"""
        
        # Converter para JSON
        data = json.dumps(item, ensure_ascii=False, indent=2)
        
        # Gerar nome do arquivo
        date_str = item['date'][:10] if item['date'] else 'unknown'
        filename = f"aneel/news/{date_str}/{item['title'][:50]}.json"
        filename = re.sub(r'[^\w\s-]', '', filename).strip().replace(' ', '-')
        
        # Upload para MinIO
        self.minio.put_object(
            'raw-documents',
            filename,
            data.encode('utf-8'),
            len(data.encode('utf-8')),
            content_type='application/json'
        )
        
        spider.log(f"💾 Salvo em MinIO: {filename}")
        
        # TODO: Registrar no PostgreSQL (tabela documents)
        # TODO: Disparar task de processamento (Celery)
        
        return item

