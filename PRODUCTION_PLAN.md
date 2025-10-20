# 🚀 AtlasReg - Plano de Produção

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)  
**Preparado por:** BMad Master  
**Data:** 17 de Outubro de 2025  
**Timeline:** 6 semanas para MVP + 2 semanas para Deploy Produção

---

## 📊 DECISÃO ESTRATÉGICA

### Novo Frontend Starter

**Substituindo:** Kiranism/next-shadcn-dashboard-starter  
**Por:** [arhamkhnz/next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

**Razão:**
- ✅ **Autenticação já implementada** (economia de 1-2 semanas)
- ✅ Múltiplos dashboards pré-construídos
- ✅ RBAC planejado (alinha com NFR de roles Admin/Analyst/Viewer)
- ✅ Theme presets (facilita customização ness.)
- ✅ Colocation architecture (melhor organização)

**Aproveitamento:**
- ✅ Auth flows (login, signup) prontos
- ✅ User management básico
- ✅ Protected routes
- ✅ Session management

---

## 🎯 FASE 1: Setup & Foundation (Semana 1 - Epic 1)

### Objetivos
- Instalar novo starter
- Aplicar branding ness.
- Configurar infraestrutura
- Integrar auth com backend FastAPI

### Tasks

#### 1.1 Frontend Setup (2 dias)

```bash
# Substituir frontend atual
cd /home/resper/nSaulo
rm -rf apps/web
git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git apps/web
cd apps/web && rm -rf .git

# Instalar
npm install

# Customizar package.json
# - name: "atlasreg-web"
# - author: "ness."
# - description: "AtlasReg by ness."
```

**Deliverables:**
- ✅ Frontend rodando em http://localhost:3000
- ✅ Auth pages funcionando
- ✅ Dashboard layout pronto

#### 1.2 Aplicar Branding ness. (1 dia)

**Customizações:**

1. **Cores OKLCH (globals.css):**
   ```css
   .dark {
     --background: oklch(0.141 0.005 285.823);  /* #0B0C0E */
     --card: oklch(0.21 0.006 285.885);          /* #111317 */
     --primary: oklch(0.546 0.245 262.881);      /* Purple */
     /* ... */
   }
   
   --ness-accent: #00ADE8;  /* PONTO ness. */
   ```

2. **Montserrat Font (layout.tsx):**
   ```tsx
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600" />
   ```

3. **Componente NessWordmark:**
   ```tsx
   // src/components/ness-wordmark.tsx
   export function NessWordmark({ size }) {
     return <span>ness<span className="text-[#00ADE8]">.</span></span>
   }
   ```

4. **Atualizar Layouts:**
   - Header: Logo ness. + AtlasReg
   - Sidebar: Branding no footer
   - Login: Logo grande ness.

**Deliverables:**
- ✅ Design system ness. aplicado
- ✅ NessWordmark component
- ✅ Metadata atualizada (pt-BR, ness. author)

#### 1.3 Backend FastAPI + Auth (2 dias)

**Estrutura:**
```python
apps/api/
├── app/
│   ├── main.py
│   ├── auth/
│   │   ├── jwt.py         # JWT generation/validation
│   │   ├── password.py    # Bcrypt hashing
│   │   └── routes.py      # POST /auth/login, /register
│   ├── routers/
│   │   └── users.py       # GET /users/me
│   ├── models/
│   │   └── user.py        # SQLAlchemy User model
│   └── database.py        # Neon PostgreSQL connection
```

**Endpoints Mínimos:**
- `POST /auth/register` - Criar usuário
- `POST /auth/login` - Login retorna JWT
- `GET /users/me` - User autenticado
- `GET /health` - Health check

**Deliverables:**
- ✅ FastAPI rodando em http://localhost:8100
- ✅ Auth JWT funcional
- ✅ OpenAPI docs em /docs
- ✅ CORS configurado para frontend

#### 1.4 Integrar Auth Frontend ↔ Backend (1 dia)

**Adaptar auth do starter para chamar FastAPI:**

```typescript
// src/lib/api-client.ts
export async function login(email: string, password: string) {
  const response = await fetch('http://localhost:8100/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  // Salvar JWT em localStorage ou cookie
  localStorage.setItem('token', data.access_token);
  return data.user;
}
```

**Deliverables:**
- ✅ Login page chama backend FastAPI
- ✅ JWT armazenado no frontend
- ✅ Protected routes validam token
- ✅ User info carregado de /users/me

#### 1.5 Database + Docker (1 dia)

**Usar infraestrutura já criada:**
- ✅ Redis (porta 6381)
- ✅ MinIO (portas 19000/19001)
- ✅ Elasticsearch (porta 19200)

**Adicionar:**
- PostgreSQL schema (Alembic migrations)
- Seed data (5 empresas, 20 eventos mock)

**Deliverables:**
- ✅ Database Neon configurado
- ✅ Migrations rodando
- ✅ Seed data populado
- ✅ Docker stack completo

---

## 🤖 FASE 2: AI Pipeline & Scraping (Semana 2-4 - Epic 2)

### Objetivos
- Implementar scraping automatizado
- Pipeline de IA (classificação + extração)
- Indexação (FAISS + Elasticsearch)

### Tasks (Conforme PRD Epic 2)

#### 2.1 Scrapers Airflow (Semana 2)

**DAGs para:**
- ANEEL (notícias, despachos, PVs)
- ONS (ocorrências)
- SIGEL (dados cadastrais)
- Canal Energia, MegaWhat, EPBR

**Deliverables:**
- ✅ 100+ documentos/dia coletados
- ✅ Armazenados no MinIO
- ✅ Metadata no PostgreSQL

#### 2.2 Pipeline de IA (Semana 3-4)

**Implementar:**
- PDF to text conversion (PDFMiner + OCR)
- BERTimbau classification (accuracy ≥85%)
- spaCy entity extraction (F1-score ≥80%)
- Celery workers processando async
- FAISS semantic indexing
- Elasticsearch full-text indexing

**Deliverables:**
- ✅ Eventos processados e classificados
- ✅ Entidades extraídas (empresas, CNPJs, valores)
- ✅ Busca funcionando (semantic + full-text)

---

## 📊 FASE 3: Features Frontend (Semana 5 - Epic 3-4)

### Objetivos
- Dashboard de eventos funcionando
- Busca avançada
- Gestão de watchlists
- Integração completa com API

### Tasks

#### 3.1 Adaptar Dashboard Padrão → Events Feed (Story 4.3)

**Substituir:**
- Overview cards → Event statistics
- Products table → Events table (TanStack já pronto)
- CRM dashboard → Não usado (deletar)

**Criar:**
```tsx
// src/features/events/
├── components/
│   ├── event-card.tsx        # Card de evento
│   ├── event-list.tsx        # Lista com pagination
│   ├── event-detail.tsx      # Modal de detalhes
│   └── event-filters.tsx     # Filtros laterais
├── types/
│   └── index.ts              # Event, EventType, etc.
└── actions/
    └── events.ts             # API calls
```

**Deliverables:**
- ✅ Feed de eventos com cards
- ✅ TanStack Table com sort/filter
- ✅ Pagination funcionando
- ✅ Modal de detalhes

#### 3.2 Busca Avançada (Story 4.4)

**Usar:**
- Sidebar navigation → Add "Busca Avançada"
- Form components já prontos
- TanStack Table para resultados

**Criar:**
```tsx
// src/app/dashboard/search/page.tsx
export default function SearchPage() {
  return (
    <SearchForm>        {/* Filters */}
    <EventsList />      {/* Results */}
  )
}
```

**Deliverables:**
- ✅ Página de busca com filtros
- ✅ Integration com /events/search API
- ✅ Results com highlighting

#### 3.3 Watchlists (Story 4.6-4.7)

**Aproveitar:**
- User management structure
- Forms do starter

**Criar:**
```tsx
// src/features/watchlists/
├── components/
│   ├── watchlist-card.tsx
│   ├── watchlist-form.tsx
│   └── watchlist-events.tsx
```

**Deliverables:**
- ✅ Página de watchlists
- ✅ CRUD funcionando
- ✅ Events feed por watchlist

#### 3.4 Settings & Alerts (Story 4.8, Epic 5)

**Aproveitar:**
- Profile page do starter
- Forms components

**Expandir:**
- Tab "Alertas" em settings
- Email preferences
- Watchlist alerts config

**Deliverables:**
- ✅ Settings page completa
- ✅ Alert preferences UI
- ✅ Integration com /alerts API

---

## 📧 FASE 4: Alerts & Produção (Semana 6-8)

### Semana 6: Sistema de Alertas (Epic 5)

#### Tasks

**6.1 Email Templates (Story 5.2)**
```python
# apps/api/templates/
├── daily_digest.html   # HTML com branding ness.
└── instant_alert.html  # Alertas urgentes
```

**6.2 Email Service (Story 5.3)**
```python
# apps/api/services/email.py
async def send_email(to, subject, html):
    # SMTP via SendGrid ou AWS SES
```

**6.3 Celery Tasks (Story 5.4)**
```python
# apps/scraper/tasks.py
@celery.task
def send_daily_digests():
    # Busca watchlists com frequency=daily
    # Gera emails, envia
```

**Deliverables:**
- ✅ Emails HTML branded ness.
- ✅ Daily digest funcionando
- ✅ Instant alerts para eventos críticos

---

### Semana 7-8: Deploy Produção

#### 7.1 Preparar para Produção (3 dias)

**Frontend:**
```bash
# Build otimizado
npm run build

# Variáveis de produção
NEXT_PUBLIC_API_URL=https://api.atlasreg.com
```

**Backend:**
```python
# Remover debug modes
DEBUG=False
ENVIRONMENT=production

# Configurar secrets
# - JWT secret strong
# - Database credentials
# - SMTP credentials
```

**Docker:**
```yaml
# docker-compose.prod.yml
# - Usar multi-stage builds
# - Health checks
# - Resource limits
# - Restart policies
```

**Deliverables:**
- ✅ Build de produção sem erros
- ✅ Environment vars configuradas
- ✅ Secrets management (não .env comitado)

#### 7.2 Deploy VPS (2 dias)

**Infraestrutura:**
- VPS (DigitalOcean, Hetzner, ou AWS)
- Docker + Docker Compose
- Traefik (SSL automático Let's Encrypt)
- Portainer (management UI)

**Passos:**
```bash
# No VPS
ssh user@vps-ip

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Instalar Portainer
docker volume create portainer_data
docker run -d -p 9000:9000 --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data portainer/portainer-ce

# Clonar repositório
git clone <repo-url> /opt/atlasreg
cd /opt/atlasreg

# Configurar .env produção
cp .env.example .env
# Editar com credenciais reais

# Subir stack
docker-compose -f docker-compose.prod.yml up -d

# Configurar Traefik (SSL)
# - Domínio: atlasreg.com
# - Subdomínios: api.atlasreg.com
# - SSL via Let's Encrypt
```

**Deliverables:**
- ✅ VPS configurado
- ✅ Docker rodando
- ✅ SSL/HTTPS funcionando
- ✅ Domínio apontando

#### 7.3 CI/CD (1 dia)

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Build images
      - Push to registry
      - SSH to VPS
      - Pull images
      - Restart services
```

**Deliverables:**
- ✅ Auto-deploy em push to main
- ✅ Tests passando antes de deploy
- ✅ Rollback automático se falhar

#### 7.4 Monitoring & Backup (1 dia)

**Monitoring:**
- Celery Flower (worker monitoring)
- Airflow UI (DAG status)
- Logs centralizados (Docker logs)
- Health checks (Portainer)

**Backup:**
- PostgreSQL Neon (automated backups)
- MinIO replication
- Code repository (GitHub)

**Deliverables:**
- ✅ Monitoring funcionando
- ✅ Backups configurados
- ✅ Alertas de downtime

#### 7.5 User Pilot & Ajustes (2 dias)

**Pilot:**
- 5-10 usuários beta testers
- 1 semana de uso
- Feedback collection

**Ajustes:**
- Bug fixes
- UX improvements
- Performance tuning

**Deliverables:**
- ✅ 5-10 usuários ativos
- ✅ Feedback coletado
- ✅ Bugs críticos corrigidos

---

## 🎨 BRANDING ness. - Aplicação Detalhada

### Frontend Customizations

#### 1. Cores OKLCH (src/app/globals.css)

```css
/* Substituir cores padrão por ness. */
.dark {
  --background: oklch(0.141 0.005 285.823);  /* #0B0C0E - ness. dark */
  --foreground: oklch(0.985 0 0);             /* #EEF1F6 */
  --card: oklch(0.21 0.006 285.885);          /* #111317 - surface */
  --primary: oklch(0.546 0.245 262.881);      /* Purple vibrante */
  --sidebar: oklch(0.21 0.006 285.885);       /* #111317 */
  
  /* Custom ness. vars */
  --ness-accent: #00ADE8;      /* PONTO wordmark */
  --ness-surface-2: #151820;
  --ness-surface-3: #1B2030;
}
```

#### 2. Logo/Wordmark (src/components/ness-wordmark.tsx)

```tsx
interface NessWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function NessWordmark({ size = 'md' }: NessWordmarkProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-5xl'
  };
  
  return (
    <span className={`font-medium ${sizes[size]}`}>
      ness<span className="text-[#00ADE8]">.</span>
    </span>
  );
}

export function NessWithProduct({ product, size = 'lg' }) {
  return (
    <div className="flex items-center gap-2">
      <NessWordmark size={size} />
      <span className="text-muted-foreground">|</span>
      <span className="text-foreground">{product}</span>
    </div>
  );
}
```

#### 3. Layout Principal

**Header (src/components/layout/header.tsx ou similar):**
```tsx
import { NessWithProduct } from '@/components/ness-wordmark'

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <NessWithProduct product="AtlasReg" size="lg" />
        {/* Search bar, user menu */}
      </div>
    </header>
  )
}
```

**Sidebar Footer:**
```tsx
<div className="border-t p-4">
  <p className="text-xs text-muted-foreground text-center">
    Powered by <NessWordmark size="sm" />
  </p>
