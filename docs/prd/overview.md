# AtlasReg PRD - Overview

[← Voltar ao PRD completo](../prd.md)

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

**AtlasReg** resolve este problema através de plataforma de IA que automatiza o ciclo completo de coleta →processamento → análise → alerta. Utilizando scraping inteligente, modelos de NLP especializados (BERTimbau fine-tuned), e extração estruturada de entidades, o sistema transforma dados dispersos em inteligência acionável em tempo real.

---

## Requirements

### Functional Requirements

**FR1-FR13:** Ver [PRD completo](../prd.md#requirements)

### Non-Functional Requirements

**NFR1-NFR13:** Ver [PRD completo](../prd.md#requirements)

---

## UI/UX Design Goals

**Detalhes completos:** Ver [Front-End Spec](../front-end-spec.md)

### Overall UX Vision

Interface dark-first "central de comando" para inteligência de mercado, seguindo design system ness.

### Target Platforms

Web Responsive - Desktop-first (1920x1080), tablet (iPad landscape), mobile (visualização apenas).

---

## Technical Assumptions

### Repository Structure

**Monorepo** usando Turborepo para gerenciar frontend, backend, scrapers.

### Service Architecture

Microserviços leves com comunicação interna:
1. Scraper Service (Airflow)
2. Processor Service (Celery)
3. API Service (FastAPI)
4. Web Service (Next.js SSR)

### Testing Requirements

Pirâmide completa: Unit (70%+ coverage) + Integration + E2E (Playwright).

**Detalhes completos:** Ver [Architecture - Tech Stack](../architecture/tech-stack.md)

---

## Epic List

1. **Epic 1: Foundation & Data Ingestion Pipeline**
2. **Epic 2: AI Processing & Entity Extraction**
3. **Epic 3: API & Data Access Layer**
4. **Epic 4: Web Dashboard & User Experience**
5. **Epic 5: Watchlist & Alert System**

---

**Ver Epics detalhados:**
- [Epic 1 - Foundation](./epic-1-foundation.md)
- [Epic 2 - AI Processing](./epic-2-ai-processing.md)
- [Epic 3 - API](./epic-3-api.md)
- [Epic 4 - Frontend](./epic-4-frontend.md)
- [Epic 5 - Alerts](./epic-5-alerts.md)


