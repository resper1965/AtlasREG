"""
MegaWhat Spider - Teste do sistema híbrido
"""

from .hybrid_scraper import HybridSpider

class MegawhatSpider(HybridSpider):
    """Spider para MegaWhat Energy"""
    name = 'megawhat'
    
    def __init__(self, *args, **kwargs):
        super().__init__(source_id='megawhat', *args, **kwargs)