</div>
```

**Login Page:**
```tsx
<div className="flex flex-col items-center gap-4">
  <NessWordmark size="xl" />
  <p className="text-muted-foreground">AtlasReg Platform</p>
  {/* Form */}
</div>
```

#### 4. Metadata (src/app/layout.tsx)

```tsx
export const metadata: Metadata = {
  title: 'AtlasReg by ness. | Inteligência de Mercado',
  description: 'Plataforma de IA para monitoramento do setor de transmissão de energia. Powered by ness.',
  keywords: ['energia', 'transmissão', 'ANEEL', 'ONS', 'ness'],
  authors: [{ name: 'ness.', url: 'https://ness.com.br' }],
  creator: 'ness.',
  openGraph: {
    title: 'AtlasReg by ness.',
    description: 'Inteligência de Mercado para Energia',
    locale: 'pt_BR'
  }
}
```

#### 5. Heroicons (Substituir @tabler/icons)

```bash
# Remover Tabler
npm uninstall @tabler/icons-react

# Instalar Heroicons
npm install @heroicons/react

# Update imports
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
```

---

## 🔐 AUTENTICAÇÃO - Adaptação do Starter

### O Que o Starter Tem (Aproveitar)

**Auth Screens:**
- ✅ `/auth/sign-in` - Login page
- ✅ `/auth/sign-up` - Registro
- ✅ `/auth/forgot-password` - Recuperação senha
- ✅ `/auth/verify-email` - Verificação email

**Auth Logic:**
- ✅ Protected routes middleware
- ✅ Session management
- ✅ User context provider

### O Que Adaptar

**Trocar:**
- ❌ Auth provider do starter (se tiver algum específico)
- ➡️ Custom JWT auth chamando FastAPI

**Manter:**
- ✅ UI dos forms (já prontos)
- ✅ Validation com Zod
- ✅ Error handling
- ✅ Loading states

### Implementação (src/lib/auth.ts)

```typescript
// API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Login
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

