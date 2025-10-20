# Epic 1: Foundation & Data Ingestion Pipeline

[← Voltar ao Overview](./overview.md) | [PRD Completo](../prd.md)

---

## Epic Goal

Estabelecer a fundação técnica do projeto AtlasReg (monorepo Turborepo, Docker, CI/CD, databases Neon PostgreSQL + MinIO) e implementar sistema de scraping automatizado usando Airflow que coleta documentos das fontes prioritárias (ANEEL, ONS, SIGEL, mídia especializada) com agendamento configurável, armazenando arquivos brutos em MinIO para processamento posterior. Ao final deste epic, o sistema já estará coletando dados automaticamente e terá health check básico.

---

## Stories

### Story 1.1: Project Setup & Monorepo Foundation

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

**Ver também:** [Architecture - Source Tree](../architecture/source-tree.md)

---

### Story 1.2: Docker Infrastructure Setup

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

**Ver também:** [Architecture - Deployment](../architecture/deployment.md)

---

### Story 1.3: CI/CD Pipeline with GitHub Actions

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

### Story 1.4: Database Schema & Migrations Foundation

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

**Ver também:** [Architecture - Database Schema](../architecture/database-schema.md)

---

### Story 1.5: MinIO Storage & Document Service

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

### Story 1.6: Airflow DAG for ANEEL News Scraping

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

**Ver também:** [Architecture - AI/ML Pipeline](../architecture/ai-ml-pipeline.md)

---

### Story 1.7: Basic API Health Check & Authentication

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

**Ver também:** [Architecture - API Design](../architecture/api-design.md)

---

### Story 1.8: Basic Next.js Frontend with Auth

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

**Ver também:** [Front-End Spec](../front-end-spec.md), [Architecture - Tech Stack](../architecture/tech-stack.md)

---

## Epic Completion Criteria

- ✅ Stack completa sobe com `docker-compose up`
- ✅ CI/CD pipeline verde (linting + tests passando)
- ✅ Database schema criado com seed data
- ✅ Scraper ANEEL coletando documentos automaticamente
- ✅ API health check respondendo
- ✅ Frontend login funcional conectado à API

**Próximo Epic:** [Epic 2 - AI Processing](./epic-2-ai-processing.md)


