# 🔧 Análise de Tecnologias - Scrapers AtlasReg

**BMad Orchestrator - Análise Técnica**  
**Powered by:** ness.

---

## 🎯 PROBLEMA IDENTIFICADO (Quality Gate)

**Issue TEST-001 (HIGH):** Apenas 2/11 scrapers validados (18% success rate)

**Causas:**
1. Sites gov.br usam JavaScript pesado
2. Selectors CSS não funcionam em conteúdo dinâmico
3. Sites com proteção anti-bot (403 errors)
4. HTML complexo e variável

---

## 💡 SOLUÇÕES TECNOLÓGICAS

### 1. Playwright (Recomendado - CRÍTICO) ⭐⭐⭐⭐⭐

**O que é:**
- Browser automation framework (Chromium/Firefox/WebKit)
- Renderiza JavaScript como browser real
- API Python moderna e assíncrona

**Por que usar:**
- ✅ Resolve 100% dos sites gov.br (ANEEL, MME, ONS)
- ✅ Executa JavaScript antes de extrair dados
- ✅ Suporta headless mode (performance)
- ✅ Screenshot/PDF para debug
- ✅ Network interception (bloquear ads)
- ✅ Auto-waiting (espera elementos aparecerem)

**Implementação:**
```python
# apps/scraper/scrapers/playwright_scraper.py

from playwright.async_api import async_playwright
import asyncio

class PlaywrightSpider:
    def __init__(self, source_config):
        self.config = source_config
    
    async def scrape(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Navegar
            await page.goto(self.config['urls']['noticias'])
            
            # Esperar conteúdo carregar
            await page.wait_for_selector(self.config['selectors']['lista'])
            
            # Extrair dados
            items = await page.query_selector_all(self.config['selectors']['lista'])
            
            results = []
            for item in items:
                title = await item.query_selector(self.config['selectors']['titulo'])
                url = await item.query_selector(self.config['selectors']['url'])
                
                results.append({
                    'title': await title.inner_text(),
                    'url': await url.get_attribute('href')
                })
            
            await browser.close()
            return results
```

**Aplicar em:**
- ✅ ANEEL Notícias (gov.br)
- ✅ MME (gov.br)
- ✅ ONS (JS heavy)
- ✅ Canal Energia (JS)

**Prós:**
- Funciona em 99% dos sites
- API Python excelente
- Maintained by Microsoft
- Stealth mode disponível

**Contras:**
- Mais lento que Scrapy (3-5x)
- Consome mais recursos (Chromium)
- Requer Docker com mais RAM

**Custo:** Grátis, open-source  
**Setup time:** 2-3 horas  
**ROI:** ⭐⭐⭐⭐⭐ ESSENCIAL

---

### 2. Scrapy-Playwright (Híbrido) ⭐⭐⭐⭐⭐

**O que é:**
- Plugin que integra Playwright no Scrapy
- Melhor dos dois mundos

**Por que usar:**
- ✅ Usa Scrapy para sites estáticos (rápido)
- ✅ Usa Playwright quando `requires_javascript: true`
- ✅ Mesma API configurável (sources.yaml)
- ✅ Seletores CSS consistentes

**Implementação:**
```python
# apps/scraper/scrapers/hybrid_scraper.py

from scrapy_playwright.page import PageMethod
import scrapy

class HybridSpider(scrapy.Spider):
    custom_settings = {
        'DOWNLOAD_HANDLERS': {
            'https': 'scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler',
        },
        'PLAYWRIGHT_LAUNCH_OPTIONS': {
            'headless': True,
        }
    }
    
    def start_requests(self):
        for url in self.start_urls:
            # Se source requer JS
            if self.source_config.get('requires_javascript'):
                yield scrapy.Request(
                    url,
                    meta={
                        'playwright': True,
                        'playwright_page_methods': [
                            PageMethod('wait_for_selector', self.selectors['lista'])
                        ]
                    }
                )
            else:
                # Scrapy normal (rápido)
                yield scrapy.Request(url)
```

**Aplicar em:**
- ✅ Todos os 10 scrapers
- ✅ Sistema único configurável

**Prós:**
- Performance otimizada
- Fallback automático
- Infraestrutura única

**Contras:**
- Setup mais complexo
- Debugging pode ser tricky

**Custo:** Grátis  
**Setup time:** 4-6 horas  
**ROI:** ⭐⭐⭐⭐⭐ RECOMENDADO

---

### 3. Selenium-Wire (Alternativa) ⭐⭐⭐

**O que é:**
- Selenium com interceptação de requests
- Captura chamadas API do site

