# AtlasReg - Full-Stack Architecture

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)  
**Versão:** 1.0  
**Data:** 17 de Outubro de 2025  
**Prepared by:** Winston (Architect - BMad Method)

---

## Executive Summary

AtlasReg é uma plataforma de inteligência de mercado que automatiza coleta, processamento via IA, e análise de eventos do setor de transmissão de energia brasileiro. Arquitetura fullstack moderna usando:

- **Monorepo** Turborepo (Next.js + Fast API + Airflow)
- **IA/ML** BERTimbau, spaCy, SBERT + FAISS
- **Data Stack** PostgreSQL (Neon), MinIO (S3), Elasticsearch, Redis  
- **Containerização** Docker + Docker Compose  
- **6 semanas MVP** com deployment VPS

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-17 | 1.0 | Versão inicial da arquitetura | Winston (Architect) |

---

## System Context

### High-Level Architecture Diagram

```mermaid
C4Context
    title System Context Diagram - Atlas Reg
    
    Person(user, "Analista de Mercado", "Power user que monitora eventos do setor")
    Person(exec, "Executivo", "Decision maker que recebe alertas")
    
    System(atlasreg, "AtlasReg Platform", "Plataforma de inteligência de mercado com IA")
    
    System_Ext(aneel, "ANEEL", "Portal de notícias e documentos regulatórios")
    System_Ext(ons, "ONS", "Ocorrências operacionais")
    System_Ext(sigel, "SIGEL", "Dados cadastrais de agentes")
    System_Ext(media, "Mídia Especializada", "Canal Energia, MegaWhat, EPBR")
    System_Ext(email, "Email Server", "SMTP provider para alertas")
    
    Rel(user, atlasreg, "Usa", "HTTPS")
    Rel(exec, email, "Recebe alertas", "Email")
    Rel(atlasreg, aneel, "Scrapes", "HTTP")
    Rel(atlasreg, ons, "Scrapes", "HTTP")
    Rel(atlasreg, sigel, "Scrapes", "HTTP")
    Rel(atlasreg, media, "Scrapes", "HTTP")
    Rel(atlasreg, email, "Envia", "SMTP")
```

---

## Container Architecture

### Container Diagram

```mermaid
C4Container
    title Container Diagram - AtlasReg Platform
    
    Person(user, "Usuário")
    
    Container(web, "Web Application", "Next.js 14", "SPA com SSR, interface dark-first")
    Container(api, "API Service", "FastAPI", "REST API, autenticação JWT")
    Container(scraper, "Scraper Service", "Airflow + Scrapy", "Coleta automatizada de documentos")
    Container(processor, "Processing Workers", "Celery + Python", "Pipeline de IA: classificação, extração")
    
    ContainerDb(postgres, "Database", "Neon PostgreSQL", "Eventos, usuários, watchlists")
    ContainerDb(minio, "Object Storage", "MinIO", "PDFs e documentos brutos")
    ContainerDb(elasticsearch, "Search Engine", "Elasticsearch", "Busca full-text")
    ContainerDb(faiss, "Vector Store", "FAISS", "Busca semântica")
    ContainerDb(redis, "Cache & Queue", "Redis", "Celery broker, cache")
    
    Rel(user, web, "Usa", "HTTPS")
    Rel(web, api, "Consome", "REST/JSON")
    Rel(api, postgres, "Lê/Escreve")
    Rel(api, elasticsearch, "Busca")
    Rel(api, faiss, "Busca semântica")
    Rel(api, redis, "Cache")
    
    Rel(scraper, minio, "Armazena docs brutos")
    Rel(scraper, postgres, "Registra metadata")
    
    Rel(processor, minio, "Lê docs")
    Rel(processor, postgres, "Salva eventos")
    Rel(processor, elasticsearch, "Indexa")
    Rel(processor, faiss, "Indexa embeddings")
    Rel(processor, redis, "Usa fila", "Celery")
```

---

## Technology Stack

