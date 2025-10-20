# 🔍 Como Funciona a Busca de Notícias no AtlasReg

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)

---

## 📊 VISÃO GERAL DO SISTEMA DE COLETA

O AtlasReg coleta notícias automaticamente de **múltiplas fontes** usando **web scraping inteligente**.

```
┌─────────────────────────────────────────────────────┐
│  FONTES EXTERNAS (Sites Públicos)                   │
├─────────────────────────────────────────────────────┤
│  • ANEEL (gov.br/aneel)                             │
│  • ONS (ons.org.br)                                 │
│  • SIGEL (sigel.aneel.gov.br)                       │
│  • Canal Energia (canalenergia.com.br)              │
│  • MegaWhat (megawhat.energy)                       │
│  • EPBR (epbr.com.br)                               │
└──────────────┬──────────────────────────────────────┘
               │
               │ SCRAPING AUTOMATIZADO
               │ (Airflow DAGs + Scrapy/Playwright)
               ↓
┌─────────────────────────────────────────────────────┐
│  COLETA & ARMAZENAMENTO                             │
├─────────────────────────────────────────────────────┤
│  1. Scrapers visitam sites diariamente              │
│  2. Extraem: Título, Data, Corpo, URL              │
│  3. Baixam PDFs se necessário                       │
│  4. Salvam em MinIO (object storage)                │
│  5. Registram metadata no PostgreSQL                │
└──────────────┬──────────────────────────────────────┘
               │
               │ PROCESSAMENTO
               │ (Pipeline de IA)
               ↓
┌─────────────────────────────────────────────────────┐
│  TRANSFORMAÇÃO INTELIGENTE                          │
├─────────────────────────────────────────────────────┤
│  1. PDF → Texto (PDFMiner + OCR)                    │
│  2. Classificação (BERTimbau)                       │
│     └─ Tipo: Multa, Decisão, Transação, etc.       │
│  3. Extração de Entidades (spaCy)                   │
│     └─ Empresas, CNPJs, Valores, Ativos            │
│  4. Indexação                                       │
│     ├─ Semântica (SBERT + FAISS)                    │
│     └─ Full-text (Elasticsearch)                    │
└──────────────┬──────────────────────────────────────┘
               │
               │ DISPONIBILIZAÇÃO
               ↓
┌─────────────────────────────────────────────────────┐
│  USUÁRIO FINAL                                      │
├─────────────────────────────────────────────────────┤
│  • Dashboard com feed de eventos                    │
│  • Busca avançada (filters, keywords)               │
│  • Alertas por email (daily digest)                 │
│  • Watchlists personalizadas                        │
└─────────────────────────────────────────────────────┘
```

---

## 🕷️ PARTE 1: WEB SCRAPING (Coleta Automática)

### O Que é Web Scraping?

**Web Scraping = "Robô" que visita sites e extrai informações**

Imagine um assistente que:
1. Abre o navegador
2. Vai no site da ANEEL
3. Procura notícias novas
4. Copia título, data, texto completo
5. Salva tudo estruturado
6. Faz isso **automaticamente todos os dias**

### Exemplo: Scraper da ANEEL

#### Site Alvo
```
https://www.gov.br/aneel/pt-br/assuntos/noticias
```

#### O Que o Scraper Faz

**1. Visita a página de notícias:**
```python
# apps/scraper/scrapers/aneel_scraper.py
import scrapy

class AneelNewsSpider(scrapy.Spider):
    name = "aneel_news"
    start_urls = [
        'https://www.gov.br/aneel/pt-br/assuntos/noticias'
    ]
    
    def parse(self, response):
        # Extrai cada notícia da página
        for article in response.css('div.item-noticia'):
            yield {
                'title': article.css('h2.titulo::text').get(),
                'date': article.css('span.data::text').get(),
                'url': article.css('a::attr(href)').get(),
                'summary': article.css('p.resumo::text').get()
            }
```

**2. Segue link de cada notícia:**
```python
def parse_article(self, response):
    # Extrai conteúdo completo
    return {
        'title': response.css('h1::text').get(),
        'date': response.css('time::attr(datetime)').get(),
        'body': response.css('div.conteudo').get(),
        'url': response.url,
        'source': 'ANEEL'
    }
```

