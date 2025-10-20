# Changelog - AtlasReg by ness.

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)

Todas as mudanças notáveis no projeto AtlasReg serão documentadas neste arquivo.

---

## [1.2.0] - 2025-10-17

### Adicionado

#### Branding ness. Completo
- ✅ **BRANDING.md criado** - Guia completo de uso do branding ness.
- ✅ Wordmark ness. especificado em todos os documentos
- ✅ Regra de ouro: Ponto SEMPRE em #00ADE8
- ✅ Componente React `<NessWordmark>` especificado
- ✅ Exemplos de uso em Topbar, Footer, Login page
- ✅ Checklist de branding para validação

#### Aplicação nos Documentos
- ✅ README.md atualizado com branding ness.
- ✅ Front-End Spec com diretrizes completas de wordmark
- ✅ Project Brief com "Powered by ness."
- ✅ PRD com "Powered by ness."
- ✅ Architecture com "Powered by ness."
- ✅ STATUS.md com branding

#### Design System ness. Consolidado
- ✅ Paleta de cinzas frios: #0B0C0E, #111317, #151820, #1B2030
- ✅ Texto: #EEF1F6 (primário), #A0A8B8 (secundário), #6B7280 (muted)
- ✅ Accent: #00ADE8 (usado no ponto do ness.)
- ✅ Heroicons outline stroke-1.5 monocromáticos
- ✅ Transições: 120-240ms cubic-bezier(0.2, 0.8, 0.2, 1)

---

## [1.1.0] - 2025-10-17

### Atualizado

#### Design System - Color Palette OKLCH
- ✅ **Front-End Spec atualizado** com paleta de cores OKLCH moderna
- ✅ Substitui valores hexadecimais por OKLCH para melhor perceptual uniformity
- ✅ Adiciona variáveis CSS completas para modo light e dark
- ✅ Inclui tokens para sidebar (navegação lateral)
- ✅ Define cores para badges de eventos (Multa, Decisão, Transação, Incidente)

#### Implementação Tailwind CSS
- ✅ Adiciona `tailwind.config.ts` completo com tema customizado
- ✅ Inclui `globals.css` com variáveis OKLCH
- ✅ Configuração dark mode com classe `.dark`
- ✅ Border radius customizado (0.65rem)
- ✅ Font family Montserrat configurada

#### Benefícios OKLCH
- 🎨 **Perceptual uniformity:** Cores com mesma luminosidade aparecem igualmente brilhantes
- 🌈 **Gamut ampliado:** Acesso a cores mais vibrantes que sRGB
- ♿ **Acessibilidade:** Melhor controle de contraste para WCAG AA/AAA
- 🔄 **Interpolação suave:** Transições de cor mais naturais

---

## [1.0.0] - 2025-10-17 - MVP Specification Complete

### Criado

#### Documentação Estratégica (40,000+ palavras)

**Documentos Principais:**
1. ✅ **Project Brief** (8,500 palavras)
   - Executive Summary
   - Problem Statement e Solução Proposta
   - Target Users (2 personas)
   - MVP Scope e Post-MVP Vision
   - Technical Considerations
   - Constraints, Risks, Next Steps

2. ✅ **Product Requirements Document - PRD** (14,000 palavras)
   - Goals & Background Context
   - 13 Functional Requirements (FR1-FR13)
   - 13 Non-Functional Requirements (NFR1-NFR13)
   - UI/UX Design Goals
   - Technical Assumptions completas
   - **5 Epics com 30+ User Stories** detalhadas

3. ✅ **Front-End Specification** (5,500 palavras)
   - UX Goals & Principles (2 personas, usability goals, design principles)
   - Information Architecture (sitemap, navigation)
   - User Flows (3 fluxos principais com diagramas)
   - Design System completo (cores, tipografia, ícones, spacing)
   - Component Specifications (EventCard, FilterPanel, Modal)
   - Wireframes de telas principais
   - Interaction Patterns (loading, toasts, empty states, errors)
   - Acessibilidade WCAG AA
   - Responsive design (breakpoints, adaptações)
   - Animation guidelines

4. ✅ **Fullstack Architecture** (12,000 palavras)
   - System Context Diagram (C4)
   - Container Architecture
   - Technology Stack completo (Frontend, Backend, AI/ML, Infra)
   - Source Tree estrutura detalhada
   - API Design (30+ endpoints REST com exemplos)
   - Database Schema (ER Diagram, 14 tabelas, indexes)
   - AI/ML Pipeline (BERT, spaCy, SBERT+FAISS)
   - Docker Compose completo (11 services)
   - Security Considerations
   - Performance Optimization
   - Testing Strategy
   - Monitoring & Observability
   - Deployment Plan (6 semanas)

5. ✅ **PO Validation Report**
   - Score: 95% de prontidão
   - 0 Critical Blocking Issues
   - 4 Non-blocking Observations
   - Risk Level: LOW
   - **Status: APPROVED FOR DEVELOPMENT**

#### Documentos Fragmentados (Para Desenvolvimento)

**PRD Sharded:**
- `docs/prd/overview.md` - Goals, Requirements summary, Epic list
- `docs/prd/epic-1-foundation.md` - 8 Stories detalhadas
- _(Outros epics referenciam PRD completo)_

**Architecture Sharded:**
- `docs/architecture/tech-stack.md` - Frontend, Backend, AI/ML, Infra
- `docs/architecture/coding-standards.md` - Security, Performance, Testing, Git workflow
- _(Outras seções referenciam Architecture completo)_

**Index:**
- `docs/README.md` - Índice geral com quick start guide

#### Epics & Stories

**Epic 1: Foundation & Data Ingestion Pipeline (8 stories)**
- 1.1: Monorepo Turborepo setup
- 1.2: Docker infrastructure (Compose, Neon, MinIO, Redis, Airflow)
- 1.3: CI/CD GitHub Actions (linting, tests, build)
- 1.4: Database schema + migrations (Alembic)
- 1.5: MinIO storage service
- 1.6: Airflow DAG ANEEL scraper
- 1.7: FastAPI + JWT authentication
- 1.8: Next.js + Login page

**Epic 2: AI Processing & Entity Extraction (6 stories)**
- 2.1: PDF to text conversion + OCR fallback
- 2.2: BERTimbau event classification (accuracy ≥85%)
- 2.3: spaCy entity extraction (F1-score ≥80%)
- 2.4: Celery processing workers
- 2.5: SBERT + FAISS semantic search
- 2.6: Elasticsearch full-text search

**Epic 3: API & Data Access Layer (6 stories)**
- 3.1: User management CRUD + RBAC
- 3.2: Event search API (semantic + full-text)
- 3.3: Event detail + document download
- 3.4: Company & asset endpoints
- 3.5: Watchlist CRUD
- 3.6: Watchlist events feed

**Epic 4: Web Dashboard & User Experience (8 stories)**
- 4.1: Design system ness + shadcn/ui
- 4.2: Dashboard layout + navigation
- 4.3: Events feed (infinite scroll)
- 4.4: Filter panel + advanced search
- 4.5: Event detail modal
- 4.6: Watchlist management page
- 4.7: Watchlist events feed
- 4.8: User profile & settings

**Epic 5: Watchlist & Alert System (6 stories)**
- 5.1: Alert configuration API
- 5.2: Email templates HTML (ness branding)
- 5.3: Email sending service (SMTP)
- 5.4: Daily digest Celery task
- 5.5: Alert preferences UI
- 5.6: Instant alerts (bonus)

**Total: 34 Stories**

#### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript 5+
- Tailwind CSS 3
- shadcn/ui
- Zustand + TanStack Query
- React Hook Form + Zod
- Heroicons v2
- Jest + Playwright

**Backend:**
- FastAPI (Python 3.11+)
- SQLAlchemy 2.0 + Alembic
- JWT + bcrypt
- Pydantic V2
- Celery + Redis
- Scrapy + Playwright
- Apache Airflow

**AI/ML:**
- BERTimbau (HuggingFace)
- spaCy 3.x
- Sentence-BERT (SBERT)
- FAISS
- PyTorch

**Infrastructure:**
- Neon PostgreSQL 15+
- MinIO (S3-compatible)
- Elasticsearch 8.x
- Redis 7
- Docker + Docker Compose
- Traefik (reverse proxy)
- Portainer
- GitHub Actions

#### Deployment Plan

**Timeline:** 6 semanas para MVP
- Week 1: Foundation (Epic 1)
- Week 2: Foundation + AI start
- Week 3-4: AI Processing (Epic 2)
- Week 4: API Layer (Epic 3)
- Week 5: Frontend (Epic 4)
- Week 6: Alerts + Polish (Epic 5)

**Target:** VPS deployment com 5-10 usuários piloto

#### Success Criteria

- ✅ Coletar 100+ documentos/dia automaticamente
- ✅ Accuracy ≥85% (classificação eventos)
- ✅ F1-score ≥80% (extração entidades)
- ✅ Dashboard funcional responsivo
- ✅ Alertas email diários automáticos
- ✅ Economizar ≥2h/semana para usuários

---

## [Pre-release] - Antes de 2025-10-17

### Contexto
Projeto iniciou com proposta do usuário para portal de monitoramento de notícias do setor de energia elétrica no Brasil, transformado em **AtlasReg** - plataforma de inteligência de mercado com IA.

### Metodologia
Desenvolvimento seguindo **BMad Method - Greenfield Fullstack Workflow**:
1. Analyst → Project Brief
2. PM → PRD
3. UX Expert → Front-End Spec
4. Architect → Fullstack Architecture
5. PO → Validation & Sharding
6. _(Próximo: SM → Stories, Dev → Implementation)_

---

## Links Úteis

- **Documentation:** `/docs/README.md`
- **Quick Start:** `/docs/prd/epic-1-foundation.md`
- **Architecture:** `/docs/fullstack-architecture.md`
- **Design System:** `/docs/front-end-spec.md`

---

**Maintained by:** BMad Method Team (Analyst, PM, UX Expert, Architect, PO)  
**Project Status:** ✅ Ready for Development  
**Next Milestone:** Week 1 - Foundation Implementation


