# AtlasReg Frontend - Customização ness.

**Baseado em:** [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter)  
**Customizado para:** AtlasReg by ness.

---

## 🎨 Aplicações do Branding ness.

### ✅ O que foi customizado

1. **Cores OKLCH (globals.css)**
   - Substituídas cores padrão por paleta ness.
   - Background: #0B0C0E (dark navy)
   - Accent: #00ADE8 (cyan - ponto do ness.)
   - Superfícies: #111317, #151820, #1B2030

2. **Typography (layout.tsx)**
   - Montserrat font adicionada via Google Fonts
   - Weights: 400 (regular), 500 (medium), 600 (semibold)
   - Font-family padrão: Montserrat

3. **Componente NessWordmark (ness-wordmark.tsx)**
   - Componente reutilizável para logo ness.
   - Garante ponto sempre #00ADE8
   - Sizes: xs, sm, md, lg, xl, 2xl

4. **Metadata (layout.tsx)**
   - Title: "AtlasReg by ness."
   - Description atualizada
   - Keywords: energia, ANEEL, ONS
   - Locale: pt-BR

5. **TopLoader**
   - Cor alterada para #00ADE8 (ness. accent)

---

## 🏗️ Estrutura do Starter (Mantida)

```
src/
├── app/
│   ├── auth/              # Autenticação (substituir Clerk por JWT)
│   ├── dashboard/         # Dashboard principal
│   │   ├── layout.tsx     # Layout com sidebar
│   │   └── page.tsx       # Overview
│   ├── globals.css        # ✅ CUSTOMIZADO (cores ness.)
│   └── layout.tsx         # ✅ CUSTOMIZADO (Montserrat, metadata)
│
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Sidebar
│   ├── forms/             # Form components
│   ├── kbar/              # Command palette
│   └── ness-wordmark.tsx  # ✅ NOVO (branding ness.)
│
├── features/              # Feature-based modules
│   ├── products/          # ➡️ SUBSTITUIR por events/
│   ├── kanban/            # ➡️ REMOVER (não usado)
│   ├── overview/          # ✅ ADAPTAR (dashboard overview)
│   └── profile/           # ✅ MANTER (user settings)
│
├── hooks/                 # Custom hooks
├── lib/                   # Utils, configs
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

---

## 🔄 Adaptações Necessárias para AtlasReg

### 1. Remover Features Não Usadas

```bash
# Remover
rm -rf src/features/products
rm -rf src/features/kanban

# Manter e adaptar
# src/features/overview → Dashboard de eventos
# src/features/profile → User settings (watchlists, alerts)
```

### 2. Criar Features do AtlasReg

```bash
# Criar novas features
mkdir -p src/features/events/components
mkdir -p src/features/events/types
mkdir -p src/features/events/actions

mkdir -p src/features/watchlists/components
mkdir -p src/features/watchlists/types
mkdir -p src/features/watchlists/actions

mkdir -p src/features/search/components
```

### 3. Atualizar Sidebar Navigation

```tsx
// src/components/layout/sidebar.tsx (ou equivalente)
import { HomeIcon, MagnifyingGlassIcon, BookmarkIcon } from '@heroicons/react/24/outline'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    title: 'Busca Avançada',
    href: '/dashboard/search',
    icon: MagnifyingGlassIcon
  },
  {
    title: 'Minhas Watchlists',
    href: '/dashboard/watchlists',
    icon: BookmarkIcon
  }
]
```

### 4. Substituir Clerk Auth por JWT

```tsx
// src/lib/auth.ts (criar)
export async function getSession() {
  // JWT implementation
}

// Remover:
// - @clerk/nextjs (package.json)
// - Clerk components
// - Sign-in/Sign-up pages do Clerk
```

### 5. Atualizar Header com Logo ness.

```tsx
// src/components/layout/header.tsx
import { NessWithProduct } from '@/components/ness-wordmark'