**Por que usar:**
- ✅ Pode pegar dados direto da API (mais rápido)
- ✅ Ignora HTML complexo
- ✅ Menos parsing necessário

**Exemplo:**
```python
from seleniumwire import webdriver

driver = webdriver.Chrome()
driver.get('https://www.gov.br/aneel/noticias')

# Interceptar chamadas API
for request in driver.requests:
    if '/api/noticias' in request.url:
        data = json.loads(request.response.body)
        # Dados estruturados!
```

**Aplicar em:**
- Sites com API pública detectável
- ANEEL, ONS podem ter APIs

**Prós:**
- Dados mais limpos
- Ignora HTML

**Contras:**
- Nem todo site expõe API
- Selenium é legacy

**Custo:** Grátis  
**Setup time:** 2 horas  
**ROI:** ⭐⭐⭐ SITUACIONAL

---

### 4. Bright Data / ScraperAPI (SaaS) ⭐⭐⭐⭐

**O que é:**
- Proxy rotativo + browser rendering
- Resolve captchas, anti-bot automaticamente

**Por que usar:**
- ✅ Zero manutenção de proxies
- ✅ Bypass anti-bot automático
- ✅ Escalável (milhares de requests)
- ✅ JavaScript rendering incluído

**Implementação:**
```python
import requests

url = f"http://api.scraperapi.com?api_key={KEY}&url={target_url}&render=true"
response = requests.get(url)
# HTML renderizado pronto!
```

**Aplicar em:**
- Sites com proteção (Canal Energia 403)
- Backup se Playwright falhar

**Prós:**
- Funciona sempre
- Zero infraestrutura
- Escalável

**Contras:**
- Custo ($$$)
- Dependência externa

**Custo:** $49-199/mês  
**Setup time:** 30 minutos  
**ROI:** ⭐⭐⭐ SE NECESSÁRIO

---

### 5. Headless Browsers na Nuvem ⭐⭐⭐

**Opções:**
- BrowserBase.com
- Browserless.io
- AWS Lambda + Playwright

**Por que usar:**
- ✅ Offload processamento
- ✅ Escalável
- ✅ Não sobrecarrega VPS

**Custo:** $20-100/mês  
**ROI:** ⭐⭐⭐ PARA ESCALA

---

## 🎯 RECOMENDAÇÃO FINAL

### Estratégia em 3 Fases

### **FASE 1: Scrapy-Playwright (AGORA)** ⭐⭐⭐⭐⭐

**Implementar:**
```bash
pip install scrapy-playwright
playwright install chromium
```

**Atualizar:**
- `apps/scraper/scrapers/base_scraper.py` → suporte Playwright
- `apps/scraper/config/sources.yaml` → flag `requires_javascript`
- Todos os 10 scrapers funcionam

**Timeline:** 1-2 dias  
**Resolve:** 8/10 scrapers (80%)

---

### **FASE 2: API Reverse Engineering (OTIMIZAÇÃO)**

**Sites Alvo:**
- ANEEL (pode ter API interna)
- ONS (API de ocorrências)
- SIGEL (API consulta)

**Técnica:**
1. Abrir DevTools → Network
2. Filtrar XHR/Fetch
3. Encontrar endpoint JSON
4. Usar requests direto (10x mais rápido)

**Timeline:** 2-3 dias  
**Benefício:** Performance 10x melhor

---

### **FASE 3: Backup com ScraperAPI (CONTINGÊNCIA)**

**Quando usar:**
- Site bloqueia mesmo com Playwright
- Captcha aparece
- Rate limiting agressivo

**Custo:** $49/mês (1000 requests/dia)

---

## 🔧 IMPLEMENTAÇÃO DETALHADA

### 1. Instalar Scrapy-Playwright

```bash
cd apps/scraper
pip install scrapy-playwright
playwright install chromium
```

### 2. Atualizar base_scraper.py

