# 🎛️ AtlasReg - Sistema Configurável por YAML

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)

---

## 🌟 INOVAÇÃO PRINCIPAL

**Sistema 100% configurável via YAML** - Adicione fontes de scraping sem escrever código!

---

## 📋 Como Funciona

### 1. Configuração Central (sources.yaml)

```yaml
sources:
  - id: nova_fonte
    name: "Minha Nova Fonte"
    enabled: true
    urls:
      noticias: "https://site.com/noticias"
    schedule: "0 9 * * *"
    selectors:
      lista: "article.post"
      titulo: "h2::text"
      url: "a::attr(href)"
```

### 2. Sistema Lê e Cria Spiders Automaticamente

```python
# spider_factory.py
config = yaml.load('sources.yaml')

for source in config['sources']:
    if source['enabled']:
        spider = create_spider(source)
        register_spider(spider)
```

### 3. Airflow Cria DAGs Dinamicamente

```python
# dynamic_scrapers_dag.py
for source in enabled_sources:
    dag = create_dag(
        dag_id=f"scraper_{source['id']}",
        schedule=source['schedule']
    )
```

**Resultado:** Adicione fonte em 2 minutos, sem código!

---

## 🎯 Fontes Configuradas

### ✅ 10 Fontes Habilitadas

| ID | Nome | Frequência | Docs/dia |
|----|------|------------|----------|
| `aneel_noticias` | ANEEL Notícias | Diário 06:00 | 5-10 |
| `aneel_despachos` | ANEEL Despachos | Diário 07:00 | 20-50 |
| `aneel_pv` | ANEEL Multas | Semanal 08:00 | 10-20 |
| `ons_ocorrencias` | ONS Ocorrências | Diário 06:30 | 5-15 |
| `sigel` | SIGEL Cadastro | Mensal 09:00 | 100-200 |
| `canal_energia` | Canal Energia | Diário 09:00 | 10-20 |
| `megawhat` | MegaWhat | Diário 09:30 | 5-10 |
| `epbr` | EPBR | Diário 10:00 | 5-10 |
| `mme` | MME | Diário 13:00 | 5-10 |
| `epe` | EPE | Semanal 00:00 | 5-10 |

**Total:** ~60-135 docs/dia automaticamente

### 🔜 6 Fontes Preparadas (Fase 2)

- `estadao_economia_energia`
- `valor_economico_energia`
- `abrate` (Associação)
- `b3_fatos_relevantes` (API)
- `cvm_avisos`
- `abce`

---

## ⚡ Exemplo de Adição

### Antes (Sistema Tradicional)

```python
# 1. Criar spider manualmente
class NovaFonteSpider(scrapy.Spider):
    name = 'nova_fonte'
    start_urls = ['https://site.com/noticias']
    
    def parse(self, response):
        for item in response.css('article'):
            yield {
                'titulo': item.css('h2::text').get(),
                # ... 50 linhas de código
            }

# 2. Criar pipeline
class NovaFontePipeline:
    # ... 30 linhas

# 3. Criar DAG Airflow
def nova_fonte_dag():
    # ... 40 linhas

# 4. Registrar em settings.py
# ... 10 linhas

# TOTAL: ~130 linhas de código Python
# TEMPO: 2-4 horas
```

### Depois (Sistema Configurável)

```yaml
# sources.yaml
- id: nova_fonte
  name: "Nova Fonte de Notícias"
  enabled: true
  urls:
    noticias: "https://site.com/noticias"
  schedule: "0 9 * * *"
  selectors:
    lista: "article"
    titulo: "h2::text"
    url: "a::attr(href)"
  rate_limit: 5

# TOTAL: 10 linhas YAML
# TEMPO: 2-5 minutos
# Spider + Pipeline + DAG criados automaticamente!
```

**Redução:** 130 linhas → 10 linhas (92% menos código)  
**Velocidade:** 4 horas → 5 minutos (48x mais rápido)

---

## 🔧 Estrutura do sources.yaml

### Campos Obrigatórios

```yaml
- id: identificador_unico        # String sem espaços
  name: "Nome Legível"           # Para logs/UI
  enabled: true                  # true/false
  urls:
    base: "https://site.com"     # URL base
  schedule: "0 6 * * *"          # Cron expression
```

### Campos Opcionais

