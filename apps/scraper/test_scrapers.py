"""
Test Scrapers Script
Valida todos os scrapers configurados no sources.yaml
"""

import yaml
import requests
from pathlib import Path
from bs4 import BeautifulSoup
from colorama import init, Fore, Style
import time

init(autoreset=True)

def load_sources():
    """Carregar sources do YAML"""
    config_path = Path(__file__).parent / 'config' / 'sources.yaml'
    with open(config_path, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)
    return [s for s in config['sources'] if s.get('enabled', False)]

def test_url_accessible(url: str, timeout=10) -> tuple:
    """Testar se URL está acessível"""
    try:
        headers = {
            'User-Agent': 'AtlasReg/1.0 by ness. (https://atlasreg.com)'
        }
        response = requests.get(url, headers=headers, timeout=timeout)
        return True, response.status_code, len(response.content)
    except requests.RequestException as e:
        return False, str(e), 0

def test_selectors(url: str, selectors: dict) -> dict:
    """Testar se selectors CSS encontram elementos"""
    try:
        headers = {
            'User-Agent': 'AtlasReg/1.0 by ness.'
        }
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        results = {}
        
        # Testar selector de lista
        lista_sel = selectors.get('lista', '')
        if lista_sel:
            # Simplificar selector para BeautifulSoup
            lista_sel_simple = lista_sel.split(',')[0].split('::')[0].strip()
            items = soup.select(lista_sel_simple)
            results['lista'] = {
                'selector': lista_sel,
                'found': len(items),
                'ok': len(items) > 0
            }
        
        return results
        
    except Exception as e:
        return {'error': str(e)}

def validate_source(source: dict) -> dict:
    """Validar uma source completa"""
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.CYAN}🔍 Testando: {source['name']} ({source['id']})")
    print(f"{Fore.CYAN}{'='*80}")
    
    result = {
        'id': source['id'],
        'name': source['name'],
        'tests': {},
        'overall': False
    }
    
    # 1. Testar URL base
    urls = source.get('urls', {})
    test_url = urls.get('noticias') or urls.get('lista') or urls.get('base')
    
    print(f"\n📍 URL: {test_url}")
    
    accessible, status, size = test_url_accessible(test_url)
    
    if accessible:
        print(f"{Fore.GREEN}✅ URL acessível - Status: {status} - Size: {size:,} bytes")
        result['tests']['url'] = True
    else:
        print(f"{Fore.RED}❌ URL inacessível - Error: {status}")
        result['tests']['url'] = False
        return result
    
    # 2. Testar selectors (apenas para scrapy, não playwright)
    if source.get('scraper_type') == 'scrapy' and 'selectors' in source:
        print(f"\n🎯 Testando selectors CSS...")
        
        selector_results = test_selectors(test_url, source['selectors'])
        
        if 'error' in selector_results:
            print(f"{Fore.YELLOW}⚠️  Erro ao testar selectors: {selector_results['error']}")
            result['tests']['selectors'] = False
        else:
            for key, data in selector_results.items():
                if data['ok']:
                    print(f"{Fore.GREEN}  ✅ {key}: {data['found']} elementos encontrados")
                    result['tests']['selectors'] = True
                else:
                    print(f"{Fore.RED}  ❌ {key}: 0 elementos (selector: {data['selector']})")
                    result['tests']['selectors'] = False
    elif source.get('scraper_type') == 'playwright':
        print(f"{Fore.YELLOW}⚠️  Playwright scraper - Requer teste manual (site usa JavaScript)")
        result['tests']['selectors'] = 'manual'
    
    # 3. Verificar robots.txt
    base_url = urls.get('base', '')
    if base_url:
        robots_url = f"{base_url}/robots.txt"
        accessible, status, _ = test_url_accessible(robots_url)
        if accessible:
            print(f"{Fore.GREEN}✅ robots.txt encontrado")
            result['tests']['robots'] = True
        else:
            print(f"{Fore.YELLOW}⚠️  robots.txt não encontrado (OK se site permite)")
            result['tests']['robots'] = 'notfound'
    
    # Overall
    result['overall'] = result['tests'].get('url', False) and \
                       (result['tests'].get('selectors', False) or 
                        result['tests'].get('selectors') == 'manual')
    
    if result['overall']:
        print(f"\n{Fore.GREEN}{'='*80}")
        print(f"{Fore.GREEN}✅ {source['name']}: VALIDADO")
        print(f"{Fore.GREEN}{'='*80}")
    else:
        print(f"\n{Fore.RED}{'='*80}")
        print(f"{Fore.RED}❌ {source['name']}: REQUER AJUSTES")
        print(f"{Fore.RED}{'='*80}")
    
    return result

def main():
    """Main test runner"""
    print(f"""
{Fore.CYAN}╔════════════════════════════════════════════════════════════════════════════╗
║                 AtlasReg Scraper Validation by ness.                       ║
╚════════════════════════════════════════════════════════════════════════════╝
    """)
    
    sources = load_sources()
    
    print(f"{Fore.YELLOW}📋 Fontes habilitadas: {len(sources)}\n")
    
    results = []
    
    for i, source in enumerate(sources, 1):
        print(f"\n{Fore.YELLOW}[{i}/{len(sources)}] ", end='')
        result = validate_source(source)
        results.append(result)
        time.sleep(2)  # Rate limiting entre testes
    
    # Sumário final
    print(f"\n\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.CYAN}📊 SUMÁRIO DE VALIDAÇÃO")
    print(f"{Fore.CYAN}{'='*80}\n")
    
    passed = sum(1 for r in results if r['overall'])
    failed = len(results) - passed
    
    for result in results:
        status = f"{Fore.GREEN}✅ OK" if result['overall'] else f"{Fore.RED}❌ FALHOU"
        print(f"{status} - {result['name']}")
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.GREEN}✅ Validados: {passed}/{len(results)}")
    print(f"{Fore.RED}❌ Falharam: {failed}/{len(results)}")
    
    if passed == len(results):
        print(f"\n{Fore.GREEN}🎉 TODOS OS SCRAPERS VALIDADOS!")
    else:
        print(f"\n{Fore.YELLOW}⚠️  Alguns scrapers precisam ajuste nos selectors")
    
    print(f"{Fore.CYAN}{'='*80}\n")
    
    # Salvar relatório
    report_path = Path(__file__).parent / 'validation_report.yaml'
    with open(report_path, 'w') as f:
        yaml.dump({
            'validation_date': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_sources': len(results),
            'passed': passed,
            'failed': failed,
            'results': results
        }, f, default_flow_style=False)
    
    print(f"{Fore.CYAN}📄 Relatório salvo: {report_path}\n")

if __name__ == '__main__':
    main()