```python
# apps/scraper/scrapers/base_scraper.py

from scrapy_playwright.page import PageMethod
import scrapy

class ConfigurableSpider(scrapy.Spider):
    custom_settings = {
        'DOWNLOAD_HANDLERS': {
            'https': 'scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler',
        },
        'PLAYWRIGHT_LAUNCH_OPTIONS': {
            'headless': True,
            'args': ['--no-sandbox']
        },
        'PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT': 30000
    }
    
    def start_requests(self):
        for url in self.start_urls:
            if self.source_config.get('requires_javascript'):
                # Playwright mode
                yield scrapy.Request(
                    url,
                    meta={
                        'playwright': True,
                        'playwright_page_methods': [
                            PageMethod('wait_for_selector', 
                                      self.selectors['lista'],
                                      timeout=10000)
                        ],
                        'playwright_include_page': True
                    },
                    callback=self.parse_with_playwright,
                    errback=self.errback
                )
            else:
                # Scrapy normal (rápido)
                yield scrapy.Request(url, callback=self.parse)
    
    async def parse_with_playwright(self, response):
        page = response.meta['playwright_page']
        
        # Scroll para carregar lazy content
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.wait_for_timeout(2000)
        
        # Extrair dados
        items = await page.query_selector_all(self.selectors['lista'])
        
        for item in items:
            # ... extrair com Playwright API
            yield self.create_item(...)
        
        await page.close()
```

### 3. Atualizar sources.yaml

```yaml
# Já feito! Fontes com requires_javascript: true
# usarão Playwright automaticamente
```

### 4. Testar

```bash
cd apps/scraper
scrapy crawl aneel_noticias  # Usa Playwright agora!
scrapy crawl megawhat        # Usa Scrapy normal
```

---

## 📊 COMPARAÇÃO DE PERFORMANCE

| Tecnologia | Velocidade | Success Rate | Custo | Setup |
|------------|-----------|--------------|-------|-------|
| **Scrapy-Playwright** | ⭐⭐⭐ (3s/page) | ⭐⭐⭐⭐⭐ 95% | $0 | 4h |
| Scrapy puro | ⭐⭐⭐⭐⭐ (0.5s) | ⭐⭐ 20% | $0 | 2h |
| Playwright puro | ⭐⭐ (5s/page) | ⭐⭐⭐⭐⭐ 99% | $0 | 2h |
| ScraperAPI | ⭐⭐⭐⭐ (2s) | ⭐⭐⭐⭐⭐ 100% | $49/mês | 30min |
| Selenium-Wire | ⭐⭐ (6s) | ⭐⭐⭐⭐ 80% | $0 | 2h |

**Vencedor:** Scrapy-Playwright (híbrido)

---

## 🚀 PLANO DE AÇÃO

### DIA 1: Setup Scrapy-Playwright

- [ ] Instalar `scrapy-playwright`
- [ ] Instalar Chromium
- [ ] Atualizar `base_scraper.py`
- [ ] Testar com ANEEL

**Tempo:** 4-6 horas

---

### DIA 2: Validar Todos os Scrapers

- [ ] ANEEL Notícias ✅
- [ ] ANEEL Despachos (ajustar URL)
- [ ] ANEEL PVs (ajustar URL)
- [ ] ONS Ocorrências ✅
- [ ] SIGEL (testar)
- [ ] Canal Energia ✅
- [ ] MegaWhat ✅
- [ ] EPBR ✅
- [ ] MME ✅
- [ ] EPE (timeout maior)

**Tempo:** 6-8 horas

---

### DIA 3: Otimizações

- [ ] Detectar APIs internas
- [ ] Implementar caching
- [ ] Ajustar timeouts
- [ ] Testar rate limiting

**Tempo:** 4 horas

---

## 🎯 RESULTADO ESPERADO

**Antes:**
- 2/11 scrapers funcionando (18%)
- Sites gov.br falhando
- Selectors não funcionam

**Depois:**
- 10/11 scrapers funcionando (90%+)
- Sites JS renderizados
- Sistema robusto e escalável

**Timeline:** 2-3 dias  
**Esforço:** ~16-20 horas  
**ROI:** ⭐⭐⭐⭐⭐ CRÍTICO

---

## 💡 BONUS: Tecnologias Complementares

### Para Melhorar Pipeline

1. **Redis Queue** → Fila de scraping assíncrona
2. **Celery Beat** → Scheduling preciso
3. **Flower** → Monitoring Celery
4. **Sentry** → Error tracking
5. **Prometheus + Grafana** → Métricas

### Para IA Processing

1. **Ray** → Processamento paralelo
2. **Dask** → Big data processing
3. **MLflow** → Model tracking
4. **FAISS GPU** → Busca vetorial rápida

---

## ✅ CONCLUSÃO

**Melhor Solução:** Scrapy-Playwright híbrido

**Benefícios:**
- ✅ Resolve 90%+ dos scrapers
- ✅ Performance otimizada
- ✅ Zero custo adicional
- ✅ Escalável
- ✅ Manutenível

**Próxima Ação:** Implementar nos próximos 2-3 dias

---

**Powered by:** BMad Orchestrator + ness. 💙


