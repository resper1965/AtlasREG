# 🔍 Como o AtlasReg Busca Notícias - EXPLICADO

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)

---

## 📖 PARA QUEM NÃO É TÉCNICO

### Como Funciona (Analogia Simples)

Imagine que você tem um **assistente robô** que:

1. **🌅 Todo dia de manhã às 6h:**
   - Abre o site da ANEEL
   - Abre o site do ONS
   - Abre Canal Energia, MegaWhat, EPBR
   - Lê todas as notícias novas

2. **📝 Para cada notícia:**
   - Copia o título
   - Copia a data
   - Copia o texto completo
   - Baixa PDFs se tiver
   - Salva tudo organizado

3. **🤖 Depois analisa com Inteligência Artificial:**
   - É sobre multa? Decisão? Transação?
   - Quais empresas são mencionadas?
   - Tem valores em reais?
   - Quais ativos (linhas, subestações)?

4. **📊 Organiza no Dashboard:**
   - Mostra as notícias classificadas
   - Permite buscar por empresa, tipo, data
   - Destaca eventos importantes

5. **📧 Te avisa por email:**
   - "Olá! Hoje apareceram 3 multas e 1 transação sobre empresas que você monitora"

**Tudo isso automaticamente, sem você fazer nada!**

---

## 🛠️ PARA QUEM É TÉCNICO

### Arquitetura de Scraping

```
┌─────────────────────────────────────────────────┐
│  AIRFLOW SCHEDULER (Orquestrador)               │
│  - Cron: 06:00 daily                            │
│  - Dispara DAGs (tasks agendadas)               │
└──────────────┬──────────────────────────────────┘
               │
               ├─→ DAG 1: ANEEL News (06:00)
               ├─→ DAG 2: ANEEL Despachos (07:00)
               ├─→ DAG 3: ONS Ocorrências (06:30)
               ├─→ DAG 4: SIGEL (Mensal)
               └─→ DAG 5: Mídia (09:00-10:00)
               │
               ↓
┌─────────────────────────────────────────────────┐
│  SCRAPY/PLAYWRIGHT (Workers)                    │
│  - Faz HTTP requests                            │
│  - Parse HTML com CSS selectors                 │
│  - Extrai dados estruturados                    │
│  - Rate limiting (1 req/5s)                     │
│  - Retry logic (3x com backoff)                 │
└──────────────┬──────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────┐
│  MINIO (Object Storage)                         │
│  Bucket: raw-documents/                         │
│  ├─ aneel/news/2025-10-17/noticia1.json        │
│  ├─ aneel/despachos/2025-10-17/despacho1.pdf   │
│  └─ ons/ocorrencias/2025-10-17/ocorrencia1.json│
└──────────────┬──────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────┐
│  POSTGRESQL (Metadata)                          │
│  Tabela: documents                              │
│  - id, filename, source, type, status, url      │
└──────────────┬──────────────────────────────────┘
               │
               ↓ (trigger)
┌─────────────────────────────────────────────────┐
│  CELERY TASK: process_document                  │
│  - Lê de MinIO                                  │
│  - Processa com IA                              │
│  - Salva evento estruturado                     │
└─────────────────────────────────────────────────┘
```

---

## 🕷️ TECNOLOGIAS DE SCRAPING

### 1. Scrapy - Para Sites HTML Estáticos

**Usado em:**
- ANEEL (notícias, despachos)
- ONS (boletins)
- SIGEL (dados cadastrais)

**Como funciona:**
```python
# 1. Define URL inicial
start_urls = ['https://www.gov.br/aneel/pt-br/assuntos/noticias']

# 2. Scrapy faz request HTTP
response = scrapy.Request(url)

# 3. Parse HTML com CSS selectors
noticias = response.css('div.item-noticia')

# 4. Extrai dados
for noticia in noticias:
    titulo = noticia.css('h2::text').get()
    data = noticia.css('time::attr(datetime)').get()
    url = noticia.css('a::attr(href)').get()
```

