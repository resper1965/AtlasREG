# AtlasReg - Product Requirements Document (PRD)

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)  
**Versão:** 1.0  
**Data:** 17 de Outubro de 2025  
**Preparado por:** John (Product Manager - BMad Method)

---

## Goals and Background Context

### Goals

- Automatizar 90% da coleta e leitura de documentos regulatórios do setor de transmissão de energia elétrica
- Reduzir tempo de identificação de eventos críticos de dias para minutos (<30min da publicação)
- Fornecer visibilidade completa do cenário competitivo e regulatório em plataforma única
- Gerar insights acionáveis para decisões de M&A, CAPEX, compliance e relacionamento institucional
- Entregar MVP funcional em 6 semanas com cobertura de 4+ fontes prioritárias (ANEEL, ONS, SIGEL, mídia especializada)
- Atingir precisão >85% na classificação automática de eventos e >80% F1-score em extração de entidades
- Demonstrar economia de ≥2h/semana para usuários piloto em atividades de inteligência de mercado

### Background Context

O setor de transmissão de energia elétrica brasileiro opera sob regulação intensiva da ANEEL, ONS e CMSE. Decisões estratégicas críticas dependem de informações públicas fragmentadas em múltiplas fontes heterogêneas (HTML, PDF, JavaScript dinâmico) sem padronização. Atualmente, empresas realizam inteligência de mercado manual e reativa, com equipes dedicando 3-5h/dia à leitura de documentos, frequentemente descobrindo eventos críticos (multas, incidentes operacionais, transações de M&A) com atraso significativo.

**AtlasReg** resolve este problema através de plataforma de IA que automatiza o ciclo completo de coleta →processamento → análise → alerta. Utilizando scraping inteligente, modelos de NLP especializados (BERTimbau fine-tuned), e extração estruturada de entidades, o sistema transforma dados dispersos em inteligência acionável em tempo real. O ambiente regulatório em evolução com a transição energética torna esta vantagem informacional crítica para antecipação de movimentos competitivos, identificação precoce de oportunidades de M&A, e mitigação proativa de riscos operacionais e regulatórios.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-17 | 1.0 | Versão inicial do PRD baseado no Project Brief | John (PM) |

---

## Requirements

### Functional Requirements

**FR1**: O sistema deve coletar automaticamente documentos das fontes prioritárias (ANEEL notícias, ANEEL despachos, ANEEL processos de fiscalização, ONS ocorrências, SIGEL dados cadastrais, Canal Energia, MegaWhat, EPBR) com frequência configurável (mínimo diário).

**FR2**: O sistema deve converter PDFs técnicos em texto estruturado preservando metadados (data de publicação, órgão emissor, número do processo/documento).

**FR3**: O sistema deve classificar automaticamente cada documento em categorias de evento: Multa/PV, Decisão Regulatória, Transação de M&A, Incidente Operacional, Mudança de Controle Societário, Notícia Genérica, Outro.

**FR4**: O sistema deve extrair automaticamente entidades estruturadas: nomes de empresas, CNPJs, valores monetários, nomes de ativos (linhas de transmissão, subestações), datas relevantes, órgãos reguladores mencionados.

**FR5**: O sistema deve armazenar eventos processados em banco PostgreSQL com schema normalizado permitindo queries por: tipo de evento, empresa, data, valor, ativo, palavra-chave.

**FR6**: O sistema deve fornecer busca semântica usando embeddings (SBERT + FAISS) permitindo encontrar documentos conceit ualmente similares independente de palavras-chave exatas.

**FR7**: O sistema deve fornecer busca full-text via Elasticsearch permitindo queries complexas com filtros combinados (ex: "empresa X AND multa AND valor >1M").

**FR8**: O sistema deve disponibilizar dashboard web interativo com: feed temporal de eventos, filtros por tipo/empresa/data, busca integrada, visualização de detalhes de eventos individuais com link para documento original.

**FR9**: O sistema deve permitir configuração de "watchlist" onde usuário seleciona empresas, tipos de evento, e palavras-chave de interesse.

**FR10**: O sistema deve enviar alertas por email diariamente para usuários com resumo de eventos que correspondem à sua watchlist configurada.

**FR11**: O sistema deve manter rastreabilidade completa: cada evento deve referenciar documento original, permitindo auditoria da extração.

**FR12**: O sistema deve suportar autenticação de usuários via email/senha com diferentes níveis de acesso (Admin, Analyst, Viewer).

**FR13**: O sistema deve registrar logs de auditoria para ações sensíveis (configuração de alertas, acesso a informações de empresas específicas).

### Non-Functional Requirements

**NFR1**: O pipeline de scraping deve processar backlog diário típico (<500 documentos) em menos de 4 horas.

**NFR2**: O dashboard deve carregar página inicial em <3s com conexão de banda larga (5Mbps+).

**NFR3**: Queries de busca devem retornar resultados em <2s para 95% dos casos com banco contendo até 50k eventos.

**NFR4**: O sistema deve ter uptime de ≥99.5% (máximo ~3.6h downtime/mês).

**NFR5**: A classificação de eventos deve atingir accuracy ≥85% validado em amostra representativa de 500+ documentos.

**NFR6**: A extração de entidades deve atingir F1-score ≥80% para empresas e CNPJs validado em amostra de 500+ documentos.

**NFR7**: O código deve seguir padrões de linting (ESLint para TypeScript, Black para Python) com CI/CD validando em cada commit.

**NFR8**: Todos os endpoints de API devem ter documentação automática (OpenAPI/Swagger).