// Register
export async function register(email: string, password: string, name: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
}

// Get current user
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user');
  }
  
  return response.json();
}

// Token management
export function saveToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function removeToken() {
  localStorage.removeItem('auth_token');
}
```

### Protected Routes (middleware.ts ou HOC)

```typescript
// src/middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## 📦 DOCKER PRODUÇÃO

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  # Frontend (Next.js)
  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web.prod
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.atlasreg.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`atlasreg.com`)"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.tls.certresolver=letsencrypt"

  # Backend API
  api:
    build:
      context: .
      dockerfile: docker/Dockerfile.api.prod
    restart: always
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=${DATABASE_URL}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.atlasreg.com`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"

  # Airflow, Celery, etc (mesma estrutura)
  # ...

  # Traefik (Reverse Proxy + SSL)
  traefik:
    image: traefik:v2.10
    restart: always
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@atlasreg.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_certs:/letsencrypt

volumes:
  traefik_certs:
  # ... outros volumes
```

#### 7.2 Deploy Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploy AtlasReg to Production"

# Pull latest
git pull origin main

# Build images
docker-compose -f docker-compose.prod.yml build

# Backup database
echo "Backing up database..."
# (Neon já faz automated backups)

# Stop old containers
docker-compose -f docker-compose.prod.yml down