**3. Salva no MinIO:**
```python
import json
from minio import Minio

def save_to_minio(article):
    minio = Minio('localhost:19000',
                  access_key='admin',
                  secret_key='atlasreg2025',
                  secure=False)
    
    # Converter para JSON
    data = json.dumps(article, ensure_ascii=False)
    
    # Salvar em bucket
    filename = f"aneel/news/{article['date']}/{article['title']}.json"
    minio.put_object(
        'raw-documents',
        filename,
        data,
        len(data)
    )
```

**4. Registra no PostgreSQL:**
```python
# Metadata para tracking
document = Document(
    filename=filename,
    source='ANEEL',
    doc_type='news',
    status='raw',  # Ainda não processado
    scraped_at=datetime.now(),
    url=article['url']
)
db.add(document)
db.commit()
```

---

## 🤖 PARTE 2: ORQUESTRAÇÃO (Quando Buscar)

### Airflow: Agendamento Automático

**Airflow = "Relógio inteligente" que dispara scrapers**

#### DAG (Directed Acyclic Graph)

```python
# apps/scraper/dags/aneel_news_dag.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

# Configuração do DAG
default_args = {
    'owner': 'atlasreg',
    'depends_on_past': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'aneel_news_scraper',
    default_args=default_args,
    description='Coleta notícias da ANEEL diariamente',
    schedule_interval='0 6 * * *',  # Todo dia às 06:00 BRT
    start_date=datetime(2025, 10, 17),
    catchup=False
)

# Task: Rodar scraper
scrape_task = PythonOperator(
    task_id='scrape_aneel_news',
    python_callable=run_aneel_scraper,
    dag=dag
)
```

**Resultado:** Todos os dias às 06:00, automaticamente:
1. Airflow acorda
2. Dispara o scraper ANEEL
3. Scraper coleta notícias novas
4. Salva tudo no MinIO + PostgreSQL
5. Dispara processamento (IA)

---

## 🧠 PARTE 3: PROCESSAMENTO INTELIGENTE

### BERTimbau: Classificação Automática

**O Que Faz:** Lê o texto e identifica o TIPO de evento

```python
from transformers import pipeline

# Modelo treinado para português brasileiro
classifier = pipeline(
    "text-classification",
    model="models/event_classifier"  # BERTimbau fine-tuned
)

# Processar notícia
text = """
ANEEL aplica multa de R$ 2 milhões à Transmissora X 
por descumprimento de indicadores de continuidade...
"""

result = classifier(text)
# Resultado:
# {
#   'label': 'MULTA',       ← Tipo identificado
#   'score': 0.92           ← 92% de confiança
# }
```

**Categorias possíveis:**
- `MULTA` - Penalidades da ANEEL
- `DECISAO` - Decisões regulatórias
- `TRANSACAO` - M&A, compra/venda de ativos
- `INCIDENTE` - Quedas de torre, desligamentos
- `NOTICIA` - Notícia genérica
- `OUTRO` - Não classificado

### spaCy: Extração de Entidades

**O Que Faz:** Identifica nomes, valores, datas no texto

```python
import spacy

nlp = spacy.load("pt_core_news_lg")
doc = nlp(text)

# Extrair entidades
entities = []
for ent in doc.ents:
    entities.append({
        'type': ent.label_,  # COMPANY, MONEY, DATE
        'text': ent.text,    # "Transmissora X", "R$ 2 milhões"
        'start': ent.start_char,
        'end': ent.end_char
    })

# Regex customizado para CNPJ
import re
cnpj_pattern = r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}'
cnpjs = re.findall(cnpj_pattern, text)
```

**Resultado estruturado:**
```json
{
  "title": "ANEEL aplica multa de R$ 2M...",
  "event_type": "MULTA",
  "confidence": 0.92,
  "entities": [
    {"type": "COMPANY", "text": "Transmissora X"},
    {"type": "CNPJ", "text": "12.345.678/0001-90"},
    {"type": "MONEY", "text": "R$ 2 milhões"},
    {"type": "DATE", "text": "15 de outubro de 2025"}
  ],
  "source": "ANEEL",
  "url": "https://..."
}
```

---

## 🔎 PARTE 4: BUSCA PARA O USUÁRIO

### Dois Tipos de Busca

#### 1. Busca Semântica (FAISS)

**Como funciona:** Busca por **significado**, não palavras exatas

