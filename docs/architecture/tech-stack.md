# AtlasReg - Technology Stack

[← Voltar ao Architecture](../fullstack-architecture.md)

---

## Frontend

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

---

## Backend

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

---

## AI/ML Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| NLP Model | BERTimbau (HuggingFace) | BERT fine-tuned para português brasileiro |
| Entity Extraction | spaCy 3.x + custom rules | Pipeline modular, performance, custom entity types |
| Semantic Search | Sentence-BERT (SBERT) | Embeddings multilingual, FAISS para indexação rápida |
| Vector Store | FAISS (Facebook AI) | Busca NN eficiente, não requer servidor separado |
| Training | HuggingFace Transformers | Ecosystem padrão para fine-tuning BERT |

---

## Data & Infrastructure

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

## Dependencies Summary

### Frontend Package.json (apps/web/)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@heroicons/react": "^2.0.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.52.0",
    "prettier": "^3.0.0",
    "jest": "^29.7.0",
    "@playwright/test": "^1.39.0"
  }
}
```

### Backend Requirements.txt (apps/api/)

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
boto3==1.29.3
redis==5.0.1
elasticsearch==8.11.0
```

### ML/Processing Requirements.txt (apps/scraper/)

```
apache-airflow==2.7.3
celery==5.3.4
scrapy==2.11.0
playwright==1.39.0
transformers==4.35.2
torch==2.1.0
spacy==3.7.2
sentence-transformers==2.2.2
faiss-cpu==1.7.4
pdfminer.six==20221105
pytesseract==0.3.10
```

---

**Ver também:**
- [Source Tree](./source-tree.md) - Estrutura de diretórios completa
- [API Design](./api-design.md) - Endpoints REST
- [Database Schema](./database-schema.md) - Modelos de dados
- [AI/ML Pipeline](./ai-ml-pipeline.md) - Pipeline de processamento


