# AtlasReg Frontend by ness.

**Powered by:** ness<span style="color: #00ADE8">.</span> (Montserrat Medium, ponto em #00ADE8)

Plataforma web do AtlasReg - Inteligência de Mercado para Transmissão de Energia.

**Baseado em:** [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter)

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript 5.7.2
- **UI:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table
- **Icons:** Heroicons v2 (outline stroke-1.5)
- **Animations:** Motion (Framer Motion)
- **Toasts:** Sonner

---

## 🎨 Branding ness.

### Wordmark Component

```tsx
import { NessWordmark, NessWithProduct } from '@/components/ness-wordmark'

// Logo simples
<NessWordmark size="lg" />

// Logo com produto
<NessWithProduct product="AtlasReg" size="lg" />
```

### Design System

- **Background:** #0B0C0E (oklch(0.141 0.005 285.823))
- **Surfaces:** #111317, #151820, #1B2030
- **Texto:** #EEF1F6
- **Accent:** #00ADE8 (ponto do ness.)
- **Font:** Montserrat (400, 500, 600)

**Ver:** [CUSTOMIZATION.md](./CUSTOMIZATION.md) para detalhes completos

---

## 🏁 Quick Start

### 1. Instalar

```bash
cd apps/web

# Instalar dependencies
npm install

# Ou com pnpm (recomendado)
pnpm install
```

### 2. Configurar

```bash
# Copiar env example
cp env.example.txt .env.local

# Editar com API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8100" >> .env.local
```

### 3. Rodar

```bash
# Dev server (com Turbopack)
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

**Acesso:** http://localhost:3000

---

## 📁 Estrutura (Feature-Based)

```
src/
├── app/
│   ├── dashboard/         # Dashboard routes
│   │   ├── page.tsx       # Overview (adaptar para events feed)
│   │   ├── search/        # Busca avançada
│   │   ├── watchlists/    # Gestão de watchlists
│   │   └── settings/      # Configurações
│   ├── auth/              # JWT authentication (substituir Clerk)
│   ├── globals.css        # ✅ Cores ness. OKLCH
│   └── layout.tsx         # ✅ Montserrat + metadata
│
├── components/
│   ├── ness-wordmark.tsx  # ✅ NOVO - Branding ness.
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Header, Sidebar
│
├── features/
│   ├── events/            # ➡️ CRIAR - Event cards, filters
│   ├── watchlists/        # ➡️ CRIAR - Watchlist management
│   ├── search/            # ➡️ CRIAR - Advanced search
│   ├── overview/          # Adaptar para AtlasReg
│   └── profile/           # Settings, alerts config
│
├── hooks/                 # Custom hooks
├── lib/                   # Utils, auth, API client
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

---

## 🎯 Próximas Implementações (Epic 4)

### Story 4.1: Design System ✅ COMPLETO
- ✅ Cores ness. no globals.css
- ✅ Componente NessWordmark
- ✅ Montserrat font
- ✅ Theme configurado

### Story 4.2: Dashboard Layout ⏭️ PRÓXIMO
- Adaptar sidebar navigation
- Atualizar header com NessWithProduct
- Remover features não usadas

### Story 4.3: Events Feed ⏭️
- Criar src/features/events/
- EventCard component
- Integração com API

### Story 4.4-4.8: Outros
- Filter panel
- Event detail modal
- Watchlist pages
- Search page
- Settings

---

## 📦 Scripts Disponíveis

```bash
# Development
npm run dev              # Dev server com Turbopack (rápido!)
npm run build            # Build para produção
npm run start            # Start production server

# Code Quality
npm run lint             # ESLint check
npm run lint:fix         # ESLint fix + format
npm run format           # Prettier format
npm run format:check     # Prettier check
```

---

## 🔧 Customizações vs. Original

| Aspecto | Original | AtlasReg/ness. |
|---------|----------|----------------|
| **Nome** | next-shadcn-dashboard-starter | atlasreg-web |
| **Cores** | Neutras (grayscale) | ness. OKLCH (blues/purples) |
| **Font** | Inter/Geist | Montserrat |
| **Accent** | - | #00ADE8 (cyan) |
| **Logo** | - | ness. wordmark |
| **Locale** | en | pt-BR |
| **Auth** | Clerk | JWT (custom) |
| **Features** | Products, Kanban | Events, Watchlists, Alerts |

---

## 🌐 URLs (Após Deploy)

| Ambiente | URL | Descrição |
|----------|-----|-----------|
| Development | http://localhost:3000 | Dev server local |
| Dashboard | http://localhost:3000/dashboard | Dashboard overview |
| API Docs (Backend) | http://localhost:8100/docs | FastAPI Swagger |

---

## 📚 Documentação

- **Customization Guide:** [CUSTOMIZATION.md](./CUSTOMIZATION.md)
- **Branding ness.:** [/BRANDING.md](/BRANDING.md)
- **Front-End Spec:** [/docs/front-end-spec.md](/docs/front-end-spec.md)
- **PRD Epic 4:** [/docs/prd.md](/docs/prd.md) (Frontend stories)
- **Original Starter:** https://github.com/Kiranism/next-shadcn-dashboard-starter

---

## 🏆 Features do Starter (Aproveitadas)

✅ Next.js 15 + React 19  
✅ TypeScript strict  
✅ Tailwind CSS v4  
✅ shadcn/ui completo  
✅ Feature-based organization  
✅ Dark/Light theme toggle  
✅ Responsive design  
✅ ESLint + Prettier configured  
✅ Husky pre-commit hooks  
✅ Loading/error boundaries  

---

## ⚙️ Configuração

### Tailwind (tailwind.config.ts)

Cores já configuradas automaticamente via `globals.css` (variáveis OKLCH).

### TypeScript (tsconfig.json)

Strict mode habilitado, paths aliases configurados (`@/*`).

### Next.js (next.config.ts)

Turbopack enabled para dev server rápido.

---

## 🐛 Troubleshooting

### Porta 3000 ocupada

```bash
# Mudar porta
npm run dev -- -p 3100
```

### Build errors

```bash
# Limpar cache
rm -rf .next
npm run build
```

### Type errors

```bash
# Verificar
npm run lint:strict
```

---

**Status:** ✅ Frontend base instalado e customizado  
**Next.js Version:** 15.3.2  
**Branding:** ness. aplicado  
**Ready for:** Implementação das features AtlasReg