```python
from sentence_transformers import SentenceTransformer
import faiss

# Gerar embedding da query do usuário
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

query = "multas por atraso em obras"
query_embedding = model.encode([query])

# Buscar no índice FAISS
index = faiss.read_index("events.index")
distances, indices = index.search(query_embedding, k=10)

# Retornar os 10 eventos mais similares CONCEITUALMENTE
similar_events = [events[i] for i in indices[0]]
```

**Exemplo:**
- **Query:** "penalidades da ANEEL"
- **Encontra:**
  - "ANEEL aplica multa de R$ 2M..."
  - "Superintendência autuou empresa por..."
  - "Processo de fiscalização resultou em..."
  
**Mesmo sem usar palavra "multa" exata!**

#### 2. Busca Full-Text (Elasticsearch)

**Como funciona:** Busca por **palavras-chave** com filtros

```python
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:19200'])

# Query com filtros
query = {
    "query": {
        "bool": {
            "must": [
                {"match": {"text": "multa"}}
            ],
            "filter": [
                {"term": {"event_type": "MULTA"}},
                {"term": {"company.keyword": "Transmissora X"}},
                {"range": {"amount": {"gte": 1000000}}}
            ]
        }
    }
}

results = es.search(index="events", body=query)
```

**Exemplo:**
- **Filtros:** 
  - Tipo: MULTA
  - Empresa: Transmissora X
  - Valor: > R$ 1 milhão
  - Data: últimos 30 dias
  
- **Resultados:** Apenas eventos que correspondem a TODOS os filtros

---

## 🕰️ FREQUÊNCIA DE COLETA

### Agendamento por Fonte

| Fonte | Frequência | Horário | Documentos/dia |
|-------|-----------|---------|----------------|
| **ANEEL Notícias** | Diária | 06:00 BRT | 5-10 |
| **ANEEL Despachos** | Diária | 07:00 BRT | 20-50 |
| **ANEEL PVs (Multas)** | Semanal | Seg 08:00 | 10-20 |
| **ONS Ocorrências** | Diária | 06:30 BRT | 5-15 |
| **SIGEL Dados** | Mensal | Dia 1, 09:00 | 100-200 |
| **Canal Energia** | Diária | 09:00 BRT | 10-20 |
| **MegaWhat** | Diária | 09:30 BRT | 5-10 |
| **EPBR** | Diária | 10:00 BRT | 5-10 |

**Total:** ~60-135 documentos/dia em média

### Pipeline Completo

```
06:00 → ANEEL News scraper inicia
06:05 → Notícias salvas no MinIO
06:10 → Celery worker processa (IA)
06:15 → Eventos aparecem no dashboard
06:30 → ONS scraper inicia
...
08:00 → Daily digest email enviado aos usuários
```

---

## 🛠️ TECNOLOGIAS DE SCRAPING

### 1. Scrapy (Sites Estáticos)

**Para:** Sites HTML simples (ANEEL, ONS)

```python
# Vantagens:
✅ Rápido (async)
✅ Rate limiting built-in
✅ Retry automático
✅ Extração de dados fácil (CSS selectors)

# Exemplo ANEEL
import scrapy

class AneelSpider(scrapy.Spider):
    custom_settings = {
        'DOWNLOAD_DELAY': 5,  # 5s entre requests (ético)
        'USER_AGENT': 'AtlasReg/1.0 (+https://atlasreg.com)'
    }
    
    def parse(self, response):
        for noticia in response.css('article.noticia'):
            yield {
                'titulo': noticia.css('h2::text').get(),
                'data': noticia.css('time::attr(datetime)').get(),
                'url': noticia.css('a::attr(href)').get()
            }
```

### 2. Playwright (Sites JavaScript)

**Para:** Sites que carregam conteúdo via JavaScript (alguns portais de mídia)

```python
# Vantagens:
✅ Renderiza JavaScript
✅ Simula navegador real
✅ Espera elementos carregarem
✅ Screenshots para debug

# Exemplo Canal Energia
from playwright.sync_api import sync_playwright

def scrape_canal_energia():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('https://www.canalenergia.com.br/noticias/')
        page.wait_for_selector('article.noticia')
        
        # Extrair notícias após JS carregar
        noticias = page.query_selector_all('article.noticia')
        
        for noticia in noticias:
            titulo = noticia.query_selector('h3').inner_text()
            data = noticia.query_selector('time').get_attribute('datetime')
            url = noticia.query_selector('a').get_attribute('href')
            
            yield {'titulo': titulo, 'data': data, 'url': url}
        
        browser.close()
```

