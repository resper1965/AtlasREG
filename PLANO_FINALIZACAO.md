# 🎯 Plano de Finalização - AtlasReg by ness.

**Método:** BMad Structured Completion  
**Objetivo:** Sistema 100% funcional end-to-end  
**Timeline:** 6-8 semanas (acelerado)

---

## 📋 FASE 1: VALIDAÇÃO E INTEGRAÇÃO SCRAPING (Semana 1-2)

### 🕷️ Epic 1.1: Validar Scrapers com URLs Reais

**Agente:** Developer + QA  
**Objetivo:** Testar e ajustar todos os 10 scrapers

**Tasks:**
1. [ ] Testar `aneel_noticias` scraper
   - Validar URL https://www.gov.br/aneel/pt-br/assuntos/noticias
   - Ajustar selectors se HTML mudou
   - Verificar rate limiting funciona
   - Testar filtros de keywords

2. [ ] Testar `aneel_despachos` scraper
   - Validar URLs de despachos
   - Implementar extração de PDFs
   - Testar salvamento no MinIO

3. [ ] Testar `ons_ocorrencias` scraper
   - Implementar Playwright (site usa JS)
   - Validar extração de dados tempo real
   - Testar parsing de datas

4. [ ] Testar `canal_energia` scraper
   - Implementar Playwright
   - Ajustar selectors para layout atual
   - Validar filtros funcionam

5. [ ] Testar `megawhat` scraper
6. [ ] Testar `epbr` scraper
7. [ ] Testar `mme` scraper
8. [ ] Testar `sigel` scraper
9. [ ] Testar `epe` scraper
10. [ ] Testar `aneel_pv` scraper

**Critério de Sucesso:**
- ✅ 10/10 scrapers retornam dados válidos
- ✅ Dados salvos em MinIO corretamente
- ✅ Metadata registrada no PostgreSQL
- ✅ Zero erros em produção

---

### 🤖 Epic 1.2: Integrar Pipeline de IA

**Agente:** Developer (IA/ML)  
**Objetivo:** Conectar scrapers → IA → eventos

**Tasks:**
1. [ ] Implementar Celery tasks
   ```python
   @celery.task
   def process_document(document_id):
       # Carregar documento
       # Classificar com BERTimbau
       # Extrair entidades com spaCy
       # Criar evento
       # Salvar embeddings
   ```

2. [ ] Integrar BERTimbau classifier
   - Download modelo: `neuralmind/bert-base-portuguese-cased`
   - Fine-tune para categorias do setor
   - Testar acurácia (>85%)

3. [ ] Integrar spaCy entity extractor
   - Download modelo: `pt_core_news_lg`
   - Adicionar padrões customizados (empresas, CNPJs)
   - Testar extração

4. [ ] Implementar FAISS vector search
   - Criar índice de embeddings
   - API endpoint para busca semântica
   - Testar queries

5. [ ] Pipeline completo end-to-end
   - Scraper coleta → MinIO
   - Celery task dispara
   - IA processa
   - Event criado
   - Frontend atualiza

**Critério de Sucesso:**
- ✅ Documentos classificados automaticamente (>85% acurácia)
- ✅ Entidades extraídas corretamente
- ✅ Eventos criados no banco
- ✅ Busca semântica funciona

---

### 🐳 Epic 1.3: Configurar Airflow Production

**Agente:** DevOps  
**Objetivo:** Airflow rodando com DAGs automáticos

**Tasks:**
1. [ ] Adicionar Airflow ao docker-compose.yml
   ```yaml
   airflow-webserver:
     image: apache/airflow:2.7.3
     environment:
       - AIRFLOW__CORE__EXECUTOR=CeleryExecutor
   ```

2. [ ] Configurar volumes e persistência
3. [ ] Carregar DAGs dinamicamente
4. [ ] Configurar alertas (email/Slack)
5. [ ] Testar schedule automático

**Critério de Sucesso:**
- ✅ Airflow UI acessível (localhost:8200)
- ✅ 10 DAGs detectados automaticamente
- ✅ Schedule funcionando (cron)
- ✅ Alertas enviados em falhas

---

## 📋 FASE 2: BACKEND FEATURES COMPLETAS (Semana 3-4)