### Frontend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | SSR para SEO, RSC para performance, ecosystem maduro |
| Language | TypeScript 5+ | Type safety, melhor DX, refactoring seguro |
| Styling | Tailwind CSS 3 | Utility-first, design system ness fácil de implementar |
| UI Components | shadcn/ui | Composable, acessível, customizável, sem dependência pesada |
| State (Global) | Zustand | Simples, performático, menos boilerplate que Redux |
| State (Server) | TanStack Query (React Query) | Cache inteligente, mutations, optimistic updates |
| Forms | React Hook Form + Zod | Performance (uncontrolled), validação type-safe |
| Icons | Heroicons v2 | Monocromático stroke-1.5 conforme design system |
| Animations | Framer Motion (se necessário) | Animações complexas, respects prefers-reduced-motion |

### Backend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| API Framework | FastAPI | Async, performance, OpenAPI automático, type hints |
| Language | Python 3.11+ | Ecosystem rico de ML/NLP, usado em scraping e processamento |
| ORM | SQLAlchemy 2.0 | ORM maduro, suporta async, migrations com Alembic |
| Authentication | JWT (python-jose) + bcrypt | Stateless, escalável, password hashing seguro |
| Validation | Pydantic V2 | Integração nativa FastAPI, performance |
| Task Queue | Celery + Redis | Processamento assíncrono, retry logic, monitoring (Flower) |
| Scraping | Scrapy + Playwright | Scrapy para sites estáticos, Playwright para JS-heavy |
| Orchestration | Apache Airflow | DAGs para scraping agendado, monitoring visual |

### AI/ML Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| NLP Model | BERTimbau (HuggingFace) | BERT fine-tuned para português brasileiro |
| Entity Extraction | spaCy 3.x + custom rules | Pipeline modular, performance, custom entity types |
| Semantic Search | Sentence-BERT (SBERT) | Embeddings multilingual, FAISS para indexação rápida |
| Vector Store | FAISS (Facebook AI) | Busca NN eficiente, não requer servidor separado |
| Training | HuggingFace Transformers | Ecosystem padrão para fine-tuning BERT |

### Data & Infrastructure

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Primary DB | Neon PostgreSQL 15+ | Managed, serverless, online para todos os ambientes |
| Object Storage | MinIO | S3-compatible, self-hosted, sem vendor lock-in |
| Search Engine | Elasticsearch 8.x | Full-text search, faceted search, highlighting |
| Cache/Queue | Redis 7 | In-memory, usado por Celery e cache de API |
| Containerization | Docker + Docker Compose | Desenvolvimento local consistente, deploy simplificado |
| Reverse Proxy | Traefik | SSL automático Let's Encrypt, gerenciado via Portainer |
| Management | Portainer | UI visual para gerenciar containers |
| CI/CD | GitHub Actions | Free para repos públicos, integração nativa GitHub |

---

## Source Tree Structure

