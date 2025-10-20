# AtlasReg Scraper by ness.

**Sistema Configurável de Web Scraping para Inteligência de Mercado**

---

## 🎯 Visão Geral

Sistema de coleta automatizada de notícias e documentos do setor de transmissão de energia elétrica brasileiro.

### Features

- ✅ **Configurável via YAML** - Adicionar fontes sem código
- ✅ **Multi-source** - 10+ fontes configuradas
- ✅ **Agendamento automático** - Airflow DAGs
- ✅ **Scraping ético** - Rate limiting, robots.txt
- ✅ **Retry logic** - 3 tentativas com backoff
- ✅ **Storage MinIO** - Documentos brutos salvos
- ✅ **Metadata PostgreSQL** - Tracking de documentos
- ✅ **Pipeline automático** - Dispara processamento IA

---

## 📁 Estrutura

```
apps/scraper/
├── config/
│   └── sources.yaml ............ Configuração de todas as fontes
│
├── scrapers/
│   ├── base_scraper.py ......... Spider configurável base
│   ├── spider_factory.py ....... Factory de spiders
│   └── pipelines.py ............ MinIO + PostgreSQL pipelines
│
├── dags/
│   ├── dynamic_scrapers_dag.py . Gerador automático de DAGs
│   └── aneel_daily_scraper.py .. DAG exemplo manual
│
├── processors/
│   ├── pdf_processor.py ........ PDF to text (TODO)
│   ├── classifier.py ........... BERTimbau (TODO)
│   └── entity_extractor.py ..... spaCy (TODO)
│
└── requirements.txt ............ Python dependencies
```

---

## 🔧 Configuração de Fontes (sources.yaml)

### Fontes Habilitadas (10)

**Regulatórias:**
1. ✅ **ANEEL Notícias** - Diário 06:00
2. ✅ **ANEEL Despachos** - Diário 07:00
3. ✅ **ANEEL PVs (Multas)** - Semanal (segundas 08:00)
4. ✅ **ONS Ocorrências** - Diário 06:30

**Cadastrais:**
5. ✅ **SIGEL** - Mensal (dia 1, 09:00)

**Mídia:**
6. ✅ **Canal Energia** - Diário 09:00
7. ✅ **MegaWhat** - Diário 09:30
8. ✅ **EPBR** - Diário 10:00

**Governo:**
9. ✅ **MME** - Diário 13:00
10. ✅ **EPE** - Semanal (segundas 00:00)

**Opcionais (Fase 2):**
- ABRATE (Associação)
- B3 Fatos Relevantes (API)
- CVM
- Estadão, Valor Econômico (paywall)

---

## 🚀 Como Adicionar Nova Fonte

### 1. Editar sources.yaml

```yaml
sources:
  - id: nova_fonte
    name: "Minha Fonte de Notícias"
    enabled: true
    priority: medium
    category: midia
    urls:
      base: "https://minhafonte.com.br"
      noticias: "https://minhafonte.com.br/noticias"
    scraper_type: scrapy
    schedule: "0 14 * * *"  # Diário 14:00
    selectors:
      lista: "article.noticia"
      titulo: "h2::text"
      url: "a::attr(href)"
      data: "time::attr(datetime)"
      resumo: "p.desc::text"
    filters:
      keywords:
        - transmissão
        - energia
    rate_limit: 5
```

### 2. Reiniciar Airflow

```bash
docker-compose restart airflow-scheduler
```

**Pronto!** DAG criado automaticamente.

---

## 🕷️ Como Funciona

### Sistema Configurável

```
1. sources.yaml
   ↓ (lido por)
2. spider_factory.py
   ↓ (cria)
3. ConfigurableSpider(source_id)
   ↓ (executa)
4. Scrapy crawl
   ↓ (salva via)
5. Pipelines → MinIO + PostgreSQL
   ↓ (dispara)
6. Celery task → Processamento IA
```

### Exemplo de Execução

```python
# Airflow dispara
python spider_factory.py aneel_noticias

# Spider carrega config
config = yaml.load('sources.yaml')
source = config['sources']['aneel_noticias']

# Visita URLs
response = scrapy.Request(source['urls']['noticias'])

# Extrai dados com selectors
items = response.css(source['selectors']['lista'])
titulo = item.css(source['selectors']['titulo']).get()

# Verifica filtros
if 'transmissão' in titulo:
    # Coleta!
    yield item

# Pipeline salva
MinIOPipeline.process_item(item)
PostgreSQLPipeline.process_item(item)
```

---

## 📊 Monitoramento

### Airflow UI

**URL:** http://localhost:8200  
**Login:** admin / admin

**Visualiza:**
```
DAGs:
├─ scraper_aneel_noticias    ✅ Success (06:05) - 8 itens
├─ scraper_aneel_despachos   ✅ Success (07:12) - 23 itens
├─ scraper_ons_ocorrencias   ✅ Success (06:35) - 5 itens
├─ scraper_canal_energia     ✅ Success (09:08) - 12 itens
└─ scraper_megawhat          ⏳ Running (09:32)

Total hoje: 48 documentos coletados
```