### 🔧 Epic 2.1: Implementar API Routes Completas

**Agente:** Backend Developer  
**Objetivo:** Todas as routes funcionando com dados reais

**Tasks:**
1. [ ] GET /events/search
   ```python
   @router.get("/events/search")
   async def search_events(
       query: Optional[str] = None,
       event_type: Optional[EventType] = None,
       company: Optional[str] = None,
       date_from: Optional[date] = None,
       date_to: Optional[date] = None,
       skip: int = 0,
       limit: int = 20
   ):
       # Buscar no banco com filtros
       # Paginação
       # Retornar JSON
   ```

2. [ ] POST /watchlists
   ```python
   @router.post("/watchlists")
   async def create_watchlist(
       watchlist: WatchlistCreate,
       current_user: User = Depends(get_current_user)
   ):
       # Criar watchlist
       # Associar keywords/companies
       # Retornar watchlist_id
   ```

3. [ ] GET /events/feed
   ```python
   @router.get("/events/feed")
   async def get_feed(
       current_user: User = Depends(get_current_user)
   ):
       # Feed personalizado baseado em watchlists
       # Ordenar por relevância
       # Marcar lidos/não lidos
   ```

4. [ ] GET /companies/search
5. [ ] GET /companies/{id}/timeline
6. [ ] POST /alerts/configure
7. [ ] GET /documents/{id}
8. [ ] GET /analytics/dashboard

**Critério de Sucesso:**
- ✅ Todas as 30+ rotas implementadas
- ✅ Swagger docs atualizado
- ✅ Testes unitários (>80% coverage)
- ✅ Performance <200ms

---

### 🗄️ Epic 2.2: Database Migrations e Seeds

**Agente:** Backend Developer  
**Objetivo:** Banco estruturado e populado

**Tasks:**
1. [ ] Criar migrations Alembic
   ```bash
   alembic revision --autogenerate -m "create_all_tables"
   alembic upgrade head
   ```

2. [ ] Seed inicial
   - 50+ empresas transmissoras (da ABRATE)
   - 10 usuários teste
   - Roles e permissões

3. [ ] Índices otimizados
   - events.event_date
   - events.event_type
   - documents.source
   - documents.scraped_at

4. [ ] Views materializadas
   - dashboard_stats
   - top_companies
   - recent_events

**Critério de Sucesso:**
- ✅ Banco criado automaticamente
- ✅ Seed data carregado
- ✅ Queries <100ms
- ✅ Backup automático configurado

---

## 📋 FASE 3: FRONTEND FEATURES (Semana 5-6)

### 🎨 Epic 3.1: Conectar Frontend ao Backend

**Agente:** Frontend Developer  
**Objetivo:** UI consumindo API real

**Tasks:**
1. [ ] Configurar API client
   ```typescript
   // lib/api.ts
   export const api = {
     events: {
       search: (params) => fetch('/api/events/search', params),
       getById: (id) => fetch(`/api/events/${id}`)
     }
   }
   ```

2. [ ] Implementar auth flow
   - Login chama POST /auth/login
   - Token salvo em cookies
   - Middleware protege rotas
   - Logout limpa sessão

3. [ ] TanStack Query setup
   ```typescript
   const { data: events } = useQuery({
     queryKey: ['events', filters],
     queryFn: () => api.events.search(filters)
   })
   ```

4. [ ] Estado global (Zustand)
   - User state
   - Filters state
   - Watchlists state

**Critério de Sucesso:**
- ✅ Login funcional
- ✅ Dashboard mostra dados reais
- ✅ Loading states
- ✅ Error handling

---

### 🎯 Epic 3.2: Implementar Features UI

**Agente:** Frontend Developer + UX  
**Objetivo:** Todas as telas funcionais

**Tasks:**
1. [ ] Events Feed Page
   - Lista de eventos
   - Filtros avançados
   - Paginação infinita
   - Card de evento expandível

2. [ ] Events Search Page
   - Busca semântica
   - Filtros: tipo, empresa, data, valor
   - Resultados destacados
   - Export CSV/PDF

3. [ ] Watchlists Page
   - Criar/editar/deletar watchlists
   - Keywords management
   - Companies tracking
   - Alert settings