```
/home/resper/nSaulo/
├── .github/
│   └── workflows/
│       └── ci.yml                   # Linting, testes, build
│
├── apps/
│   ├── web/                         # Next.js Frontend
│   │   ├── app/                     # App Router (Next.js 14)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── watchlists/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx     # Layout com sidebar
│   │   │   ├── api/                # Route handlers (proxy para FastAPI se necessário)
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Home/landing
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ...
│   │   │   ├── EventCard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api-client.ts       # Axios/fetch wrapper
│   │   │   ├── auth.ts             # Auth helpers, JWT handling
│   │   │   └── utils.ts            # Shared utilities
│   │   ├── hooks/
│   │   │   ├── use-events.ts       # React Query hooks
│   │   │   ├── use-watchlists.ts
│   │   │   └── use-auth.ts
│   │   ├── styles/
│   │   │   └── globals.css         # Tailwind imports
│   │   ├── types/
│   │   │   └── index.ts            # Shared TypeScript types
│   │   ├── tailwind.config.ts      # Tailwind customizado (ness colors)
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                         # FastAPI Backend
│   │   ├── app/
│   │   │   ├── main.py             # FastAPI app, CORS, middleware
│   │   │   ├── auth/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── jwt.py          # JWT encoding/decoding
│   │   │   │   ├── password.py     # Bcrypt hashing
│   │   │   │   └── dependencies.py # Dependency injection (get_current_user)
│   │   │   ├── routers/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py         # POST /auth/login, /auth/register
│   │   │   │   ├── events.py       # GET /events/search, /events/{id}
│   │   │   │   ├── users.py        # User CRUD
│   │   │   │   ├── watchlists.py   # Watchlist CRUD
│   │   │   │   ├── alerts.py       # Alert config CRUD
│   │   │   │   └── health.py       # GET /health
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py         # SQLAlchemy models
│   │   │   │   ├── event.py
│   │   │   │   ├── watchlist.py
│   │   │   │   └── ...
│   │   │   ├── schemas/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py         # Pydantic schemas (request/response)
│   │   │   │   ├── event.py
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── storage.py      # MinIO service (upload/download)
│   │   │   │   ├── search.py       # Elasticsearch + FAISS wrapper
│   │   │   │   ├── email.py        # SMTP email service
│   │   │   │   └── ...
│   │   │   ├── database.py         # SQLAlchemy engine, session
│   │   │   ├── config.py           # Pydantic Settings (env vars)
│   │   │   └── dependencies.py     # DI containers
│   │   ├── alembic/                # Database migrations
│   │   │   ├── versions/
│   │   │   ├── env.py
│   │   │   └── alembic.ini
│   │   ├── tests/
│   │   │   ├── test_auth.py
│   │   │   ├── test_events.py
│   │   │   └── ...
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── pyproject.toml          # Black, isort config
│   │   └── Dockerfile
│   │
│   └── scraper/                     # Airflow + Scrapers
│       ├── dags/
│       │   ├── aneel_news_scraper.py
│       │   ├── aneel_despachos_scraper.py
│       │   ├── ons_scraper.py
│       │   ├── sigel_scraper.py
│       │   └── media_scraper.py
│       ├── plugins/
│       │   └── custom_operators/
│       ├── scrapers/
│       │   ├── base_scraper.py     # Base class com rate limiting
│       │   ├── aneel.py            # Scrapy spiders
│       │   ├── ons.py
│       │   └── ...
│       ├── processors/
│       │   ├── pdf_processor.py    # PDFMiner, OCR fallback
│       │   ├── classifier.py       # BERTimbau inference
│       │   ├── entity_extractor.py # spaCy pipeline
│       │   └── indexer.py          # SBERT + FAISS, Elasticsearch
│       ├── celery_app.py           # Celery app config
│       ├── celerybeat-schedule.py  # Periodic tasks (daily digest)
│       ├── tasks.py                # Celery tasks (process_document, send_alert)
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   └── shared/                     # Shared types, utils
│       ├── types/
│       │   └── index.ts            # TypeScript types compartilhados
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml          # All services
│   ├── traefik/
│   │   └── traefik.yml             # Traefik config (se não usar Portainer)
│   └── .env.example                # Env vars template
│
├── docs/
│   ├── project-brief.md            # ✅ Criado
│   ├── prd.md                      # ✅ Criado
│   ├── front-end-spec.md           # ✅ Criado
│   ├── fullstack-architecture.md   # Este arquivo
│   ├── prd/                        # Sharded PRD (criado pelo PO)
│   └── architecture/               # Sharded Architecture (criado pelo PO)
│
├── .gitignore
├── .env                            # Não comitar (secrets)
├── README.md
├── turbo.json                      # Turborepo config
└── package.json                    # Root package.json
```

---

## API Design

### REST Endpoints

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Criar novo usuário | Public |
| POST | `/auth/login` | Login retorna JWT | Public |
| POST | `/auth/refresh` | Renovar token | Bearer JWT |

#### Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/events/search?q=X&company=Y&event_type=Z&date_from=D1&date_to=D2&sort=date&limit=50&offset=0` | Busca de eventos com filtros | Bearer JWT |
| GET | `/events/{id}` | Detalhes completos do evento | Bearer JWT |
| GET | `/documents/{id}/download` | Download do documento original (PDF/JSON) | Bearer JWT |