### 3. Airflow (Orquestração)

**Para:** Agendar e monitorar scrapers

```python
# Airflow UI: http://localhost:8200
# Visualiza:
# - Quais scrapers rodaram
# - Quantos documentos coletados
# - Erros e retries
# - Histórico de execuções
```

---

## 📑 EXEMPLO COMPLETO: Fluxo de 1 Notícia

### 1. Scraping (06:00 BRT)

**ANEEL publica notícia:**
```
Título: "ANEEL aprova reajuste tarifário de 8,5% para transmissoras"
URL: https://www.gov.br/aneel/pt-br/assuntos/noticias/2025/aneel-aprova-reajuste...
Data: 17/10/2025 05:00
Corpo: A Agência Nacional de Energia Elétrica (ANEEL) aprovou...
```

**Scraper detecta e coleta:**
```python
# 06:05 - Airflow DAG dispara
# 06:06 - Scrapy visita página
# 06:07 - Extrai dados
{
    "title": "ANEEL aprova reajuste tarifário de 8,5%...",
    "date": "2025-10-17T05:00:00",
    "url": "https://...",
    "body": "A Agência Nacional...",
    "source": "ANEEL",
    "scraped_at": "2025-10-17T06:07:00"
}

# 06:08 - Salva em MinIO
# Path: raw-documents/aneel/news/2025-10-17/reajuste-tarifario.json

# 06:08 - Registra no PostgreSQL (tabela documents)
```

### 2. Processamento (06:10 BRT)

**Celery worker pega documento:**
```python
# Worker 1: Classificação
classifier = pipeline("text-classification", model="BERTimbau")
result = classifier("ANEEL aprova reajuste tarifário...")

# Output: {'label': 'DECISAO', 'score': 0.89}

# Worker 2: Extração de entidades
nlp = spacy.load("pt_core_news_lg")
doc = nlp("A ANEEL aprovou reajuste de 8,5%...")

# Entidades encontradas:
# - ORG: "ANEEL"
# - MONEY: "8,5%"
# - DATE: "17/10/2025"
# - Empresas: [detecta se mencionar nomes específicos]

# Worker 3: Indexação
# - Gera embedding semântico (SBERT)
# - Adiciona ao índice FAISS
# - Indexa no Elasticsearch

# Worker 4: Salva evento no PostgreSQL
event = Event(
    title="ANEEL aprova reajuste tarifário de 8,5%",
    summary="A ANEEL aprovou...",
    event_type="DECISAO",
    date=datetime(2025, 10, 17, 5, 0),
    source="ANEEL",
    source_url="https://...",
    confidence_score=0.89,
    created_at=datetime.now()
)
```

### 3. Disponibilização (06:15 BRT)

**Usuário acessa dashboard:**
```tsx
// Frontend busca eventos
fetch('http://localhost:8100/events/search?limit=20')

// API retorna
{
  "items": [
    {
      "id": "evt_123",
      "title": "ANEEL aprova reajuste tarifário de 8,5%",
      "event_type": "DECISAO",
      "date": "2025-10-17T05:00:00Z",
      "source": "ANEEL",
      "confidence": 0.89,
      "is_new": true  ← Badge "NOVO" no card
    },
    // ... mais eventos
  ]
}

// Dashboard renderiza
<EventCard 
  title="ANEEL aprova reajuste..." 
  badge="DECISÃO"
  isNew={true}
/>
```

### 4. Alertas (08:00 BRT)

**Daily Digest enviado:**

Se usuário tem watchlist com:
- Keywords: ["reajuste", "tarifa"]
- Tipos: ["DECISAO"]

**Recebe email:**
```html
<h2>Seu Resumo Diário - AtlasReg by ness.</h2>

<h3>1 novo evento encontrado:</h3>

<div style="border-left: 3px solid #00ADE8;">
  <strong>ANEEL aprova reajuste tarifário de 8,5%</strong>
  <p>Tipo: DECISÃO | Data: 17/10/2025</p>
  <p>A Agência Nacional...</p>
  <a href="https://atlasreg.com/events/evt_123">Ver Detalhes →</a>
</div>

<footer>Powered by ness.</footer>
```

---

## 🎯 EXEMPLO REAL: Como Funciona na Prática