4. [ ] Company Profile Page
   - Dados cadastrais
   - Timeline de eventos
   - Gráfico RAP
   - Multas e decisões

5. [ ] Dashboard Analytics
   - Cards de métricas
   - Charts (Recharts)
   - Filtros por período
   - Export relatórios

6. [ ] Alerts Configuration
   - Email preferences
   - Notification types
   - Digest frequency
   - Test alert button

**Critério de Sucesso:**
- ✅ Todas as 6 páginas funcionais
- ✅ UX fluida (transitions, loading)
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade WCAG AA

---

## 📋 FASE 4: ALERTAS E NOTIFICAÇÕES (Semana 7)

### 📧 Epic 4.1: Sistema de Alertas

**Agente:** Backend Developer  
**Objetivo:** Notificações automáticas

**Tasks:**
1. [ ] Email templates (Jinja2)
   - Daily digest template
   - Alert template
   - Welcome email
   - Password reset

2. [ ] SMTP integration
   ```python
   from fastapi_mail import FastMail, MessageSchema
   
   async def send_alert(user, event):
       message = MessageSchema(
           subject=f"Alerta: {event.title}",
           recipients=[user.email],
           template_body={...}
       )
       await mail.send_message(message)
   ```

3. [ ] Celery tasks agendadas
   ```python
   @celery.task
   def send_daily_digest():
       for user in active_users:
           events = get_events_for_user(user)
           send_email(user, events)
   ```

4. [ ] In-app notifications
   - Table `notifications`
   - WebSocket real-time (opcional)
   - Notification bell UI

**Critério de Sucesso:**
- ✅ Emails enviados diariamente
- ✅ Alertas instantâneos para eventos críticos
- ✅ Taxa de entrega >95%
- ✅ Unsubscribe funcional

---

## 📋 FASE 5: DEPLOY E MONITORING (Semana 8)

### 🚀 Epic 5.1: Deploy Production

**Agente:** DevOps  
**Objetivo:** Sistema rodando em VPS

**Tasks:**
1. [ ] Docker Compose produção
   ```yaml
   # docker-compose.prod.yml
   services:
     api:
       build: ./docker/Dockerfile.api
       restart: always
     web:
       build: ./docker/Dockerfile.web
       restart: always
     traefik:
       image: traefik:v2.10
       # SSL automático
   ```

2. [ ] Configurar Traefik + SSL
   - Let's Encrypt automático
   - Reverse proxy
   - Health checks

3. [ ] Environment variables
   - Secrets no `.env.production`
   - DATABASE_URL (Neon)
   - SMTP credentials
   - JWT_SECRET

4. [ ] CI/CD pipeline
   - GitHub Actions
   - Build on push
   - Deploy automático

**Critério de Sucesso:**
- ✅ HTTPS funcionando
- ✅ Deploy automático
- ✅ Zero downtime
- ✅ Backups diários

---

### 📊 Epic 5.2: Monitoring e Observability

**Agente:** DevOps  
**Objetivo:** Monitoramento completo

**Tasks:**
1. [ ] Prometheus + Grafana
   ```yaml
   prometheus:
     image: prom/prometheus
   grafana:
     image: grafana/grafana
   ```

2. [ ] Dashboards
   - System metrics (CPU, RAM, disk)
   - Application metrics (requests/s, latency)
   - Scraping metrics (docs/day, errors)
   - Database metrics (queries, connections)

3. [ ] Alerting rules
   - CPU >80% → alert
   - Scraper failed 3x → alert
   - API latency >1s → alert
   - Database down → alert

4. [ ] Logs centralizados
   - Loki (opcional)
   - JSON structured logs
   - Query logs via Grafana

**Critério de Sucesso:**
- ✅ Dashboards visíveis
- ✅ Alertas funcionando
- ✅ Logs searchable
- ✅ Uptime >99.5%

---

## 📋 FASE 6: TESTES E DOCUMENTAÇÃO (Contínuo)

### ✅ Epic 6.1: Testing

**Agente:** QA + Developer  
**Objetivo:** Coverage >80%