#### Watchlists

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/watchlists` | Criar watchlist | Bearer JWT |
| GET | `/watchlists` | Listar watchlists do usuário | Bearer JWT |
| GET | `/watchlists/{id}` | Detalhes da watchlist | Bearer JWT (owner) |
| PATCH | `/watchlists/{id}` | Atualizar watchlist | Bearer JWT (owner) |
| DELETE | `/watchlists/{id}` | Deletar watchlist | Bearer JWT (owner) |
| GET | `/watchlists/{id}/events?date_from=X&limit=Y` | Eventos que match a watchlist | Bearer JWT (owner) |

#### Alerts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/alerts` | Alert configs do usuário | Bearer JWT |
| POST | `/alerts` | Criar alert config | Bearer JWT |
| PATCH | `/alerts/{id}` | Atualizar alert config (frequency, enabled) | Bearer JWT (owner) |
| DELETE | `/alerts/{id}` | Deletar alert config | Bearer JWT (owner) |
| POST | `/alerts/test` | Enviar email de teste | Bearer JWT |

#### Users & Companies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Usuário autenticado | Bearer JWT |
| PATCH | `/users/me` | Atualizar perfil | Bearer JWT |
| PATCH | `/users/me/password` | Alterar senha | Bearer JWT |
| GET | `/companies?search=X` | Listar empresas (para filtros, watchlists) | Bearer JWT |
| GET | `/companies/{id}` | Detalhes da empresa com histórico de eventos | Bearer JWT |
| GET | `/assets` | Listar ativos (linhas, subestações) | Bearer JWT |

#### Health

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | Public |

### Request/Response Examples

#### POST /auth/login

**Request:**
```json
{
  "email": "analyst@transmissora.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "analyst@transmissora.com",
    "name": "João Silva",
    "role": "analyst"
  }
}
```

#### GET /events/search?q=multa&event_type=multa&limit=10

**Response (200):**
```json
{
  "items": [
    {
      "id": "evt_123",
      "title": "ANEEL aplica multa de R$ 2M à Transmissora X",
      "summary": "Processo de fiscalização resultou em penalidade...",
      "event_type": "multa",
      "company": {
        "id": "comp_456",
        "name": "Transmissora X",
        "cnpj": "12.345.678/0001-90"
      },
      "amount": 2000000.00,
      "date": "2025-10-15T10:30:00Z",
      "source": "ANEEL",
      "source_url": "https://www.gov.br/aneel/...",
      "confidence_score": 0.92,
      "created_at": "2025-10-15T12:00:00Z"
    },
    ...
  ],
  "total": 45,
  "page": 1,
  "pages": 5,
  "limit": 10
}
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ WATCHLISTS : owns
    USERS ||--o{ ALERT_CONFIGS : configures
    USERS ||--o{ AUDIT_LOGS : generates
    
    WATCHLISTS ||--o{ WATCHLIST_COMPANIES : contains
    WATCHLISTS ||--o{ ALERT_CONFIGS : triggers
    
    COMPANIES ||--o{ WATCHLIST_COMPANIES : monitored_in
    COMPANIES ||--o{ EVENTS : subject_of
    COMPANIES ||--o{ ASSETS : owns
    
    EVENTS ||--o{ EXTRACTED_ENTITIES : has
    EVENTS ||--|{ DOCUMENTS : references
    
    ASSETS ||--o{ EVENT_ASSETS : mentioned_in
    EVENTS ||--o{ EVENT_ASSETS : mentions
    
    ALERT_CONFIGS ||--o{ SENT_ALERTS : generates
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        enum role
        bool is_active
        timestamp created_at
        timestamp last_login
    }
    
    COMPANIES {
        uuid id PK
        string name UK
        string cnpj UK
        string group
        string logo_url
        jsonb metadata
        timestamp created_at
    }
    
    ASSETS {
        uuid id PK
        uuid company_id FK
        string name
        enum type
        string voltage
        jsonb geolocation
    }
    
    EVENTS {
        uuid id PK
        string title
        text summary
        enum event_type
        uuid company_id FK
        decimal amount
        timestamp date
        string source
        string source_url
        uuid document_id FK
        float confidence_score
        bool is_critical
        timestamp created_at
    }
    
    DOCUMENTS {
        uuid id PK
        string minio_key UK
        string filename
        enum source
        enum doc_type
        enum status
        jsonb metadata
        timestamp scraped_at
        timestamp processed_at
    }
    
    EXTRACTED_ENTITIES {
        uuid id PK
        uuid event_id FK
        enum entity_type
        string text
        float confidence
        int start_char
        int end_char
    }
    
    WATCHLISTS {
        uuid id PK
        uuid user_id FK
        string name
        array event_types
        array keywords
        timestamp created_at
        timestamp last_viewed_at
    }
    
    WATCHLIST_COMPANIES {
        uuid watchlist_id FK
        uuid company_id FK
    }
    
    ALERT_CONFIGS {
        uuid id PK
        uuid user_id FK
        uuid watchlist_id FK
        enum channel
        enum frequency
        bool enabled
        timestamp last_sent_at
    }
    
    SENT_ALERTS {
        uuid id PK
        uuid alert_config_id FK
        int event_count
        enum status
        timestamp sent_at
    }
    
    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        enum action_type
        uuid resource_id
        jsonb details
        timestamp created_at
    }
```