**Vantagens:**
- ✅ Muito rápido (async)
- ✅ Built-in rate limiting
- ✅ Retry automático
- ✅ Pipelines para processar dados
- ✅ Middlewares (proxies, user-agents)

### 2. Playwright - Para Sites JavaScript

**Usado em:**
- Canal Energia (conteúdo dinâmico)
- Sites que carregam via AJAX
- Sites com infinite scroll

**Como funciona:**
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Abre navegador real (Chromium)
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Navega para URL
    page.goto('https://www.canalenergia.com.br/')
    
    # ESPERA JavaScript carregar
    page.wait_for_selector('article.noticia')
    
    # Extrai dados APÓS JS renderizar
    noticias = page.query_selector_all('article.noticia')
    
    for noticia in noticias:
        titulo = noticia.inner_text()
        # ...
```

**Vantagens:**
- ✅ Renderiza JavaScript
- ✅ Simula navegador real
- ✅ Pode clicar, scroll, preencher forms
- ✅ Screenshots para debug

**Desvantagens:**
- ❌ Mais lento que Scrapy
- ❌ Usa mais recursos (RAM)

---

## ⏰ AGENDAMENTO: Como Funciona

### Airflow Schedule

**Sintaxe Cron:**
```
┌─────────── minuto (0-59)
│ ┌───────── hora (0-23)
│ │ ┌─────── dia do mês (1-31)
│ │ │ ┌───── mês (1-12)
│ │ │ │ ┌─── dia da semana (0-6, 0=domingo)
│ │ │ │ │
0 6 * * *  ← Todo dia às 06:00

0 7 * * *  ← Todo dia às 07:00
0 8 * * 1  ← Toda segunda às 08:00
0 9 1 * *  ← Dia 1 de cada mês às 09:00
```

### Schedule do AtlasReg

```python
# apps/scraper/dags/

# DAG 1: ANEEL Notícias
schedule_interval='0 6 * * *'  # 06:00 diário
# Documentos esperados: 5-10/dia

# DAG 2: ANEEL Despachos
schedule_interval='0 7 * * *'  # 07:00 diário
# Documentos esperados: 20-50/dia

# DAG 3: ANEEL PVs (Multas)
schedule_interval='0 8 * * 1'  # 08:00 segundas
# Documentos esperados: 10-20/semana

# DAG 4: ONS Ocorrências
schedule_interval='30 6 * * *'  # 06:30 diário
# Documentos esperados: 5-15/dia

# DAG 5: SIGEL
schedule_interval='0 9 1 * *'  # Dia 1 do mês 09:00
# Documentos esperados: 100-200/mês

# DAG 6: Canal Energia
schedule_interval='0 9 * * *'  # 09:00 diário
# Documentos esperados: 10-20/dia

# DAG 7: MegaWhat
schedule_interval='30 9 * * *'  # 09:30 diário
# Documentos esperados: 5-10/dia

# DAG 8: EPBR
schedule_interval='0 10 * * *'  # 10:00 diário
# Documentos esperados: 5-10/dia
```

**Total:** ~60-135 documentos coletados automaticamente por dia

---

## 📊 MONITORAMENTO DA COLETA

### Airflow UI (http://localhost:8200)

**Visualiza:**
- 📅 Quais DAGs rodaram hoje
- ✅ Status: Success / Failed / Running
- ⏱️ Tempo de execução
- 📈 Histórico (últimos 30 dias)
- 🔄 Retries (se houve falhas)
- 📊 Logs detalhados

**Exemplo de visualização:**
```
DAG: aneel_news_daily
├─ 2025-10-17 06:00 ✅ Success (2m 15s)
│  ├─ scrape_aneel ✅ (1m 50s) - 8 notícias
│  ├─ trigger_processing ✅ (5s)
│  └─ notify_summary ✅ (2s)
│
├─ 2025-10-16 06:00 ✅ Success (2m 03s)
│  └─ 7 notícias coletadas
│
└─ 2025-10-15 06:00 ⚠️ Retry (1m 30s)
   └─ 5 notícias (falhou 1x, sucesso na retry)
