"""
EPBR Spider - Teste do sistema híbrido
"""

from .hybrid_scraper import HybridSpider

class EpbrSpider(HybridSpider):
    """Spider para EPBR"""
    name = 'epbr'
    
    def __init__(self, *args, **kwargs):
        super().__init__(source_id='epbr', *args, **kwargs)