### Key Indexes

```sql
-- Events table (high read volume)
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_company_id ON events(company_id);
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_is_critical ON events(is_critical) WHERE is_critical = true;

-- Full-text search (PostgreSQL)
CREATE INDEX idx_events_title_search ON events USING GIN(to_tsvector('portuguese', title));
CREATE INDEX idx_events_summary_search ON events USING GIN(to_tsvector('portuguese', summary));

-- Watchlist queries
CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX idx_watchlist_companies_watchlist_id ON watchlist_companies(watchlist_id);

-- Alert configs
CREATE INDEX idx_alert_configs_enabled ON alert_configs(enabled) WHERE enabled = true;
```

---

## AI/ML Pipeline Architecture

### Processing Flow

```mermaid
flowchart TD
    A[Scraper coleta documento] --> B[Salva raw no MinIO]
    B --> C[Cria entry em documents table]
    C --> D{Trigger Celery Task: process_document}
    
    D --> E[Worker 1: PDF Conversion]
    E --> F{É PDF?}
    F -->|Sim| G[PDFMiner extrai texto]
    F -->|Não| H[Texto direto JSON/HTML]
    G --> I{Texto vazio?}
    I -->|Sim| J[OCR com Tesseract]
    I -->|Não| K[Normalização de texto]
    J --> K
    H --> K
    
    K --> L[Worker 2: Classification]
    L --> M[BERTimbau inference]
    M --> N{Confidence > 60%?}
    N -->|Sim| O[Assign event_type]
    N -->|Não| P[event_type = Outro]
    
    O --> Q[Worker 3: Entity Extraction]
    P --> Q
    Q --> R[spaCy pipeline]
    R --> S[Extract: COMPANY, CNPJ, MONEY, ASSET, DATE]
    S --> T[Entity linking com companies table]
    
    T --> U[Worker 4: Indexing]
    U --> V[Save event to PostgreSQL]
    V --> W[Generate SBERT embedding]
    W --> X[Add to FAISS index]
    X --> Y[Index in Elasticsearch]
    
    Y --> Z{Is critical event?}
    Z -->|Sim| AA[Trigger instant alert task]
    Z -->|Não| AB[Done]
    AA --> AB
```

### Model Training & Inference

**BERTimbau Classification:**

```python
# Training (one-time or periodic retrain)
from transformers import BertForSequenceClassification, Trainer

model = BertForSequenceClassification.from_pretrained(
    "neuralmind/bert-base-portuguese-cased",
    num_labels=6  # Multa, Decisão, Transação, Incidente, Notícia, Outro
)

# Fine-tune with labeled dataset (500+ samples)
trainer = Trainer(
    model=model,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    ...
)
trainer.train()
model.save_pretrained("models/event_classifier")

# Inference (in Celery worker)
from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="models/event_classifier",
    device=0 if torch.cuda.is_available() else -1
)

result = classifier(document_text)
# Result: {'label': 'multa', 'score': 0.92}
```