```

---

## 🎯 DADOS COLETADOS - FORMATO

### Documento Bruto (JSON em MinIO)

```json
{
  "title": "ANEEL aprova novos critérios para RAP de transmissoras",
  "date": "2025-10-17T05:30:00",
  "url": "https://www.gov.br/aneel/pt-br/assuntos/noticias/2025/aneel-aprova-novos-criterios",
  "summary": "A diretoria colegiada da ANEEL aprovou em reunião...",
  "body": "A Agência Nacional de Energia Elétrica (ANEEL) aprovou nesta terça-feira (17) novos critérios para a Receita Anual Permitida (RAP) das transmissoras...",
  "source": "ANEEL",
  "source_type": "news",
  "pdfs": [
    "https://www.gov.br/aneel/pt-br/.../nota-tecnica-123.pdf"
  ],
  "scraped_at": "2025-10-17T06:05:32",
  "word_count": 542,
  "has_attachments": true
}
```

### Documento Processado (PostgreSQL)

```sql
-- Tabela: events
INSERT INTO events VALUES (
  id: 'evt_a1b2c3d4',
  title: 'ANEEL aprova novos critérios para RAP de transmissoras',
  summary: 'A diretoria colegiada da ANEEL aprovou...',
  event_type: 'DECISAO',          ← Classificado pela IA
  company_id: null,                ← Não menciona empresa específica
  amount: null,
  date: '2025-10-17 05:30:00',
  source: 'ANEEL',
  source_url: 'https://...',
  document_id: 'doc_xyz',
  confidence_score: 0.87,          ← 87% de confiança na classificação
  is_critical: false,
  created_at: '2025-10-17 06:12:00'
);

-- Tabela: extracted_entities
INSERT INTO extracted_entities VALUES
  ('ent_1', 'evt_a1b2c3d4', 'ORG', 'ANEEL', 0.95),
  ('ent_2', 'evt_a1b2c3d4', 'ORG', 'diretoria colegiada', 0.82),
  ('ent_3', 'evt_a1b2c3d4', 'DATE', '17 de outubro', 0.98);
```

---

## 🔐 SCRAPING ÉTICO

### Regras Que Seguimos

1. **robots.txt**
   ```python
   ROBOTSTXT_OBEY = True  # Respeita regras do site
   ```

2. **Rate Limiting**
   ```python
   DOWNLOAD_DELAY = 5  # 5 segundos entre requests
   # Evita sobrecarregar servidor do site
   ```

3. **User-Agent Identificável**
   ```python
   USER_AGENT = 'AtlasReg/1.0 by ness. (+https://atlasreg.com; contato@atlasreg.com)'
   # Site pode nos contatar se houver problema
   ```

4. **Horários de Baixo Tráfego**
   ```python
   schedule_interval='0 6 * * *'  # 06:00 da manhã
   # Evita horário comercial (menos impacto)
   ```

5. **Caching**
   ```python
   # Não re-baixa conteúdo já coletado
   # Verifica hash/data modificação antes
   ```

6. **Retry com Backoff**
   ```python
   retries=3
   retry_delay=timedelta(minutes=5)  # Exponencial
   # Se falhar, espera antes de tentar denovo
   ```

---

## 📊 EXEMPLO: Dia Típico de Coleta

### Timeline de 17/10/2025

```
05:55 - Airflow scheduler acorda
06:00 - ✅ DAG aneel_news_daily inicia
06:01 - 🕷️  Scrapy visita gov.br/aneel
06:02 - 📰 Encontra 8 notícias
06:03-06:05 - Visita cada notícia, extrai conteúdo completo
06:05 - 💾 Salva 8 JSONs no MinIO
06:05 - 📝 Registra 8 documentos no PostgreSQL
06:06 - 🤖 Dispara Celery task: process_documents(8)
06:07-06:12 - IA processa:
           - Classifica (BERTimbau): 5 DECISÃO, 2 NOTÍCIA, 1 OUTRO
           - Extrai entidades (spaCy): 12 empresas, 3 CNPJs, 5 valores