export function Header() {
  return (
    <header className="bg-card border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <NessWithProduct product="AtlasReg" size="lg" />
        {/* ... resto do header */}
      </div>
    </header>
  )
}
```

---

## 📦 Dependencies do Starter (Mantidas)

### UI/UX (Manter)
- ✅ Next.js 15.3.2
- ✅ React 19
- ✅ Tailwind CSS v4
- ✅ shadcn/ui (todos os componentes Radix)
- ✅ Heroicons (substituir @tabler/icons)
- ✅ sonner (toasts)
- ✅ motion (animações)

### State Management (Manter)
- ✅ Zustand (global state)
- ✅ TanStack Table (para tabelas de eventos)
- ✅ React Hook Form + Zod
- ✅ nuqs (URL state)

### Utilities (Manter)
- ✅ date-fns (formatação de datas)
- ✅ class-variance-authority (variants)
- ✅ clsx, tailwind-merge

### Remover (Não usado)
- ❌ @clerk/nextjs (substituir por JWT custom)
- ❌ @dnd-kit (kanban não usado)
- ❌ kbar (command palette opcional)
- ❌ @sentry/nextjs (adicionar depois)

---

## 🚀 Começar Desenvolvimento

### 1. Instalar Dependencies

```bash
cd /home/resper/nSaulo/apps/web

# Remover Clerk e DnD
npm uninstall @clerk/nextjs @clerk/themes @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities

# Adicionar Heroicons
npm install @heroicons/react

# Adicionar HTTP client
npm install axios @tanstack/react-query
```

### 2. Setup .env

```bash
cp env.example.txt .env.local

# Editar .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8100
```

### 3. Rodar Dev Server

```bash
npm run dev
# Acesso: http://localhost:3000
```

---

## 🎯 Features a Implementar (Epic 4)

### Story 4.1: Design System (✅ Pronto)
- ✅ Cores ness. aplicadas
- ✅ Componente NessWordmark criado
- ✅ Montserrat font configurada
- ➡️ Instalar Heroicons

### Story 4.2: Dashboard Layout
- ➡️ Adaptar sidebar com nav items do AtlasReg
- ➡️ Atualizar header com NessWithProduct
- ➡️ Remover features não usadas (products, kanban)

### Story 4.3: Events Feed
- ➡️ Criar src/features/events/
- ➡️ EventCard component
- ➡️ Infinite scroll/pagination
- ➡️ Integração com API /events/search

### Story 4.4-4.8: Outras features
- ➡️ Filter panel
- ➡️ Event detail modal
- ➡️ Watchlist management
- ➡️ Search page
- ➡️ Settings/Profile

---

## 📚 Referências do Starter

**Original:** https://github.com/Kiranism/next-shadcn-dashboard-starter  
**Demo:** https://shadcn-dashboard.kiranism.dev

**Features do Starter (Aproveitadas):**
- ✅ Next.js 15 App Router
- ✅ TypeScript strict mode
- ✅ Tailwind CSS v4
- ✅ shadcn/ui complete collection
- ✅ Feature-based organization
- ✅ Theme provider (dark/light)
- ✅ Loading/error states
- ✅ Responsive design
- ✅ ESLint + Prettier
- ✅ Husky pre-commit hooks

---

## 🔧 Customizações Específicas ness.

### Cores (Diferenças do Original)

| Token | Original | ness. | Uso |
|-------|----------|-------|-----|
| Background dark | `#09090b` | `#0B0C0E` | Mais azulado (cinza frio) |
| Card dark | `oklch(0.205 0 0)` | `oklch(0.21 0.006 285.885)` | #111317 |
| Primary | `oklch(0.922 0 0)` | `oklch(0.546 0.245 262.881)` | Purple vibrante |
| Accent | - | `#00ADE8` | **PONTO ness.** |

### Typography (Adicionada)

- **Font:** Montserrat (substituiu font padrão)
- **Weights:** 400, 500, 600
- **Wordmark:** Medium (500) obrigatório

### Branding (Novo)

- **NessWordmark component:** Garante consistency
- **Ness

Dot:** Helper para ponto cyan
- **NessWithProduct:** Logo com produto

---

## ✅ Próximos Passos

1. **Instalar deps:**
   ```bash
   cd apps/web && npm install
   ```

2. **Remover Clerk:**
   ```bash
   npm uninstall @clerk/nextjs @clerk/themes
   rm -rf src/app/auth  # Recriar depois com JWT
   ```

3. **Adicionar Heroicons:**
   ```bash
   npm install @heroicons/react
   ```

4. **Rodar:**
   ```bash
   npm run dev
   ```

5. **Customizar:**
   - Ver dashboard em http://localhost:3000/dashboard
   - Adaptar features para AtlasReg
   - Seguir Stories do Epic 4

---

**Status:** ✅ Frontend base instalado com branding ness. aplicado  
**Próximo:** Implementar Story 4.2 (Adaptar layout e navigation)  
**Referência:** `/docs/prd.md` Epic 4