**spaCy Entity Extraction:**

```python
import spacy
from spacy.matcher import Matcher

nlp = spacy.load("pt_core_news_lg")

# Add custom entity patterns
matcher = Matcher(nlp.vocab)

# CNPJ pattern: XX.XXX.XXX/XXXX-XX
cnpj_pattern = [{"SHAPE": "dd.ddd.ddd/dddd-dd"}]
matcher.add("CNPJ", [cnpj_pattern])

# Money pattern: R$ X milhões
money_pattern = [
    {"LOWER": "r$"},
    {"IS_DIGIT": True},
    {"LOWER": {"IN": ["milhão", "milhões", "mil"]}}
]
matcher.add("MONEY", [money_pattern])

doc = nlp(document_text)
matches = matcher(doc)

# Extract entities
entities = [
    {
        "type": "COMPANY",
        "text": ent.text,
        "confidence": 0.85,
        "start": ent.start_char,
        "end": ent.end_char
    }
    for ent in doc.ents if ent.label_ == "ORG"
]
```

**SBERT Semantic Search:**

```python
from sentence_transformers import SentenceTransformer
import faiss

model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

# Indexing
embeddings = model.encode(event_texts)  # (N, 768)
index = faiss.IndexFlatL2(768)
index.add(embeddings)
faiss.write_index(index, "indexes/events.index")

# Search
query_embedding = model.encode([query_text])
distances, indices = index.search(query_embedding, k=10)
similar_events = [events[i] for i in indices[0]]
```

---

## Deployment Architecture

### Docker Compose Services

```yaml
version: '3.8'

services:
  # Frontend
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - api
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`atlasreg.example.com`)"

  # Backend API
  api:
    build: ./apps/api
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - redis
      - minio
      - elasticsearch
    volumes:
      - ./models:/app/models:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.atlasreg.example.com`)"

  # Airflow (Scraping)
  airflow-webserver:
    build: ./apps/scraper
    command: airflow webserver
    ports:
      - "8080:8080"
    env_file: .env
    depends_on:
      - redis
    volumes:
      - ./apps/scraper/dags:/opt/airflow/dags
      - ./apps/scraper/logs:/opt/airflow/logs

  airflow-scheduler:
    build: ./apps/scraper
    command: airflow scheduler
    env_file: .env
    depends_on:
      - redis
    volumes:
      - ./apps/scraper/dags:/opt/airflow/dags
      - ./apps/scraper/logs:/opt/airflow/logs

  # Celery Workers (Processing)
  celery-worker:
    build: ./apps/scraper
    command: celery -A celery_app worker --loglevel=info --concurrency=4
    env_file: .env
    depends_on:
      - redis
      - minio
      - elasticsearch
    volumes:
      - ./models:/app/models:ro

  celery-beat:
    build: ./apps/scraper
    command: celery -A celery_app beat --loglevel=info
    env_file: .env
    depends_on:
      - redis

  celery-flower:
    build: ./apps/scraper
    command: celery -A celery_app flower --port=5555
    ports:
      - "5555:5555"
    env_file: .env
    depends_on:
      - redis

  # Databases & Storage
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    env_file: .env
    volumes:
      - minio_data:/data

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  # Reverse Proxy (se não usar Portainer)
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
      - "8081:8080"  # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_certs:/letsencrypt

volumes:
  redis_data:
  minio_data:
  es_data:
  traefik_certs:
```

### Environment Variables (.env)

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@neon-db-host.neon.tech:5432/atlasreg

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=StrongPassword123
MINIO_ENDPOINT=minio:9000

# Redis
REDIS_URL=redis://redis:6379/0

# Elasticsearch
ELASTICSEARCH_URL=http://elasticsearch:9200

# JWT
SECRET_KEY=generate-strong-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SMTP (Email Alerts)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=alertas@atlasreg.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.atlasreg.example.com

# Airflow
AIRFLOW__CORE__EXECUTOR=CeleryExecutor
AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://user:pass@neon-db-host.neon.tech:5432/airflow
AIRFLOW__CELERY__BROKER_URL=redis://redis:6379/1
AIRFLOW__CELERY__RESULT_BACKEND=db+postgresql://user:pass@neon-db-host.neon.tech:5432/airflow
```