06:12 - 💾 Salva 8 eventos no PostgreSQL
06:12 - 🔍 Indexa em FAISS (semantic) + Elasticsearch (full-text)
06:13 - ✅ DAG concluído

06:30 - ✅ DAG ons_ocorrencias inicia
06:31-06:35 - Coleta 6 ocorrências do ONS
06:35 - 🤖 Processa: 4 INCIDENTE, 2 NOTÍCIA
06:37 - ✅ DAG concluído

07:00 - ✅ DAG aneel_despachos inicia
... (continua)

08:00 - 📧 Daily digest task executa
       - Busca watchlists dos usuários
       - Encontra 15 eventos que match critérios
       - Envia 5 emails personalizados

RESULTADO DO DIA:
- 65 documentos coletados
- 58 processados com sucesso
- 7 erros (retry agendado)
- 15 eventos críticos detectados
- 5 usuários alertados
```

---

## 🎯 SELETORES CSS - Como Extrair Dados

### Exemplo Prático ANEEL

**HTML da página:**
```html
<div class="item-noticia">
  <h2 class="titulo">
    <a href="/noticias/2025/aneel-aprova-novos-criterios">
      ANEEL aprova novos critérios para RAP
    </a>
  </h2>
  <time datetime="2025-10-17T05:30:00">17/10/2025</time>
  <p class="resumo">A diretoria colegiada da ANEEL...</p>
</div>
```

**Scraper extrai:**
```python
# CSS Selectors (como "endereço" de cada dado)
titulo = response.css('div.item-noticia h2.titulo a::text').get()
# Output: "ANEEL aprova novos critérios para RAP"

url = response.css('div.item-noticia h2.titulo a::attr(href)').get()
# Output: "/noticias/2025/aneel-aprova-novos-criterios"

data = response.css('div.item-noticia time::attr(datetime)').get()
# Output: "2025-10-17T05:30:00"

resumo = response.css('div.item-noticia p.resumo::text').get()
# Output: "A diretoria colegiada da ANEEL..."
```

---

## 🚨 TRATAMENTO DE ERROS

### O Que Pode Dar Errado

#### 1. Site fora do ar
```python
# Scrapy tenta 3x com intervalo
retries=3
retry_delay=5 minutos

# Se falhar 3x:
# - Log erro no Airflow
# - Email para admin
# - Tenta novamente no próximo dia
```

#### 2. HTML mudou (site redesign)
```python
# Scraper não encontra seletores
# Result: 0 notícias

# Monitoramento detecta:
if noticias_coletadas == 0:
    send_alert("⚠️ ANEEL scraper retornou 0 itens - verificar!")

# Admin recebe alerta
# Atualiza seletores CSS no código
# Redeploy scraper
```

#### 3. CAPTCHA / Bloqueio
```python
# Site detecta bot e bloqueia

# Mitigações:
# - Rotating user-agents
# - Rotating proxies (se necessário)
# - Aumentar delay (10s ao invés de 5s)
# - Usar Playwright (simula humano)
```

---

## 💾 ARMAZENAMENTO

### MinIO (Object Storage)

**Estrutura de pastas:**
```
raw-documents/
├── aneel/
│   ├── news/
│   │   ├── 2025-10-17/
│   │   │   ├── noticia-1.json
│   │   │   ├── noticia-2.json
│   │   │   └── noticia-3.json
│   │   └── 2025-10-16/
│   │       └── ...
│   ├── despachos/
│   │   └── 2025-10-17/
│   │       ├── despacho-123.pdf
│   │       └── despacho-124.pdf
│   └── pvs/
│       └── 2025-10/
│           └── pv-multa-transmissora-x.pdf
│
├── ons/
│   └── ocorrencias/
│       └── 2025-10-17/
│           └── ocorrencia-desligamento.json
│
└── midia/
    ├── canal-energia/
    ├── megawhat/
    └── epbr/