### MinIO Console

**URL:** http://localhost:19001  
**Login:** admin / atlasreg2025

**Estrutura:**
```
raw-documents/
├── aneel_noticias/
│   └── 2025-10-17/
│       ├── aneel-aprova-reajuste-a1b2c3d4.json
│       ├── nova-outorga-transmissora-x-e5f6g7h8.json
│       └── ...
├── ons_ocorrencias/
│   └── 2025-10-17/
│       └── desligamento-lt-230kv-i9j0k1l2.json
└── canal_energia/
    └── 2025-10-17/
        └── mercado-transmissao-m3n4o5p6.json
```

---

## 🔍 Busca por Keywords

### Filtros Configuráveis

Cada source pode ter keywords para filtrar conteúdo:

```yaml
filters:
  keywords:
    - transmissão
    - transmissora
    - linhas de transmissão
    - subestação
    - RAP
    - outorga
```

**Lógica:**
- Notícia com "transmissão" no título → ✅ Coleta
- Notícia sobre geração hidrelétrica → ❌ Ignora
- Notícia sobre "transmissora X recebe multa" → ✅ Coleta

---

## ⏰ Schedule Automático

### Timeline Diária

```
06:00 ─► ANEEL Notícias        (5-10 docs)
06:30 ─► ONS Ocorrências        (5-15 docs)
07:00 ─► ANEEL Despachos        (20-50 docs)
08:00 ─► ANEEL PVs (seg)        (10-20 docs/semana)
09:00 ─► Canal Energia          (10-20 docs)
09:30 ─► MegaWhat               (5-10 docs)
10:00 ─► EPBR                   (5-10 docs)
12:00 ─► ABRATE                 (5 docs)
13:00 ─► MME                    (5-10 docs)

Total: ~60-135 docs/dia
```

### Schedule por Categoria

```yaml
# Crítico - múltiplas vezes/dia
regulatorio: */6 * * * *     # A cada 6h

# Importante - diário
midia: 0 9 * * *             # Uma vez/dia manhã

# Cadastral - periódico
cadastral: 0 9 1 * *         # Mensal

# Financeiro - tempo real (Fase 2)
financeiro: */30 * * * *     # A cada 30min
```

---

## 🛠️ Comandos

### Testar Scraper Manualmente

```bash
# Rodar spider específico
cd apps/scraper
scrapy crawl aneel_noticias

# Com output
scrapy crawl aneel_noticias -o output.json

# Apenas verificar (dry-run)
scrapy crawl aneel_noticias -s LOG_LEVEL=DEBUG
```

### Listar Spiders Disponíveis

```bash
scrapy list
# Output:
# aneel_noticias
# aneel_despachos
# ons_ocorrencias
# canal_energia
# megawhat
# ...
```

### Verificar Config

```bash
# Validar YAML
python -c "import yaml; print(yaml.safe_load(open('config/sources.yaml')))"

# Listar sources habilitadas
python scrapers/spider_factory.py
```

---

## 📈 Estatísticas Esperadas

### Por Mês

- **Documentos coletados:** ~1,800-4,000
- **Eventos processados:** ~800-1,500 (após filtros e dedup)
- **Multas detectadas:** ~30-50
- **Decisões regulatórias:** ~100-200
- **Transações M&A:** ~5-10
- **Incidentes operacionais:** ~150-300

### Storage

- **MinIO (raw):** ~500MB-1GB/mês
- **PostgreSQL:** ~100-200MB/mês (metadata)
- **Elasticsearch:** ~200-500MB/mês (indexes)

---

## 🚨 Tratamento de Erros

### Retry Automático

```python
# Se scraper falha:
retry_times=3
retry_delay=5min (exponencial)

# Tentativa 1: Falha
# Aguarda 5min
# Tentativa 2: Falha
# Aguarda 10min
# Tentativa 3: Falha
# ❌ Marca como failed
# 📧 Email para admin
```

### Alertas

```yaml
# Configurado em sources.yaml
global_settings:
  alert_on_zero_results: true
  alert_on_errors: true
  alert_recipients:
    - admin@atlasreg.com
```

---

## ✅ Próximos Passos

1. **Validar URLs** - Testar manualmente cada fonte
2. **Ajustar Selectors** - HTML real pode variar
3. **Implementar Playwright** - Para sites JS (ONS, Canal Energia)
4. **PDF Processing** - PDFMiner + OCR
5. **Celery Integration** - Disparar processamento
6. **Database Models** - Tabela documents completa

---

**Sistema configurável permite adicionar fontes em minutos! ⚡**

**Ver:** `/BUSCA_NOTICIAS_EXPLICADO.md` para detalhes técnicos


