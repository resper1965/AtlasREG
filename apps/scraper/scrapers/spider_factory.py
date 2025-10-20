"""
Spider Factory
Cria spiders dinamicamente baseado em configuração YAML
"""

import yaml
from pathlib import Path
from scrapers.base_scraper import ConfigurableSpider

def load_sources_config():
    """Carregar configuração de sources"""
    config_path = Path(__file__).parent.parent / 'config' / 'sources.yaml'
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def get_enabled_sources():
    """Retornar lista de sources habilitadas"""
    config = load_sources_config()
    return [s for s in config['sources'] if s.get('enabled', False)]

def create_spider_class(source_config):
    """Criar classe de spider para uma source"""
    
    source_id = source_config['id']
    
    class DynamicSpider(ConfigurableSpider):
        name = source_id
        
        def __init__(self, *args, **kwargs):
            super().__init__(source_id, *args, **kwargs)
    
    return DynamicSpider

# Gerar spiders para todas as sources habilitadas
def generate_all_spiders():
    """Gerar dicionário de spiders para todas as sources"""
    spiders = {}
    
    for source in get_enabled_sources():
        spider_class = create_spider_class(source)
        spiders[source['id']] = spider_class
    
    return spiders

# Export
ALL_SPIDERS = generate_all_spiders()

# Para uso em linha de comando:
# scrapy crawl aneel_noticias
# scrapy crawl ons_ocorrencias
# etc