# Start new
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker exec atlasreg-api alembic upgrade head

# Health check
sleep 10
curl -f https://api.atlasreg.com/health || exit 1

echo "✅ Deploy complete!"
```

---

## 🎯 TIMELINE CONSOLIDADO

### Semana 1: Foundation ✅
- [x] Documentação completa (BMad workflow)
- [x] Docker infrastructure
- [ ] **Instalar novo starter** (arhamkhnz)
- [ ] **Aplicar branding ness.**
- [ ] **Backend FastAPI + Auth JWT**
- [ ] **Integrar auth frontend ↔ backend**

### Semana 2: Scraping
- [ ] Airflow DAGs (ANEEL, ONS, SIGEL)
- [ ] Scrapy spiders
- [ ] MinIO storage integration
- [ ] 100+ docs/dia coletados

### Semana 3-4: AI Pipeline
- [ ] PDF processing
- [ ] BERTimbau classification
- [ ] spaCy entity extraction
- [ ] FAISS + Elasticsearch indexing
- [ ] Celery workers

### Semana 5: Frontend Features
- [ ] Events feed (adaptar dashboard)
- [ ] Busca avançada
- [ ] Watchlists CRUD
- [ ] Settings & alerts UI

### Semana 6: Alerts System
- [ ] Email templates ness.
- [ ] SMTP service
- [ ] Daily digest Celery task
- [ ] Instant alerts

### Semana 7-8: Produção
- [ ] Build otimizado
- [ ] Deploy VPS
- [ ] Traefik SSL
- [ ] CI/CD
- [ ] Monitoring
- [ ] User pilot (5-10 users)

---

## 📋 CHECKLIST PRÉ-PRODUÇÃO

### Code Quality
- [ ] ESLint passing (0 errors)
- [ ] Prettier formatted
- [ ] TypeScript strict (0 type errors)
- [ ] Python Black + isort
- [ ] Tests coverage ≥70% (frontend), ≥80% (backend)

### Security
- [ ] JWT secret strong (32+ chars random)
- [ ] Passwords hashed (bcrypt cost 12)
- [ ] CORS whitelist (apenas domínio prod)
- [ ] Rate limiting (100 req/min)
- [ ] SQL injection prevented (ORM)
- [ ] XSS prevented (React escape)
- [ ] HTTPS obrigatório
- [ ] .env não comitado
- [ ] Secrets em env vars

### Performance
- [ ] Frontend build <3s load
- [ ] API queries <2s (p95)
- [ ] Database indexes otimizados
- [ ] Redis caching ativo
- [ ] Images otimizadas (next/image)
- [ ] Code splitting (Next.js automatic)

### Branding ness.
- [ ] Logo ness. no header (ponto #00ADE8)
- [ ] Footer com "Powered by ness."
- [ ] Cores ness. aplicadas (#0B0C0E, #111317, etc)
- [ ] Montserrat font carregada
- [ ] Heroicons stroke-1.5
- [ ] Email templates com branding ness.

### Infrastructure
- [ ] Docker Compose production-ready
- [ ] Traefik SSL configurado
- [ ] Portainer management
- [ ] Health checks em todos os serviços
- [ ] Backups configurados
- [ ] Monitoring ativo
- [ ] Logs centralizados

### Documentation
- [ ] README atualizado
- [ ] API docs (OpenAPI)
- [ ] User guide básico
- [ ] Developer onboarding
- [ ] Runbooks (troubleshooting)

---

## 🚀 COMANDOS RÁPIDOS

### Setup Novo Frontend

```bash
cd /home/resper/nSaulo

