# AtlasReg - Coding Standards & Best Practices

[← Voltar ao Architecture](../fullstack-architecture.md)

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

## Code Style Guidelines

### TypeScript/JavaScript

```typescript
// ✅ Good: Type-safe, clear naming
interface EventCardProps {
  event: Event;
  onClickDetails: (eventId: string) => void;
}

export function EventCard({ event, onClickDetails }: EventCardProps) {
  return (
    <Card>
      <CardTitle>{event.title}</CardTitle>
      <Button onClick={() => onClickDetails(event.id)}>
        Ver Detalhes
      </Button>
    </Card>
  );
}

// ❌ Bad: Any types, unclear naming
function EC(props: any) {
  return <div onClick={props.fn}>{props.data.t}</div>;
}
```

**Rules:**
- Usar TypeScript strict mode
- Prefer functional components + hooks
- Named exports para components
- Props interface sempre definida
- ESLint + Prettier enforced no CI

### Python

```python
# ✅ Good: Type hints, docstrings, clear structure
from typing import Optional
from pydantic import BaseModel

class EventResponse(BaseModel):
    id: str
    title: str
    event_type: str
    
async def get_event(event_id: str) -> Optional[EventResponse]:
    """
    Fetch event by ID from database.
    
    Args:
        event_id: UUID string of event
        
    Returns:
        EventResponse or None if not found
    """
    event = await db.query(Event).filter_by(id=event_id).first()
    if not event:
        return None
    return EventResponse.from_orm(event)

# ❌ Bad: No types, no docs
def get_ev(id):
    e = db.query(Event).filter_by(id=id).first()
    return e
```

**Rules:**
- Type hints obrigatórios em funções públicas
- Docstrings para módulos, classes, funções públicas
- Black formatter (line length 88)
- isort para imports
- pytest para tests

---

## Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Messages

```
type(scope): subject

body

footer
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**
```
feat(scraper): add ONS scraper with retry logic

Implements Airflow DAG for ONS scraping with exponential backoff retry.
Rate limiting set to 1 req/5s as per architecture specs.

Closes #123
```

### Pull Requests

- **Title:** Clear, concise, references story/issue
- **Description:** What changed, why, how to test
- **Checks:** CI must pass (linting, tests, build)
- **Reviews:** 1+ approval required
- **Squash:** Squash commits on merge to main

---

## Deployment Best Practices

### Environment Variables

```bash
# ✅ Good: Clear naming, sensible defaults
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR

# ❌ Bad: Cryptic, no structure
DB=postgres://...
R=redis://...
L=1
```

### Docker

- **Multi-stage builds:** Separate build e runtime images
- **Non-root user:** Run containers as non-root
- **Health checks:** Define HEALTHCHECK em Dockerfile
- **.dockerignore:** Excluir node_modules, .env, __pycache__

### Rollback

- **Tag images:** Semantic versioning (v1.0.0, v1.0.1)
- **Database migrations:** Sempre reversíveis (alembic downgrade)
- **Feature flags:** Use para features críticas (LaunchDarkly, env vars)

---

**Ver também:**
- [Tech Stack](./tech-stack.md) - Tecnologias utilizadas
- [API Design](./api-design.md) - Endpoints e contratos
- [Database Schema](./database-schema.md) - Estrutura de dados
- [Deployment](./deployment.md) - Deploy e infra