**Tasks:**
1. [ ] Testes unitários backend
   - pytest para API
   - Mock database
   - Coverage report

2. [ ] Testes integração
   - Scraper → Database
   - API → Database
   - IA pipeline

3. [ ] Testes E2E frontend
   - Playwright/Cypress
   - User flows críticos
   - Visual regression

4. [ ] Performance tests
   - Load testing (k6)
   - API stress test
   - Database optimization

**Critério de Sucesso:**
- ✅ >80% coverage backend
- ✅ >70% coverage frontend
- ✅ E2E tests passando
- ✅ Performance benchmarks

---

### 📚 Epic 6.2: Documentação Final

**Agente:** Tech Writer  
**Objetivo:** Docs completas para handoff

**Tasks:**
1. [ ] API Documentation
   - Swagger/OpenAPI completo
   - Exemplos de uso
   - Postman collection

2. [ ] User Manual
   - Como usar a plataforma
   - Screenshots
   - Video walkthrough

3. [ ] Admin Guide
   - Configurar scrapers
   - Gerenciar usuários
   - Troubleshooting

4. [ ] Developer Guide
   - Setup local
   - Arquitetura explicada
   - Como contribuir

**Critério de Sucesso:**
- ✅ Docs atualizadas
- ✅ Videos gravados
- ✅ README completo
- ✅ Onboarding <30min

---

## 📈 TIMELINE E RECURSOS

### Semana 1-2: Scraping + IA
- **Agentes:** Dev Backend, Dev IA, DevOps
- **Entregas:** 10 scrapers validados, Pipeline IA, Airflow rodando

### Semana 3-4: Backend
- **Agentes:** Dev Backend, DBA
- **Entregas:** 30+ routes, Database completo

### Semana 5-6: Frontend
- **Agentes:** Dev Frontend, UX Designer
- **Entregas:** 6 páginas funcionais, UI polido

### Semana 7: Alertas
- **Agentes:** Dev Backend, Frontend
- **Entregas:** Email system, Notificações

### Semana 8: Deploy
- **Agentes:** DevOps, SRE
- **Entregas:** Produção, Monitoring

---

## 🎯 DEFINITION OF DONE (DoD)

**Sistema 100% Funcional = Todos os itens ✅:**

### Scraping
- [x] 10 fontes coletando dados diariamente
- [ ] Airflow schedulers rodando
- [ ] Dados salvos em MinIO
- [ ] Zero erros por 7 dias

### IA Pipeline
- [ ] Documentos classificados automaticamente
- [ ] Entidades extraídas
- [ ] Eventos criados
- [ ] Busca semântica funcional

### Backend
- [ ] 30+ routes implementadas
- [ ] Auth JWT funcional
- [ ] Database otimizado
- [ ] API latency <200ms

### Frontend
- [ ] 6 páginas funcionais
- [ ] Dados reais exibidos
- [ ] UX fluida
- [ ] Mobile responsivo

### Alertas
- [ ] Emails diários enviados
- [ ] Alertas instantâneos
- [ ] In-app notifications

### Deploy
- [ ] HTTPS em produção
- [ ] SSL configurado
- [ ] Monitoring ativo
- [ ] Backups automáticos

### Qualidade
- [ ] >80% test coverage
- [ ] Zero bugs críticos
- [ ] Documentação completa
- [ ] Handoff realizado

---

## 🚀 EXECUÇÃO

**Próximos Passos:**

1. **Agora:** Validar scrapers (Fase 1.1)
2. **Semana 1:** Pipeline IA (Fase 1.2)
3. **Semana 2:** Airflow + Backend routes (Fase 1.3 + 2.1)
4. **Semanas 3-4:** Backend completo (Fase 2)
5. **Semanas 5-6:** Frontend (Fase 3)
6. **Semana 7:** Alertas (Fase 4)
7. **Semana 8:** Deploy (Fase 5)

**Total:** 8 semanas estruturadas com BMad Method

---

**Status:** ✅ PLANO APROVADO PARA EXECUÇÃO

**Ver também:**
- `/IMPLEMENTACAO_FINAL.md` - Estado atual
- `/docs/prd.md` - 34 user stories
- `/docs/fullstack-architecture.md` - Arquitetura C4