# Backup do atual (se quiser)
mv apps/web apps/web.backup

# Clonar novo starter
git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git apps/web
cd apps/web && rm -rf .git

# Instalar
npm install

# Aplicar branding ness.
# (seguir seções acima)

# Rodar
npm run dev
```

### Deploy Produção

```bash
# No VPS
ssh user@vps-ip
cd /opt/atlasreg
./deploy.sh
```

---

## 📊 RECURSOS NECESSÁRIOS

### VPS Mínimo (Produção)
- **CPU:** 4 cores
- **RAM:** 8GB
- **Disk:** 100GB SSD
- **Network:** 1Gbps
- **Custo:** ~$40-60/mês (DigitalOcean, Hetzner)

### Serviços Externos
- **Neon PostgreSQL:** Free tier ou $19/mês
- **SendGrid (Email):** Free até 100 emails/dia
- **Domínio:** ~$15/ano (.com ou .com.br)

**Total estimado:** $50-80/mês

---

## 🎯 SUCCESS CRITERIA (MVP Produção)

### Funcionalidade
- ✅ Sistema coleta 100+ documentos/dia automaticamente
- ✅ Pipeline processa com accuracy ≥85%
- ✅ Dashboard funcional com busca
- ✅ Watchlists configuráveis
- ✅ Alertas email diários enviando

### Performance
- ✅ Frontend load <3s
- ✅ API response <2s (p95)
- ✅ Uptime ≥99% (máximo 7h downtime/mês)

### Usuários
- ✅ 5-10 usuários piloto ativos
- ✅ NPS ≥50 (satisfação)
- ✅ Economia ≥2h/semana reportada

### Técnico
- ✅ HTTPS funcionando
- ✅ Backups automatizados
- ✅ Monitoring ativo
- ✅ CI/CD pipeline verde

---

## 📚 REFERÊNCIAS

**Frontend Starter:**
- Repo: https://github.com/arhamkhnz/next-shadcn-admin-dashboard
- Demo: https://next-shadcn-admin-dashboard.vercel.app

**Documentação AtlasReg:**
- PRD: `/docs/prd.md`
- Architecture: `/docs/fullstack-architecture.md`
- Branding: `/BRANDING.md`
- Tech Stack: `/docs/architecture/tech-stack.md`

---

## ✅ DELIVERABLES FINAIS

**8 Semanas:**
1. ✅ **Documentação** (40k palavras)
2. ✅ **Docker Dev** (rodando)
3. ⏭️ **Frontend** (Next.js 15 starter + ness.)
4. ⏭️ **Backend** (FastAPI + Auth)
5. ⏭️ **Scraping** (Airflow + DAGs)
6. ⏭️ **AI Pipeline** (BERTimbau + spaCy)
7. ⏭️ **Features** (Events, Watchlists, Alerts)
8. ⏭️ **Deploy Produção** (VPS + SSL + Monitoring)

**Resultado:**
- 🚀 **Plataforma AtlasReg funcionando em produção**
- 🎨 **Branded ness. em todos os touchpoints**
- 📊 **5-10 usuários ativos**
- ⚡ **Economizando horas de trabalho manual**

---

**Plano preparado por:** BMad Master  
**Metodologia:** BMad Method + Agile  
**Status:** ✅ Ready to Execute  
**First Action:** Instalar novo frontend starter