---

## Security Considerations

### Authentication & Authorization

- **JWT Tokens:** HS256 signing, 30min expiry, refresh tokens (optional Phase 2)
- **Password Storage:** Bcrypt hashing with salt (cost factor 12)
- **RBAC:** Roles: Admin, Analyst, Viewer
  - Admin: Full access, user management
  - Analyst: Read/write events, watchlists, alerts
  - Viewer: Read-only access

### API Security

- **CORS:** Whitelist frontend domain apenas
- **Rate Limiting:** 100 req/min por usuário via Redis
- **Input Validation:** Pydantic schemas validam todos os inputs
- **SQL Injection:** SQLAlchemy ORM previne (não usar raw SQL)
- **XSS:** React escapa por padrão, shadcn/ui components seguros

### Data Security

- **Secrets Management:** Variáveis de ambiente via .env, não comitado no Git
- **Audit Logs:** Registra acessos a eventos sensíveis (tabela audit_logs)
- **Backup:** Neon PostgreSQL automated backups (PITR)
- **Encryption at Rest:** Neon provê (AES-256)
- **Encryption in Transit:** HTTPS obrigatório via Traefik + Let's Encrypt

### Scraping Ethics

- **robots.txt:** Respeitar regras de exclusão
- **Rate Limiting:** Máximo 1 req/5s por site
- **User-Agent:** Identificação clara "AtlasReg/1.0"
- **Retry Logic:** Exponential backoff, máximo 3 retries
- **Caching:** Não re-scrape conteúdo já coletado

---

## Performance Optimization

### Frontend

- **Code Splitting:** Next.js automatic route-based splitting
- **Image Optimization:** next/image para logos, screenshots
- **Lazy Loading:** React.lazy para modals, components pesados
- **Debouncing:** Search inputs com 300ms debounce
- **Caching:** React Query cache com stale-time 5min

### Backend

- **Database Connection Pooling:** SQLAlchemy pool_size=20, max_overflow=10
- **Query Optimization:** Eager loading (joinedload) para evitar N+1
- **Caching:** Redis cache para:
  - Eventos frequentemente acessados (TTL 1h)
  - Lista de empresas (TTL 24h)
  - Watchlist queries (TTL 15min)
- **Pagination:** Sempre usar limit/offset, nunca carregar tudo
- **Async I/O:** FastAPI async endpoints, await database calls

### AI/ML

- **Model Loading:** Carregar modelos na inicialização do worker, não por request
- **Batch Processing:** Processar múltiplos documentos por batch se possível
- **GPU Acceleration:** CUDA para BERT inference se disponível
- **Index Updates:** FAISS incremental adds, não rebuild completo

---

## Monitoring & Observability

### Logging

- **Structured Logging:** JSON format com timestamp, level, service, user_id
- **Log Levels:** DEBUG (dev), INFO (prod default), WARNING, ERROR
- **Centralization:** Docker logs via stdout, coletável por Grafana Loki (futuro)

### Metrics (Futuro)

- **Application Metrics:** Prometheus + Grafana
  - Request latency (p50, p95, p99)
  - Error rates por endpoint
  - Active users
  - Events processed per hour
- **Infrastructure Metrics:** CPU, RAM, disk, network
- **Business Metrics:**
  - Documents scraped per day
  - Events classified per day
  - Alerts sent per day
  - Active watchlists

### Alerts (Futuro)

- **Critical Errors:** Slack/PagerDuty para API down, database connection lost
- **Performance Degradation:** Alert se p95 latency > 5s
- **Scraping Failures:** Alert se scraper falha 3x seguidas

---

## Testing Strategy

### Frontend

- **Unit Tests:** Jest + React Testing Library
  - Components (EventCard, FilterPanel)
  - Hooks (use-events, use-watchlists)
  - Utils (API client, auth helpers)