```yaml
  priority: high                 # high, medium, low
  category: regulatorio          # Categoria
  scraper_type: scrapy           # scrapy ou playwright
  
  selectors:                     # CSS selectors
    lista: "article.post"
    titulo: "h2::text"
    url: "a::attr(href)"
    data: "time::attr(datetime)"
    resumo: "p.desc::text"
  
  filters:                       # Filtros de conteúdo
    keywords:
      - transmissão
      - energia
  
  rate_limit: 5                  # Segundos entre requests
  requires_javascript: false     # Usar Playwright?
  paywall_aware: false           # Respeitar paywall?
```

---

## 🚀 Pipeline Automático

### Fluxo Completo

```
1. sources.yaml
   ↓
2. spider_factory.py lê config
   ↓
3. ConfigurableSpider criado dinamicamente
   ↓
4. Airflow cria DAG automaticamente
   ↓
5. Schedule dispara scraper
   ↓
6. Spider coleta dados
   ↓
7. MinIOPipeline salva em bucket
   ↓
8. PostgreSQLPipeline registra metadata
   ↓
9. ProcessingTrigger dispara Celery
   ↓
10. IA processa (BERTimbau + spaCy)
   ↓
11. Event criado no banco
   ↓
12. Frontend atualiza
```

**Zero intervenção manual após configurar!**

---

## 📊 Componentes do Sistema

### 1. Spider Factory (`spider_factory.py`)

```python
def create_spider_class(source_config):
    """Cria spider dinamicamente de config YAML"""
    
    class DynamicSpider(ConfigurableSpider):
        name = source_config['id']
        start_urls = [source_config['urls']['noticias']]
        selectors = source_config['selectors']
        # ... configuração automática
    
    return DynamicSpider

# Gerar todos os spiders
ALL_SPIDERS = {
    source['id']: create_spider_class(source)
    for source in enabled_sources
}
```

### 2. Base Scraper (`base_scraper.py`)

```python
class ConfigurableSpider(scrapy.Spider):
    """Spider que lê tudo do YAML"""
    
    def __init__(self, source_id: str):
        # Carregar config do YAML
        config = yaml.load('sources.yaml')
        self.source = find_source(config, source_id)
        
        # Configurar automaticamente
        self.start_urls = [self.source['urls']['noticias']]
        self.selectors = self.source['selectors']
        self.rate_limit = self.source['rate_limit']
    
    def parse(self, response):
        # Parse genérico usando selectors do config
        lista = response.css(self.selectors['lista'])
        
        for item in lista:
            titulo = item.css(self.selectors['titulo']).get()
            url = item.css(self.selectors['url']).get()
            
            if self.should_collect(titulo):  # Filtros
                yield self.create_item(titulo, url, ...)
```

### 3. Dynamic DAG Generator (`dynamic_scrapers_dag.py`)

```python
# Gerar DAG para cada source
for source in enabled_sources:
    dag = DAG(
        dag_id=f'scraper_{source["id"]}',
        schedule_interval=source['schedule'],
        # ... configuração automática
    )
    
    with dag:
        scrape = BashOperator(
            bash_command=f"scrapy crawl {source['id']}"
        )
        check = PythonOperator(...)
        process = PythonOperator(...)
        
        scrape >> check >> process
    
    globals()[f"scraper_{source['id']}"] = dag

# Airflow detecta DAGs automaticamente!
```

---

## 🎨 Benefícios

### Para Desenvolvedores

- ✅ **Sem código boilerplate** - YAML declara tudo
- ✅ **Manutenção fácil** - Um arquivo para 10+ fontes
- ✅ **Testável** - `scrapy crawl fonte_id` testa imediatamente
- ✅ **Versionável** - Git diff mostra mudanças claramente
- ✅ **Documentado** - YAML é auto-documentado

### Para Produto

- ✅ **Time to market** - Nova fonte em minutos
- ✅ **Escalável** - 50+ fontes sem complexidade
- ✅ **Configurável** - PM pode ajustar keywords sem dev
- ✅ **Auditável** - Config centralizada
- ✅ **Flexível** - Adiciona/remove fontes facilmente

### Para Operações

- ✅ **Monitorável** - Airflow UI mostra tudo
- ✅ **Retry automático** - 3 tentativas configurável
- ✅ **Alertas** - Email se zero resultados ou erro
- ✅ **Rate limiting** - Respeita sites
- ✅ **Logs estruturados** - JSON para análise

---

## 📈 Escalabilidade

### Adicionar 50 Fontes