```

**Acesso:** http://localhost:19001 (MinIO Console)

---

## 🔍 BUSCA NO FRONTEND

### Como Usuário Busca

**Interface:**
```
┌──────────────────────────────────────────┐
│  🔍 Buscar eventos...                    │
├──────────────────────────────────────────┤
│                                          │
│  Filtros:                                │
│  ├─ Tipo: [☑ Multa] [☐ Decisão] ...    │
│  ├─ Empresa: [Transmissora X ▼]         │
│  ├─ Data: [Últimos 30 dias ▼]           │
│  └─ Valor mín: [R$ 1.000.000]           │
│                                          │
│  [Buscar]                                │
└──────────────────────────────────────────┘
```

**Backend processa:**
```python
# API: GET /events/search
params = {
    'q': 'multa',
    'event_type': 'MULTA',
    'company': 'Transmissora X',
    'date_from': '2025-09-17',
    'min_amount': 1000000
}

# Elasticsearch query
es.search(index='events', body={
    "query": {
        "bool": {
            "must": [{"match": {"text": "multa"}}],
            "filter": [
                {"term": {"event_type": "MULTA"}},
                {"term": {"company.keyword": "Transmissora X"}},
                {"range": {"date": {"gte": "2025-09-17"}}},
                {"range": {"amount": {"gte": 1000000}}}
            ]
        }
    }
})

# Retorna eventos ordenados por relevância
```

---

## ⚡ RESUMO: 5 Passos Automáticos

```
1️⃣ COLETAR (06:00-10:00)
   Scrapers visitam sites, baixam conteúdo
   → Salva em MinIO + PostgreSQL

2️⃣ PROCESSAR (06:15-11:00)
   IA classifica tipo, extrai entidades
   → Salva eventos estruturados

3️⃣ INDEXAR (06:20-11:05)
   FAISS (semantic) + Elasticsearch (full-text)
   → Permite buscas rápidas

4️⃣ ALERTAR (08:00)
   Verifica watchlists, envia emails
   → Usuários informados proativamente

5️⃣ VISUALIZAR (sempre)
   Dashboard mostra eventos
   → Usuário busca, filtra, explora
```

**Tudo acontece AUTOMATICAMENTE, SEM INTERVENÇÃO MANUAL! 🤖**

---

## 📞 FAQ

**P: Quantos documentos são coletados por dia?**  
R: ~60-135 documentos/dia dependendo da atividade regulatória

**P: Quanto tempo leva para uma notícia aparecer no dashboard?**  
R: ~10-15 minutos após publicação (se cair no horário de scraping)

**P: E se o site da ANEEL cair?**  
R: Scraper tenta 3x com intervalo. Se falhar, log + alerta. Tenta novamente no próximo dia.

**P: Posso escolher quais fontes monitorar?**  
R: Sim! Via watchlists você filtra por source, tipo, empresa, keywords.

**P: Como o sistema sabe que uma notícia é nova?**  
R: Compara URL + data com documentos já coletados no PostgreSQL.

**P: E se eu quiser adicionar uma fonte nova?**  
R: Criar novo spider Scrapy + DAG Airflow. ~2-4 horas de trabalho.

---

**Documento preparado por:** BMad Master  
**Ver código:** `/apps/scraper/scrapers/aneel_news_spider.py`  
**Ver DAG:** `/apps/scraper/dags/aneel_daily_scraper.py`