- **Integration Tests:** Playwright
  - User flow: Login → Dashboard → Search → Event Detail → Watchlist creation
  - Mobile responsiveness
- **Coverage Target:** 70%+

### Backend

- **Unit Tests:** pytest
  - Services (storage, email, search)
  - Auth (JWT, password hashing)
  - Models (validation)
- **Integration Tests:** pytest + TestClient
  - API endpoints (request → database → response)
  - Auth flows
- **Coverage Target:** 80%+

### E2E

- **Critical Paths:** Playwright
  - New user registration → create watchlist → receive alert
  - Power user: search with filters → drill down → export document
- **Frequency:** Run em PR, deploy to staging

---

## Deployment Plan (6 Weeks)

### Week 1: Foundation

- Story 1.1: Monorepo setup ✅
- Story 1.2: Docker infrastructure ✅
- Story 1.3: CI/CD pipeline ✅
- Story 1.4: Database schema & migrations ✅
- Story 1.5: MinIO storage service ✅
- **Deliverable:** Stack sobe com `docker-compose up`, CI passa

### Week 2: Data Ingestion

- Story 1.6: Airflow DAG ANEEL scraper ✅
- Scrapers adicionais: ONS, SIGEL, mídia
- **Deliverable:** Sistema coleta automaticamente 100+ documentos/dia

### Week 3-4: AI Processing

- Story 2.1: PDF conversion ✅
- Story 2.2: BERTimbau classification ✅
- Story 2.3: spaCy entity extraction ✅
- Story 2.4: Celery workers ✅
- Story 2.5: SBERT + FAISS ✅
- Story 2.6: Elasticsearch integration ✅
- **Deliverable:** Pipeline processa documentos end-to-end, eventos estruturados no DB

### Week 4: API Layer

- Story 1.7-1.8: Auth & health check ✅
- Epic 3 stories: Event search, watchlist CRUD, user management
- **Deliverable:** API completa, documentada, testada

### Week 5: Frontend

- Epic 4 stories: Dashboard, search, watchlists UI
- **Deliverable:** Interface funcional, responsiva, design ness aplicado

### Week 6: Alerts & Polish

- Epic 5 stories: Alert config, email system, daily digest
- Bug fixes, performance tuning, documentation
- **Deliverable:** MVP completo, deploy em VPS, 5-10 usuários piloto

---

## Scalability Considerations (Post-MVP)

### Horizontal Scaling

- **API:** Múltiplas instâncias atrás de load balancer (Traefik, NGINX)
- **Celery Workers:** Scale out workers conforme carga (Docker Swarm ou K8s)
- **Database:** Neon auto-scales, considerar read replicas se necessário

### Vertical Optimization

- **Elasticsearch:** Aumentar heap memory se index cresce (>100k eventos)
- **FAISS:** Migrar para Approximate NN (IndexIVFFlat) se >1M eventos
- **Redis:** Considerar Redis Cluster se cache/queue cresce muito

### Data Archival

- **PostgreSQL:** Particionar tabela events por ano após 2+ anos de dados
- **MinIO:** Lifecycle policy para mover documentos antigos para storage tier barato

---

## Next Steps & PO Handoff

Este documento define a arquitetura técnica completa do AtlasReg. Próximos passos:

1. **Product Owner:** Validar arquitetura contra PRD usando `po-master-checklist`
2. **Product Owner:** Fragmentar (shard) PRD e Architecture em arquivos menores para desenvolvimento
3. **Scrum Master:** Criar stories técnicas detalhadas para cada sprint (6 sprints de 1 semana)
4. **Dev Team:** Iniciar implementação seguindo ordem dos Epics

**Prompt sugerido para PO:**  
"@po, valide todos os artefatos (Project Brief, PRD, Front-End Spec, Architecture) usando o checklist po-master-checklist. Depois fragmente os documentos usando o task shard-doc para facilitar desenvolvimento."

---

**Documento preparado por:** Winston (Architect - BMad Method)  
**Para workflow:** Greenfield Fullstack Development  
**Próximo agente:** PO (validation & sharding) → SM (story creation) → Dev (implementation)