**NFR9**: O sistema deve armazenar dados sensíveis (passwords) com hashing adequado (bcrypt/Argon2).

**NFR10**: Logs de aplicação devem ser estruturados (JSON) e centralizados para facilitar debugging e monitoramento.

**NFR11**: O sistema deve ser containerizado (Docker) com docker-compose para deployment simplificado.

**NFR12**: Scrapers devem respeitar robots.txt, implementar rate limiting, e usar rotating user-agents para coleta ética.

**NFR13**: A aplicação frontend deve ser acessível (contraste mínimo WCAG AA, navegação por teclado funcional).

---

## User Interface Design Goals

### Overall UX Vision

AtlasReg deve oferecer experiência de "central de comando" para inteligência de mercado. Interface dark-first elegante seguindo design system ness com wordmark "ness." (Montserrat Medium, ponto #00ADE8), paleta de cinzas frios (fundo #0B0C0E, superfícies #111317/#151820), ícones monocromáticos stroke 1.5, shadcn/ui. Usuários devem sentir que estão consultando sistema profissional e confiável, com informações densas mas organizadas visualmente, minimizando distrações e maximizando produtividade.

### Key Interaction Paradigms

- **Feed contínuo** estilo timeline como padrão principal de navegação (eventos mais recentes no topo)
- **Filtros laterais persistentes** para refinamento rápido sem mudança de página
- **Busca omnipresente** com autocomplete inteligente
- **Drill-down progressivo**: card de evento → modal com detalhes expandidos → link para documento original
- **Configuração inline** de watchlist (hover em empresa/evento → botão "adicionar à watchlist")
- **Notificações discretas** (badge count de novos eventos desde último acesso)

### Core Screens and Views

1. **Login/Signup Screen**: Autenticação simples, opção "Esqueci senha"
2. **Dashboard Principal (Feed de Eventos)**: Timeline infinita de eventos com cards compactos, filtros laterais, busca no topo
3. **Detalhes de Evento (Modal)**: Informações completas do evento com entidades extraídas highlighted, botão para documento original
4. **Busca Avançada**: Interface dedicada para queries complexas com múltiplos filtros combinados
5. **Minha Watchlist**: Configuração de empresas, tipos de evento, palavras-chave monitoradas
6. **Configurações de Alertas**: Frequência de emails, canais de notificação, preferências de formato
7. **Perfil/Settings**: Dados do usuário, senha, preferências de interface

### Accessibility

**WCAG AA** - Contraste mínimo de texto 4.5:1, navegação completa por teclado, labels ARIA em componentes interativos, suporte a screen readers.

### Branding

Seguir design system **ness.** conforme especificação:
- Wordmark "ness." com fonte Montserrat Medium, ponto final sempre em #00ADE8
- Paleta de cinzas frios: fundo #0B0C0E, superfícies elevadas #111317 / #151820 / #1B2030, texto #EEF1F6
- Ícones monocromáticos do Heroicons com stroke 1.5
- Componentes shadcn/ui customizados com Tailwind
- Transições suaves 120-240ms com easing cubic-bezier(0.2, 0.8, 0.2, 1)

### Target Platforms

**Web Responsive** - Desktop-first (1920x1080 primário), tablet (iPad landscape), mobile (visualização apenas, não otimizado para configuração complexa).

---

## Technical Assumptions

### Repository Structure

**Monorepo** usando **Turborepo** para gerenciar frontend, backend, e scrapers em repositório único com workspaces compartilhados.

```
atlas-reg/
├── apps/
│   ├── web/          # Frontend Next.js
│   ├── api/          # Backend FastAPI
│   └── scraper/      # Sistema de scraping com Airflow
├── packages/
│   ├── shared/       # Types, utils compartilhados
│   └── ui/           # Componentes reutilizáveis
├── docker/
│   └── docker-compose.yml
└── docs/
```

### Service Architecture

**Microserviços leves com comunicação interna** dentro de monorepo dockerizado:

1. **Scraper Service** (Python + Airflow): DAGs para coleta agendada, armazena bruto em MinIO
2. **Processor Service** (Python + Celery): Workers processam PDFs, classificam, extraem entidades, salvam em PostgreSQL/FAISS/Elasticsearch
3. **API Service** (FastAPI): Endpoints REST para frontend e sistema de alertas
4. **Web Service** (Next.js SSR): Interface do usuário, server-side rendering para SEO

Comunicação assíncrona via **Redis** (message broker para Celery), dados em **PostgreSQL** compartilhado.

### Testing Requirements

**Pirâmide de testes completa**:
- **Unit Tests** (obrigatórios): pytest para Python, Jest para TypeScript, cobertura mínima 70%
- **Integration Tests**: Testar pipelines end-to-end (scraping → processamento → API → frontend)
- **E2E Tests** (críticos): Playwright para user journeys principais (login, busca, configuração watchlist)
- **Manual QA**: Validação de qualidade de classificação/extração com amostras reais

**Mocks**: Scrapers devem ter modo mock para desenvolvimento local sem depender de sites externos.

### Additional Technical Assumptions

- **Database**: Neon PostgreSQL online para todos os ambientes (local, staging, prod) - sem banco local
- **Deployment**: Docker + Docker Compose, Portainer para gerenciamento visual, Traefik para SSL/reverse proxy (já gerenciado via Portainer)
- **CI/CD**: GitHub Actions para linting, testes, build de Docker images
- **Observability**: Logs estruturados JSON, considerar Grafana/Prometheus para monitoramento no futuro
- **Models de IA**: Usar HuggingFace Hub para modelos pré-treinados (BERTimbau), fine-tuning local se necessário
- **Scraping ético**: Respeitar robots.txt, rate limiting de 1 req/5s por site, rotating user-agents, caching agressivo para evitar re-scraping
- **Storage**: MinIO para PDFs/arquivos brutos (S3-compatible), permite migração futura para S3 real se necessário
- **Secrets**: Variáveis de ambiente via .env (não comitado), considerar Vault no futuro
- **Versioning**: Semantic versioning para releases, tags Git

---

## Epic List

**Epic 1: Foundation & Data Ingestion Pipeline**  
_Estabelecer infraestrutura do projeto (monorepo, Docker, CI/CD, databases) e implementar scraping automatizado de fontes prioritárias com armazenamento bruto._

**Epic 2: AI Processing & Entity Extraction**  
_Desenvolver pipeline de processamento inteligente com classificação de eventos, extração de entidades, e indexação semântica + full-text._

**Epic 3: API & Data Access Layer**  
_Criar API REST com autenticação, endpoints de busca, gestão de usuários, e fundação para alertas._

**Epic 4: Web Dashboard & User Experience**  
_Implementar interface web responsiva com feed de eventos, busca avançada, filtros interativos, e visualização de detalhes._

**Epic 5: Watchlist & Alert System**  
_Habilitar configuração de watchlist personalizada e sistema de alertas por email com resumos diários._

---

## Epic Details

### Epic 1: Foundation & Data Ingestion Pipeline

**Epic Goal:**  
Estabelecer a fundação técnica do projeto AtlasReg (monorepo Turborepo, Docker, CI/CD, databases Neon PostgreSQL + MinIO) e implementar sistema de scraping automatizado usando Airflow que coleta documentos das fontes prioritárias (ANEEL, ONS, SIGEL, mídia especializada) com agendamento configurável, armazenando arquivos brutos em MinIO para processamento posterior. Ao final deste epic, o sistema já estará coletando dados automaticamente e terá health check básico.

#### Story 1.1: Project Setup & Monorepo Foundation

As a **developer**,  
I want the monorepo structure configured with Turborepo, TypeScript/Python tooling, and Git repository initialized,  
so that the team can start developing in a organized codebase with proper dependency management.

**Acceptance Criteria:**
1. Monorepo criado usando Turborepo com workspaces: `apps/web` (Next.js), `apps/api` (FastAPI), `apps/scraper` (Airflow), `packages/shared`
2. Package.json configurado com scripts: `dev`, `build`, `test`, `lint`
3. Python environment setup com `pyproject.toml` ou `requirements.txt` para FastAPI e scraper dependencies
4. ESLint + Prettier configurados para TypeScript, Black + isort para Python
5. Git repository inicializado com `.gitignore` adequado (excluindo `.env`, `node_modules`, `__pycache__`, etc.)
6. README.md com instruções de setup e estrutura do projeto
7. Todos os workspaces buildaveis sem erros

---

#### Story 1.2: Docker Infrastructure Setup

As a **DevOps engineer**,  
I want Docker Compose configuration with all services (PostgreSQL via Neon connection, MinIO, Redis, Airflow, API, Web),  
so that the entire stack can be started locally with one command.

**Acceptance Criteria:**
1. `docker/docker-compose.yml` define services: minio, redis, airflow-webserver, airflow-scheduler, api, web
2. PostgreSQL connection configurada via variáveis de ambiente apontando para Neon (não container local)
3. MinIO configurado com buckets: `raw-documents`, `processed-documents`
4. Redis configurado para uso do Airflow e Celery
5. Airflow configurado com LocalExecutor ou CeleryExecutor
6. Volumes persistentes configurados para MinIO data e Airflow DAGs
7. Health checks configurados para todos os serviços críticos
8. Comando `docker-compose up` sobe toda a stack funcional
9. Documentação no README com ports de cada serviço

---

#### Story 1.3: CI/CD Pipeline with GitHub Actions

As a **developer**,  
I want automated CI/CD pipeline that runs linting, tests, and builds on every commit,  
so that code quality is maintained and regressions are caught early.

**Acceptance Criteria:**
1. `.github/workflows/ci.yml` configurado para rodar em push/PR
2. Workflow executa linting: ESLint para TS, Black para Python
3. Workflow executa testes unitários: Jest para TS, pytest para Python
4. Workflow executa build de todos os apps sem erros
5. Pipeline falha se linting ou testes falham (blocking)
6. Badge de status do CI adicionado ao README
7. Workflow otimizado com caching de dependencies (npm, pip)

---

#### Story 1.4: Database Schema & Migrations Foundation

As a **backend developer**,  
I want PostgreSQL schema inicial com tabelas core e sistema de migrations (Alembic ou Prisma),  
so that data models are versioned and database can evolve safely.

**Acceptance Criteria:**
1. Tabelas criadas no Neon PostgreSQL: `users`, `companies`, `assets`, `events`, `documents`, `watchlists`
2. Schema normalizado com foreign keys e indexes apropriados
3. Migration tool configurado (Alembic para Python ou Prisma se usando Node)
4. Migration inicial `001_create_core_tables.sql` ou equivalente
5. Seed script para popular dados de teste (3-5 empresas, 10-20 eventos mock)
6. Documentação do schema com diagrama ER (pode ser Mermaid no README)
7. Connection string do Neon armazenada em `.env` (não comitada)

---

#### Story 1.5: MinIO Storage & Document Service

As a **backend developer**,  
I want service layer Python para gerenciar upload/download de documentos no MinIO,  
so that scrapers can store raw files and processors can retrieve them efficiently.

**Acceptance Criteria:**
1. Python module `storage_service.py` com funções: `upload_document()`, `download_document()`, `list_documents()`, `delete_document()`
2. Integração com boto3 (S3-compatible client) para MinIO
3. Metadata armazenada no PostgreSQL (tabela `documents`) com referência ao object key no MinIO
4. Testes unitários com mock de MinIO (usando moto ou similar)
5. Error handling para casos: bucket não existe, network error, file not found
6. Logging estruturado (JSON) de todas as operações
7. Documentação de API do service no código (docstrings)

---

#### Story 1.6: Airflow DAG for ANEEL News Scraping

As a **data engineer**,  
I want Airflow DAG que scrape notícias do site da ANEEL diariamente usando Scrapy/Playwright,  
so that we automatically collect regulatory news for processing.

**Acceptance Criteria:**
1. DAG `aneel_news_scraper` configurado para rodar diariamente às 06:00 BRT
2. Scraper usando Scrapy ou Playwright extrai: título, data, URL, corpo da notícia
3. Documentos salvos como JSON no MinIO bucket `raw-documents/aneel/news/YYYY-MM-DD/`
4. Entry criada na tabela `documents` com metadata: source=ANEEL, type=news, status=raw
5. Scraper implementa rate limiting (1 req/5s) e rotating user-agent
6. Logs estruturados de execução (quantos documentos coletados, erros)
7. DAG tem retry logic (3 attempts com exponential backoff)
8. Health check: DAG consegue coletar pelo menos 1 notícia em teste manual

---

#### Story 1.7: Basic API Health Check & Authentication

As a **backend developer**,  
I want FastAPI application com endpoint de health check e autenticação JWT básica,  
so that frontend can verify API status and users can authenticate.

**Acceptance Criteria:**
1. FastAPI app inicializado com estrutura: `main.py`, `routers/`, `models/`, `services/`, `auth/`
2. Endpoint `GET /health` retorna `{"status": "ok", "timestamp": "..."}` sem autenticação
3. Endpoint `POST /auth/register` cria usuário com email/password (password hashed com bcrypt)
4. Endpoint `POST /auth/login` retorna JWT token válido para credenciais corretas
5. Middleware de autenticação valida JWT em rotas protegidas
6. Testes de integração para todos os auth endpoints
7. OpenAPI docs automáticos acessíveis em `/docs`
8. CORS configurado para permitir requests do frontend localhost

---

#### Story 1.8: Basic Next.js Frontend with Auth

As a **frontend developer**,  
I want Next.js application com página de login funcional conectada à API,  
so that users can authenticate and access the dashboard.

**Acceptance Criteria:**
1. Next.js 14+ app inicializado com TypeScript, Tailwind CSS, shadcn/ui
2. Página `/login` com form (email, password) usando React Hook Form + Zod validation
3. Integração com API `/auth/login` usando fetch ou axios
4. JWT armazenado em httpOnly cookie ou localStorage
5. Redirect para `/dashboard` após login bem-sucedido
6. Página `/dashboard` protegida (redirect para `/login` se não autenticado)
7. Dashboard placeholder exibe "Olá, [usuário]" após login
8. Design system ness aplicado: cores, tipografia Montserrat, ícones Heroicons
9. Aplicação responsiva (desktop + tablet)

---

### Epic 2: AI Processing & Entity Extraction

**Epic Goal:**  
Desenvolver pipeline de processamento inteligente que transforma documentos brutos em eventos estruturados. Implementar conversão de PDFs, classificação automática de eventos usando BERTimbau fine-tuned, extração de entidades (empresas, CNPJs, valores, ativos) com spaCy, e indexação dual (semântica com SBERT+FAISS e full-text com Elasticsearch). Ao final, sistema automaticamente processa documentos scraped gerando dados consumíveis pela API.

#### Story 2.1: PDF to Text Conversion Service

As a **ML engineer**,  
I want service que converte PDFs em texto estruturado preservando metadata,  
so that AI models can process document content.

**Acceptance Criteria:**
1. Python module `pdf_processor.py` usando pdfminer.six ou PyMuPDF
2. Função `extract_text_from_pdf(file_path)` retorna texto + metadata (pages, autor, data)
3. Tratamento de PDFs escaneados com OCR fallback (Tesseract) se texto extraído for vazio
4. Normalização de texto (remove caracteres especiais, fix encoding issues)
5. Testes com PDFs reais da ANEEL (3-5 samples diversos)
6. Performance: Processa PDF de 10 páginas em <30s
7. Error handling: PDFs corrompidos, protegidos por senha

---

#### Story 2.2: Event Classification Model Setup

As a **ML engineer**,  
I want modelo BERTimbau treinado para classificar documentos em categorias de evento,  
so that events are automatically categorized.

**Acceptance Criteria:**
1. Dataset rotulado criado: 500+ documentos manualmente classificados em categorias (Multa, Decisão, Transação, Incidente, Notícia, Outro)
2. Script de fine-tuning `train_classifier.py` usando HuggingFace Transformers
3. Modelo BERTimbau fine-tuned salvo em `models/event_classifier/`
4. Função `classify_event(text)` retorna classe + confidence score
5. Accuracy validada ≥85% em test set (20% holdout)
6. Inference otimizada: Classifica documento em <5s
7. Fallback para classe "Outro" se confidence <60%

---

#### Story 2.3: Entity Extraction with spaCy

As a **NLP engineer**,  
I want pipeline spaCy customizado que extrai entidades estruturadas de texto,  
so that we can identify companies, CNPJs, values, assets from documents.

**Acceptance Criteria:**
1. spaCy pipeline configurado com modelo `pt_core_news_lg` + custom rules
2. Entity types extraídos: COMPANY (empresas), CNPJ, MONEY (valores monetários), ASSET (linhas/subestações), DATE, ORG (órgãos reguladores)
3. Regras regex para CNPJ (formato XX.XXX.XXX/XXXX-XX) e valores (R$ X milhões)
4. Função `extract_entities(text)` retorna lista de entidades com tipo, texto, span
5. Testes com 50+ documentos sample: F1-score ≥80% para COMPANY e CNPJ
6. Entity linking para tabela `companies` no PostgreSQL (match por nome/CNPJ)
7. Performance: Processa documento de 5000 palavras em <10s

---

#### Story 2.4: Celery Processing Workers

As a **backend developer**,  
I want Celery workers que processam documentos brutos asynchronously,  
so that pipeline handles load without blocking.

**Acceptance Criteria:**
1. Celery configurado com Redis como broker e result backend
2. Task `process_document` executa: PDF conversion → classification → entity extraction
3. Resultado salvo no PostgreSQL (tabela `events` com entidades na tabela `extracted_entities`)
4. Task registra status: queued → processing → completed/failed
5. Retry logic: 3 attempts com exponential backoff para failures
6. Worker pool configurado com 4 workers concorrentes
7. Monitoring: Celery Flower UI configurado para ver tasks em tempo real
8. Logs estruturados (JSON) de cada step do processing

---

#### Story 2.5: Semantic Search with SBERT + FAISS

As a **ML engineer**,  
I want indexação semântica usando Sentence-BERT embeddings e FAISS,  
so that users can find conceptually similar documents.

**Acceptance Criteria:**
1. Script `build_semantic_index.py` gera embeddings usando SBERT model (`paraphrase-multilingual-mpnet-base-v2`)
2. Embeddings de todos os eventos armazenados em FAISS index (arquivo `.index`)
3. Função `semantic_search(query, top_k=10)` retorna eventos mais similares
4. Index atualizado incrementalmente quando novos eventos são processados
5. Performance: Query retorna top-10 resultados em <500ms para index com 10k eventos
6. Testes com queries sample: "multas por descumprimento" deve retornar eventos de multas
7. FAISS index persistido em disco e carregado na inicialização do worker

---

#### Story 2.6: Elasticsearch Integration for Full-Text Search

As a **backend developer**,  
I want Elasticsearch configurado para busca full-text e queries complexas,  
so that users can search with filters and keywords.

**Acceptance Criteria:**
1. Elasticsearch container adicionado ao docker-compose
2. Index `events` criado com mapping otimizado: title (text), company (keyword), event_type (keyword), amount (float), date (date)
3. Eventos do PostgreSQL sincronizados para Elasticsearch via Celery task
4. API endpoint `GET /search` aceita query params: q (text), company, event_type, date_from, date_to, min_amount
5. Queries retornam resultados com highlighting dos termos matched
6. Testes: Query "ANEEL multa transmissora" retorna eventos relevantes
7. Performance: Query com 3 filtros retorna em <2s

---

### Epic 3: API & Data Access Layer

**Epic Goal:**  
Criar API REST completa com FastAPI fornecendo endpoints para autenticação, gestão de usuários, busca de eventos (semantic + full-text), CRUD de watchlists, e fundação para sistema de alertas. Implementar autorização baseada em roles (Admin, Analyst, Viewer), logging de auditoria, e documentação OpenAPI. Ao final, API expõe todos os dados processados de forma segura e performática.

#### Story 3.1: User Management Endpoints

As a **backend developer**,  
I want endpoints CRUD para gestão de usuários com roles,  
so that admins can manage access.

**Acceptance Criteria:**
1. Endpoints: `GET /users`, `GET /users/{id}`, `PATCH /users/{id}`, `DELETE /users/{id}`
2. Role-based authorization: apenas Admin pode listar/modificar/deletar usuários
3. Response models usando Pydantic para validação e serialização
4. Password update requer senha atual (para segurança)
5. Soft delete para usuários (flag `is_active=false` ao invés de DELETE físico)
6. Testes de integração para todos os endpoints incluindo authorization checks
7. OpenAPI docs atualizados automaticamente

---

#### Story 3.2: Event Search API Endpoints

As a **backend developer**,  
I want endpoints de busca que integram semantic search e Elasticsearch,  
so that frontend can query events flexibly.

**Acceptance Criteria:**
1. `GET /events/search` com params: q (texto), company, event_type, date_from, date_to, sort, limit, offset
2. Query usa Elasticsearch por padrão; fallback para semantic search se param `semantic=true`
3. Response paginated com metadata: `{items: [...], total, page, pages}`
4. Cada event retorna: id, title, summary, event_type, company, date, amount, confidence_score, source_url
5. Filtros são combinados com AND logic
6. Performance: Query retorna em <2s para 95% dos casos
7. Rate limiting: 100 req/min por usuário

---

#### Story 3.3: Event Detail & Document Retrieval

As a **backend developer**,  
I want endpoint para detalhes completos de evento incluindo documento original,  
so that users can drill down into events.

**Acceptance Criteria:**
1. `GET /events/{id}` retorna evento completo com extracted entities, metadata, link para documento
2. `GET /documents/{id}/download` retorna documento original do MinIO (PDF ou JSON)
3. Authorization: Analyst e Admin têm acesso, Viewer tem acesso somente-leitura
4. Audit log registra acesso a eventos específicos (user_id, event_id, timestamp)
5. Response model inclui array de entidades: `{type, text, confidence}`
6. Caching de eventos frequentemente acessados usando Redis (TTL 1h)
7. Testes garantindo autorização funciona corretamente

---

#### Story 3.4: Company & Asset Data Endpoints

As a **backend developer**,  
I want endpoints para listar empresas e ativos do setor,  
so that frontend pode popular filtros e watchlists.

**Acceptance Criteria:**
1. `GET /companies` retorna lista de empresas: id, name, cnpj, group, logo_url
2. `GET /companies/{id}` retorna empresa com histórico de eventos relacionados
3. `GET /assets` retorna lista de ativos: id, name, type (linha/subestação), voltage, company_id
4. Response models com Pydantic incluindo nested relationships
5. Endpoints suportam pagination e search por nome
6. Dados seed incluem 20+ empresas reais do setor (usando dados públicos do SIGEL)
7. OpenAPI docs com exemplos de response

---

#### Story 3.5: Watchlist CRUD Endpoints

As a **backend developer**,  
I want endpoints para criar e gerenciar watchlists personalizadas,  
so that users can configure what they want to monitor.

**Acceptance Criteria:**
1. `POST /watchlists` cria watchlist com: name, companies[], event_types[], keywords[]
2. `GET /watchlists` retorna watchlists do usuário autenticado
3. `GET /watchlists/{id}` retorna watchlist específica
4. `PATCH /watchlists/{id}` atualiza configuração
5. `DELETE /watchlists/{id}` remove watchlist
6. Schema PostgreSQL: tabela `watchlists` com M2M para `companies` e arrays para event_types/keywords
7. Authorization: usuário só pode acessar/modificar suas próprias watchlists (exceto Admin)
8. Validação: watchlist deve ter ao menos 1 critério (company OU event_type OU keyword)

---

#### Story 3.6: Watchlist Events Feed

As a **backend developer**,  
I want endpoint que retorna eventos matching watchlist criteria,  
so that users can see what's relevant to them.

**Acceptance Criteria:**
1. `GET /watchlists/{id}/events` retorna eventos que correspondem aos critérios da watchlist
2. Matching logic: evento match se (company IN watchlist.companies) OR (event_type IN watchlist.event_types) OR (any keyword IN event.text)
3. Suporta params adicionais: date_from, date_to, limit, offset
4. Events ordenados por date DESC (mais recentes primeiro)
5. Response inclui flag `is_new` se evento foi criado após último acesso do usuário à watchlist
6. Caching de queries recentes (Redis, TTL 15min)
7. Performance: Query com watchlist de 10 empresas retorna em <1s

---

### Epic 4: Web Dashboard & User Experience

**Epic Goal:**  
Implementar interface web completa do AtlasReg com dashboard dark-first (design system ness), feed interativo de eventos, busca avançada, sistema de filtros laterais, visualização drill-down de detalhes, e páginas de configuração de perfil/watchlists. Garantir responsividade (desktop/tablet), acessibilidade WCAG AA, e experiência fluida com loading states e error handling. Ao final, usuários podem consumir toda a inteligência processada através de UI intuitiva e profissional.

#### Story 4.1: Design System & Component Library

As a **frontend developer**,  
I want design system ness implementado com shadcn/ui components customizados,  
so that UI é consistente e development é acelerado.

**Acceptance Criteria:**
1. Tailwind config customizado com paleta ness: `bg-ness-dark: #0B0C0E`, `surface-1: #111317`, `accent: #00ADE8`, `text: #EEF1F6`
2. Typography: Montserrat font importada, classes `.wordmark` com ponto azul
3. shadcn/ui components instalados e tematizados: Button, Input, Card, Badge, Dialog, Select, Dropdown
4. Custom components: `<EventCard>`, `<FilterPanel>`, `<SearchBar>`, `<WatchlistBadge>`
5. Ícones Heroicons integrados (stroke-1.5, monocromáticos)
6. Storybook opcional para documentar components
7. Todos os components seguem princípios: acessíveis (keyboard nav, ARIA labels), responsivos

---

#### Story 4.2: Dashboard Layout & Navigation

As a **frontend developer**,  
I want layout principal com sidebar navigation e topbar,  
so that users can navigate between sections.

**Acceptance Criteria:**
1. Layout com sidebar colapsável (desktop) ou drawer (mobile)
2. Navigation items: Dashboard, Busca Avançada, Minhas Watchlists, Configurações
3. Topbar com logo ness., search bar global, user avatar dropdown (logout, perfil)
4. Active state destacado no nav item atual
5. Sidebar collapse state persistido em localStorage
6. Layout responsivo: <768px usa bottom nav ao invés de sidebar
7. Loading skeleton durante fetch inicial de dados do usuário

---

#### Story 4.3: Events Feed (Main Dashboard)

As a **frontend developer**,  
I want página principal com feed infinito de eventos em cards,  
so that users can browse recent events.

**Acceptance Criteria:**
1. Grid/list de `<EventCard>` components mostrando: título, tipo (badge colorido), empresa, data, valor se presente
2. Infinite scroll ou pagination (Load More button)
3. Integração com `GET /events/search` API endpoint
4. Loading states: skeleton cards durante fetch
5. Empty state: "Nenhum evento encontrado" com ilustração
6. Cada card clicável abre modal com detalhes completos (Story 4.5)
7. Cards mostram badge "NOVO" se evento foi criado nas últimas 24h
8. Performance: Renderiza 50 cards sem lag

---

#### Story 4.4: Filter Panel & Advanced Search

As a **frontend developer**,  
I want painel lateral de filtros e página de busca avançada,  
so that users can refine results.

**Acceptance Criteria:**
1. Filter panel (sidebar ou collapsible) com: empresa (multi-select), tipo de evento (checkboxes), range de datas, valor mínimo
2. Filtros aplicados dinamicamente atualizam feed sem reload da página
3. URL query params sincronizados com filtros (shareable links)
4. "Limpar Filtros" button reseta para default
5. Página `/search` com busca avançada: campo de texto principal + todos os filtros disponíveis
6. Autocomplete no campo de empresa (integra `GET /companies`)
7. Search history persistida em localStorage (últimas 5 buscas)

---

#### Story 4.5: Event Detail Modal & Document View

As a **frontend developer**,  
I want modal de detalhes completos do evento com link para documento original,  
so that users can drill down.

**Acceptance Criteria:**
1. Modal (Dialog shadcn/ui) abre ao clicar em EventCard
2. Exibe: título completo, summary, entidades extraídas com badges (empresas, CNPJs destacados), metadata (data, fonte, confidence score)
3. Botão "Ver Documento Original" abre PDF/JSON em nova aba (usa `GET /documents/{id}/download`)
4. Botão "Adicionar à Watchlist" permite quick add (integra com watchlist API)
5. Modal responsiva: fullscreen em mobile, centered dialog em desktop
6. Keyboard navigation: ESC fecha modal, Tab navega entre elements
7. Loading state enquanto fetcha detalhes (`GET /events/{id}`)

---

#### Story 4.6: Watchlist Management Page

As a **frontend developer**,  
I want página para criar e gerenciar watchlists,  
so that users can configure monitoring.

**Acceptance Criteria:**
1. Página `/watchlists` lista watchlists existentes em cards
2. Botão "Nova Watchlist" abre form modal: nome, empresas (multi-select), tipos de evento (checkboxes), keywords (tag input)
3. Cada watchlist card mostra: nome, número de critérios, número de eventos novos (badge)
4. Edit/Delete actions em cada card (com confirmação para delete)
5. Integração com `POST /watchlists`, `PATCH /watchlists/{id}`, `DELETE /watchlists/{id}`
6. Validação: watchlist deve ter ao menos 1 critério antes de salvar
7. Success/error toasts após operações (usando sonner ou similar)

---

#### Story 4.7: Watchlist Events Feed

As a **frontend developer**,  
I want página específica para visualizar eventos de uma watchlist,  
so that users can see what's relevant.

**Acceptance Criteria:**
1. Página `/watchlists/{id}/events` reutiliza componente Events Feed (Story 4.3)
2. Header mostra nome da watchlist e critérios configurados
3. Eventos automaticamente filtrados pelos critérios da watchlist (integra `GET /watchlists/{id}/events`)
4. Badge "NOVO" em eventos que apareceram desde último acesso
5. Timestamp "Última visualização" atualizado ao acessar a página
6. Botão "Editar Watchlist" abre modal de edição
7. Empty state específico: "Nenhum evento corresponde aos seus critérios ainda"

---

#### Story 4.8: User Profile & Settings

As a **frontend developer**,  
I want página de configurações para usuário editar perfil,  
so that users can manage their account.

**Acceptance Criteria:**
1. Página `/settings` com tabs: Perfil, Senha, Preferências
2. Tab Perfil: form para editar nome, email (readonly), avatar (upload futuro)
3. Tab Senha: form para alterar senha (senha atual, nova senha, confirmar)
4. Tab Preferências: timezone, language (PT-BR por enquanto), theme (dark/light - dark only no MVP)
5. Integração com `PATCH /users/{id}` para updates
6. Form validation com feedback visual (Zod + React Hook Form)
7. Success notification após save, error handling para falhas
8. Loading states em botões durante submit

---

### Epic 5: Watchlist & Alert System

**Epic Goal:**  
Habilitar sistema completo de alertas configuráveis, onde usuários recebem notificações automáticas por email com resumos diários dos eventos que correspondem às suas watchlists. Implementar job agendado (Celery beat) que gera emails personalizados usando templates HTML, tracking de alertas enviados, e configuração de frequência/preferências de notificação. Ao final, sistema proativamente mantém usuários informados sobre eventos críticos sem necessidade de acesso manual ao dashboard.

#### Story 5.1: Alert Configuration Model & API

As a **backend developer**,  
I want tabela e endpoints para configuração de alertas,  
so that users can customize notification preferences.

**Acceptance Criteria:**
1. Tabela `alert_configs` no PostgreSQL: user_id, watchlist_id, channel (email/telegram), frequency (daily/instant/weekly), enabled, last_sent_at
2. Endpoints: `POST /alerts`, `GET /alerts`, `PATCH /alerts/{id}`, `DELETE /alerts/{id}`
3. Validação: user só pode criar alert para watchlist que possui
4. Default ao criar watchlist: alert config criado automaticamente com frequency=daily, channel=email, enabled=true
5. Response models com Pydantic incluindo nested watchlist info
6. Testes de integração para CRUD operations
7. OpenAPI docs atualizados

---

#### Story 5.2: Email Template System

As a **backend developer**,  
I want templates HTML para emails de alerta com design ness,  
so that notifications are professional and branded.

**Acceptance Criteria:**
1. Template engine configurado (Jinja2)
2. Template `daily_digest.html` com: header (logo ness.), seção de eventos agrupados por tipo, footer com link "Ver no Dashboard"
3. Cada evento no email: título, empresa, data, snippet, CTA "Ver Detalhes"
4. Template responsivo (mobile-friendly email design)
5. Variáveis: `user_name`, `watchlist_name`, `events[]`, `period` (data range)
6. Plain-text fallback version para clientes de email sem HTML
7. Template testado manualmente em Gmail, Outlook, Apple Mail

---

#### Story 5.3: Email Sending Service

As a **backend developer**,  
I want service para enviar emails usando SMTP provider,  
so that alerts can be delivered reliably.

**Acceptance Criteria:**
1. SMTP config usando env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
2. Python module `email_service.py` com função `send_email(to, subject, html, text_fallback)`
3. Integração com provider (SendGrid, AWS SES, ou SMTP genérico)
4. Retry logic para failures (3 attempts com exponential backoff)
5. Tracking de emails enviados: tabela `sent_alerts` (user_id, watchlist_id, sent_at, status)
6. Rate limiting: máximo 100 emails/hora para prevenir spam accidental
7. Logs estruturados de todos os envios (success/failure com error details)

---

#### Story 5.4: Daily Digest Celery Task

As a **backend developer**,  
I want Celery beat task agendado que gera e envia daily digests,  
so that users receive automatic notifications.

**Acceptance Criteria:**
1. Celery beat configurado com schedule: daily digest task roda diariamente às 08:00 BRT
2. Task `send_daily_digests` busca todos os alert_configs com frequency=daily e enabled=true
3. Para cada config: busca eventos da watchlist nas últimas 24h (desde last_sent_at)
4. Se houver eventos novos: renderiza template e envia email via email_service
5. Atualiza `last_sent_at` após envio bem-sucedido
6. Logs de execução: quantos alerts processados, quantos emails enviados, erros
7. Task é idempotente (pode ser reexecutado sem duplicar envios)
8. Testes com mock de email_service verificando lógica de filtering

---

#### Story 5.5: Alert Preferences UI

As a **frontend developer**,  
I want página de configuração de alertas no frontend,  
so that users can manage notifications.

**Acceptance Criteria:**
1. Página `/settings/alerts` lista todos os alert configs do usuário
2. Para cada watchlist: toggle enabled/disabled, select frequency (daily/instant), select channel (email)
3. Integração com `GET /alerts`, `PATCH /alerts/{id}`
4. Mudanças persistidas imediatamente (optimistic updates com rollback em erro)
5. Success toast após save confirmando "Preferências atualizadas"
6. Preview de email: botão "Enviar Email de Teste" dispara `POST /alerts/test` que envia sample digest
7. UI mostra timestamp do último alerta enviado para cada watchlist

---

#### Story 5.6: Instant Alerts for Critical Events (Bonus)

As a **backend developer**,  
I want alertas instantâneos para eventos críticos,  
so that users are notified immediately of high-impact events.

**Acceptance Criteria:**
1. Celery task `process_document` (Epic 2) checa após classificação: se evento é tipo "Multa" OU valor >R$ 1M, marca como `critical=true`
2. Para eventos críticos: dispara task `send_instant_alert` que envia email imediatamente para users com alert_config frequency=instant
3. Subject line destaca urgência: "[URGENTE] Multa aplicada a Empresa X"
4. Template de instant alert diferente do digest (mais conciso, foco em 1 evento)
5. Rate limiting: máximo 1 instant alert/hora por user (prevenir spam)
6. Users podem configurar tipos de evento considerados críticos em `/settings/alerts`
7. Logs de instant alerts separados para monitoramento

---

## Next Steps

### Checklist Results Report

_(Este PRD será validado pelo Product Owner usando o checklist pm-checklist.md antes do handoff)_

**Itens a serem validados pelo PO:**
- Completude dos requisitos funcionais e não-funcionais
- Clareza das user stories e acceptance criteria
- Alinhamento das technical assumptions com constraints do projeto
- Sequenciamento lógico de epics e stories
- Viabilidade do escopo para timeline de 6 semanas
- Consistência entre PRD, Project Brief, e objetivos de negócio

---

### UX Expert Prompt

**Próximo Passo:** Transformar em UX Expert e criar especificação detalhada de front-end.

**Prompt sugerido:**  
"@ux-expert, por favor crie a especificação de UI/UX (front-end-spec.md) para o AtlasReg baseado neste PRD. Foque em wireframes das telas core (Dashboard, Event Detail, Watchlist Config), fluxos de usuário principais, e especificação detalhada do design system ness. Use o template front-end-spec-tmpl.yaml."

---

### Architect Prompt

**Próximo Passo:** Após UX Spec, transformar em Architect e criar arquitetura fullstack.

**Prompt sugerido:**  
"@architect, por favor crie a arquitetura técnica completa (fullstack-architecture.md) para o AtlasReg baseado no PRD e front-end spec. Defina: estrutura de diretórios do monorepo, APIs (endpoints detalhados), modelos de dados (schemas PostgreSQL), fluxos de processamento, decisões tecnológicas fundamentadas, e guias de implementação. Use o template fullstack-architecture-tmpl.yaml."

---

**Documento preparado por:** John (Product Manager - BMad Method)  
**Para workflow:** Greenfield Fullstack Development  
**Próximo agente:** UX Expert → Architect → PO (validation) → SM (stories) → Dev (implementation)