### Cenário: Analista quer monitorar multas

#### Passo 1: Configurar Watchlist

```tsx
// Dashboard → Minhas Watchlists → Nova Watchlist
{
  "name": "Multas e Penalidades",
  "event_types": ["MULTA"],
  "companies": ["Transmissora X", "Transmissora Y"],
  "keywords": ["fiscalização", "penalidade"]
}
```

#### Passo 2: Sistema Trabalha Automaticamente

**Dia 1 (Segunda):**
- 06:00 - Scrapers coletam 60+ documentos
- 06:30 - IA processa tudo
- 07:00 - 3 multas detectadas
- 08:00 - Email enviado: "3 novos eventos na sua watchlist Multas"

**Dia 2 (Terça):**
- 06:00 - Scrapers coletam 70 documentos
- 06:30 - IA processa
- 07:00 - 0 multas detectadas
- 08:00 - Email NÃO enviado (sem eventos novos)

**Dia 3 (Quarta):**
- 06:00 - Scrapers coletam 55 documentos
- 06:15 - **ALERTA CRÍTICO:** Multa de R$ 5M detectada
- 06:16 - **Email instantâneo enviado** (urgente!)
- 08:00 - Email digest normal também

#### Passo 3: Analista Acessa Dashboard

```
Dashboard (http://localhost:3000/dashboard)
├─ Feed de Eventos
│  ├─ [MULTA] [NOVO] ANEEL aplica R$ 5M... ← Crítico
│  ├─ [DECISÃO] Aprovado reajuste...
│  └─ [NOTÍCIA] Setor de transmissão...
│
├─ Filtros (Sidebar)
│  ├─ ☑ Multa
│  ├─ ☐ Decisão
│  └─ Empresa: [Transmissora X ▼]
│
└─ Busca
   "multas transmissora X últimos 30 dias"
   → 5 resultados encontrados
```

---

## 📋 FONTES DE DADOS - DETALHAMENTO

### 1. ANEEL (Agência Nacional de Energia Elétrica)

**URL Base:** https://www.gov.br/aneel/

**O Que Coletamos:**

#### a) Notícias
```
URL: /pt-br/assuntos/noticias
Formato: HTML
Atualização: Diária
Scraper: Scrapy
Campos: Título, Data, Resumo, URL
```

#### b) Despachos
```
URL: /pt-br/assuntos/despachos
Formato: PDF listados em HTML
Atualização: Diária
Scraper: Scrapy + PDFMiner
Campos: Número, Data, Assunto, PDF
```

#### c) Processos de Fiscalização (PVs)
```
URL: /pt-br/centrais-de-conteudos/processos-de-fiscalizacao
Formato: Tabela HTML + PDFs
Atualização: Semanal
Scraper: Scrapy
Campos: Número do PV, Empresa, Valor Multa, Data, PDF
```

### 2. ONS (Operador Nacional do Sistema)

**URL Base:** https://www.ons.org.br/

**O Que Coletamos:**

```
a) Ocorrências Operacionais
   URL: /paginas/energia-agora/ocorrencias
   Formato: HTML/JSON
   Info: Desligamentos, quedas, incidentes
   
b) Boletins Diários
   URL: /paginas/servicos/publicacoes/boletins
   Formato: PDF
   Info: Operação do sistema, carga, geração
```

### 3. SIGEL (Sistema de Informações Geográficas)

**URL Base:** https://sigel.aneel.gov.br/

**O Que Coletamos:**

```
Dados Cadastrais de Agentes
URL: /portal/home/index.html
Formato: Tabelas HTML
Info: Nome, CNPJ, Grupo Econômico, Outorgas
Atualização: Mensal
```

### 4. Mídia Especializada

#### Canal Energia
```
URL: https://www.canalenergia.com.br/noticias/
Scraper: Playwright (site JS-heavy)
Categorias: Transmissão, Regulação, M&A
```

#### MegaWhat
```
URL: https://megawhat.energy/
Scraper: Scrapy
Foco: Análises técnicas, mercado
```

#### EPBR
```
URL: https://epbr.com.br/
Scraper: Scrapy (respeitar paywall)
Foco: Transações, investimentos
```

---

## 🔧 IMPLEMENTAÇÃO DO SCRAPER (Código Real)

Vou criar um scraper completo da ANEEL como exemplo:


