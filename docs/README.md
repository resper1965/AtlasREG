# AtlasReg - Documentation Index

**Projeto:** AtlasReg - Plataforma de Inteligência de Mercado para Transmissão de Energia  
**Status:** Ready for Development ✅  
**Validation Score:** 95% (PO Approved)

---

## 📋 Complete Documents

### Strategic Documents
1. **[Project Brief](./project-brief.md)** - Visão geral, problemas, soluções, MVP scope
2. **[Product Requirements Document (PRD)](./prd.md)** - Requirements completos, 5 Epics, 30+ Stories
3. **[Front-End Specification](./front-end-spec.md)** - UI/UX design, components, wireframes
4. **[Fullstack Architecture](./fullstack-architecture.md)** - Arquitetura técnica completa
5. **[PO Validation Report](./po-validation-report.md)** - Relatório de aprovação (95% score)

---

## 📁 Sharded Documents (Para Desenvolvimento)

### PRD (Fragmentado por Epic)
- [Overview & Requirements](./prd/overview.md)
- [Epic 1: Foundation & Data Ingestion](./prd/epic-1-foundation.md)
- [Epic 2: AI Processing](./prd/epic-2-ai-processing.md) _(ver PRD completo)_
- [Epic 3: API & Data Access](./prd/epic-3-api.md) _(ver PRD completo)_
- [Epic 4: Web Dashboard](./prd/epic-4-frontend.md) _(ver PRD completo)_
- [Epic 5: Alerts System](./prd/epic-5-alerts.md) _(ver PRD completo)_

### Architecture (Fragmentado por Domínio Técnico)
- [Tech Stack](./architecture/tech-stack.md) - Frontend, Backend, AI/ML, Infra
- [Source Tree](./architecture/source-tree.md) _(ver Architecture completa)_
- [API Design](./architecture/api-design.md) _(ver Architecture completa)_
- [Database Schema](./architecture/database-schema.md) _(ver Architecture completa)_
- [AI/ML Pipeline](./architecture/ai-ml-pipeline.md) _(ver Architecture completa)_
- [Deployment](./architecture/deployment.md) _(ver Architecture completa)_
- [Coding Standards](./architecture/coding-standards.md) - Security, Performance, Testing, Code Style

---

## 🚀 Quick Start for Developers

### 1. Entender o Projeto
- Leia: [Project Brief](./project-brief.md) (10 min)
- Revise: [PRD Overview](./prd/overview.md) (5 min)

### 2. Setup Ambiente
- Siga: [Epic 1 - Story 1.1](./prd/epic-1-foundation.md#story-11-project-setup--monorepo-foundation)
- Referência: [Tech Stack](./architecture/tech-stack.md)

### 3. Desenvolvimento
- **Semana 1:** [Epic 1 - Foundation](./prd/epic-1-foundation.md)
- **Semana 2-3:** Epic 2 - AI Processing (ver [PRD completo](./prd.md))
- **Semana 4:** Epic 3 - API (ver [PRD completo](./prd.md))
- **Semana 5:** Epic 4 - Frontend (ver [PRD completo](./prd.md))
- **Semana 6:** Epic 5 - Alerts (ver [PRD completo](./prd.md))

### 4. Padrões & Guidelines
- [Coding Standards](./architecture/coding-standards.md)
- [API Design Patterns](./architecture/api-design.md)
- [Database Conventions](./architecture/database-schema.md)

---

## 📊 Project Timeline (6 Weeks)

| Week | Epic | Deliverables |
|------|------|--------------|
| 1 | Foundation | Monorepo, Docker, CI/CD, DB, MinIO, Scraper ANEEL, Auth |
| 2 | Foundation + AI | Scrapers adicionais, PDF processing, Classification |
| 3-4 | AI Processing | Entity extraction, Celery, FAISS, Elasticsearch |
| 4 | API Layer | Event search, Watchlists, User management |
| 5 | Frontend | Dashboard, Search UI, Watchlist management |
| 6 | Alerts + Polish | Email system, Daily digest, Bug fixes, Deploy |

---

## 🎯 Success Criteria (MVP)

- ✅ Coletar automaticamente 100+ documentos/dia de 4+ fontes
- ✅ Processar documentos com accuracy ≥85% (classificação)
- ✅ F1-score ≥80% na extração de entidades
- ✅ Dashboard funcional com busca e filtros
- ✅ Sistema de alertas enviando emails diários
- ✅ Deploy em VPS com 5-10 usuários piloto
- ✅ Economizar ≥2h/semana para usuários

---

## 📞 Contacts & Resources

**PM:** John  
**Architect:** Winston  
**UX Expert:** Sally  
**Product Owner:** Sarah  

**Repository:** (adicionar URL quando criado)  
**CI/CD:** GitHub Actions  
**Database:** Neon PostgreSQL (online)  
**Deployment:** VPS + Docker + Traefik

---

**Last Updated:** 17 de Outubro de 2025  
**BMad Method Workflow:** Greenfield Fullstack Development  
**Status:** ✅ **APPROVED FOR DEVELOPMENT**