```yaml
# sources.yaml fica com ~500 linhas
# vs ~6.500 linhas de código Python (13x economia)

# Performance:
- 50 spiders configuráveis: ✅ OK
- 50 DAGs Airflow: ✅ OK
- Concurrent: 3 (configurável)
- Total scraping time: ~2-3h/dia
```

### Exemplo Real

```
Fase 1 (MVP): 10 fontes
├─ sources.yaml: 400 linhas
├─ Código Python: 800 linhas (reutilizável)
└─ Total: 1.200 linhas

Fase 2: +15 fontes (25 total)
├─ sources.yaml: +600 linhas
├─ Código Python: +0 linhas (reutiliza!)
└─ Total: +600 linhas

Fase 3: +25 fontes (50 total)
├─ sources.yaml: +1.000 linhas
├─ Código Python: +0 linhas
└─ Total: +1.000 linhas

Economia vs Tradicional:
50 fontes × 130 linhas/fonte = 6.500 linhas
Sistema configurável: 2.200 linhas
REDUÇÃO: 66%
```

---

## 🔍 Exemplo Completo

### sources.yaml

```yaml
sources:
  - id: canal_energia
    name: "Canal Energia"
    enabled: true
    priority: medium
    category: midia
    
    urls:
      base: "https://www.canalenergia.com.br"
      noticias: "https://www.canalenergia.com.br/noticias/"
      transmissao: "https://www.canalenergia.com.br/noticias/categoria/transmissao/"
    
    scraper_type: playwright
    schedule: "0 9 * * *"
    
    selectors:
      lista: "article.post"
      titulo: "h2.entry-title a::text"
      url: "h2.entry-title a::attr(href)"
      data: "time.entry-date::attr(datetime)"
      resumo: "div.entry-summary::text"
    
    filters:
      keywords:
        - transmissão
        - transmissora
        - linha de transmissão
        - subestação
    
    rate_limit: 5
    requires_javascript: true
```

### Uso

```bash
# 1. Testar manualmente
scrapy crawl canal_energia

# 2. Ver DAG no Airflow
# http://localhost:8200
# DAG "scraper_canal_energia" criado automaticamente

# 3. Monitorar resultados
# MinIO: raw-documents/canal_energia/
# PostgreSQL: SELECT * FROM documents WHERE source='canal_energia'
```

---

## ✅ Checklist de Nova Fonte

### Passo 1: Análise (5 min)

- [ ] Abrir site target no Chrome
- [ ] F12 → Inspecionar HTML
- [ ] Identificar seletores CSS
- [ ] Verificar se usa JavaScript (Playwright?)
- [ ] Checar robots.txt

### Passo 2: Configuração (2 min)

- [ ] Editar `apps/scraper/config/sources.yaml`
- [ ] Adicionar entrada com campos obrigatórios
- [ ] Definir selectors
- [ ] Configurar filtros (keywords)
- [ ] Salvar arquivo

### Passo 3: Teste (3 min)

```bash
# Validar YAML
python -c "import yaml; yaml.safe_load(open('config/sources.yaml'))"

# Testar scraper
cd apps/scraper
scrapy crawl nova_fonte_id

# Ver resultados
ls /tmp/nova_fonte*.json
```

### Passo 4: Deploy (1 min)

```bash
# Reiniciar Airflow
docker-compose restart airflow-scheduler

# Verificar DAG criado
# http://localhost:8200
```

**Total: 10-15 minutos!**

---

## 🎯 Conclusão

**Sistema Configurável = Produtividade Exponencial**

- 10 fontes configuradas em 1 dia
- 25 fontes em 3 dias
- 50 fontes em 1 semana

vs Tradicional:
- 10 fontes em 2 semanas
- 25 fontes em 5 semanas
- 50 fontes em 10 semanas

**Ganho: 10x mais rápido! 🚀**

---

**Arquivos Principais:**
- `/apps/scraper/config/sources.yaml` - Configuração central
- `/apps/scraper/scrapers/base_scraper.py` - Spider configurável
- `/apps/scraper/scrapers/spider_factory.py` - Factory de spiders
- `/apps/scraper/dags/dynamic_scrapers_dag.py` - Gerador de DAGs

**Ver também:**
- `/apps/scraper/README.md` - Documentação completa
- `/apps/scraper/config/README.md` - Guia de configuração
- `/COMO_FUNCIONA_A_BUSCA.md` - Pipeline de busca


