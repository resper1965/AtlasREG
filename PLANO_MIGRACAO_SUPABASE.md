# PLANO DE MIGRAÇÃO: CLERK → SUPABASE + REFATORAÇÃO DE ERROS

## 📋 VISÃO GERAL

**Objetivo:** Substituir Clerk por Supabase e corrigir todos os 32 problemas identificados na análise arquitetural.

**Duração Estimada:** 2-3 dias de desenvolvimento

**Impacto:** Alto - Mudança completa do sistema de autenticação

---

## 🔄 ETAPAS DA MIGRAÇÃO

### FASE 1: Preparação e Configuração
- [x] Criar plano de migração
- [ ] Instalar dependências Supabase
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Validar variáveis de ambiente (zod)

### FASE 2: Banco de Dados
- [ ] Criar schema de usuários
- [ ] Criar schema de organizações
- [ ] Criar schema de roles e permissões
- [ ] Criar migrations
- [ ] Configurar Row Level Security (RLS)

### FASE 3: Autenticação
- [ ] Implementar Supabase client (browser)
- [ ] Implementar Supabase client (server)
- [ ] Criar middleware de autenticação
- [ ] Implementar login/logout
- [ ] Implementar registro de usuários
- [ ] Implementar recuperação de senha
- [ ] Implementar SSO (opcional)

### FASE 4: RBAC e Permissões
- [ ] Migrar sistema de permissões
- [ ] Implementar hooks de autorização
- [ ] Criar componente Protected
- [ ] Atualizar páginas protegidas

### FASE 5: Componentes UI
- [ ] Remover componentes Clerk
- [ ] Criar componentes de login
- [ ] Criar componentes de registro
- [ ] Criar componente de perfil
- [ ] Criar header com menu de usuário
- [ ] Criar gerenciamento de organizações

### FASE 6: Correções Críticas
- [ ] Corrigir next.config.mjs
- [ ] Substituir 'any' por types
- [ ] Implementar logging service
- [ ] Adicionar error boundaries
- [ ] Adicionar loading states
- [ ] Configurar CSP headers

### FASE 7: Testes e Validação
- [ ] Testar fluxo de login
- [ ] Testar fluxo de registro
- [ ] Testar permissões
- [ ] Testar multi-tenancy
- [ ] Validar segurança

### FASE 8: Documentação
- [ ] Atualizar README
- [ ] Criar guia de autenticação
- [ ] Documentar RBAC
- [ ] Atualizar .env.example

---

## 📦 DEPENDÊNCIAS

### Remover (Clerk)
```json
{
  "@clerk/localizations": "^3.26.2",
  "@clerk/nextjs": "^6.33.7",
  "@clerk/themes": "^2.4.28",
  "svix": "^1.77.0"
}
```

### Adicionar (Supabase)
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.8.7",
  "@supabase/auth-ui-react": "^0.4.7",
  "@supabase/auth-ui-shared": "^0.1.8",
  "zod": "^3.25.76" (já instalado)
}
```

---

## 🗄️ SCHEMA DO BANCO DE DADOS

### Tabela: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: organization_members
```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'analyst', 'member', 'viewer', 'external')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);
```

### Tabela: permissions
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT
);
```

### Tabela: role_permissions
```sql
CREATE TABLE role_permissions (
  role TEXT NOT NULL,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);
```

---

## 🔐 MAPEAMENTO DE FUNCIONALIDADES

| Clerk | Supabase | Status |
|-------|----------|--------|
| ClerkProvider | SupabaseProvider | ⏳ |
| useAuth() | useUser() + useSession() | ⏳ |
| useUser() | useUser() | ⏳ |
| auth() | createServerClient() | ⏳ |
| currentUser() | getUser() | ⏳ |
| SignIn | Custom SignIn component | ⏳ |
| SignUp | Custom SignUp component | ⏳ |
| UserButton | Custom UserMenu | ⏳ |
| OrganizationSwitcher | Custom OrgSwitcher | ⏳ |
| Protect | Custom Protected | ⏳ |
| Webhooks | Database Triggers | ⏳ |

---

## 🔧 ARQUIVOS A MODIFICAR

### 1. Configuração
- ✅ `apps/web/package.json` - Atualizar dependências
- ✅ `apps/web/next.config.mjs` - Corrigir erros críticos
- ✅ `apps/web/.env.example` - Criar com vars Supabase
- ✅ `apps/web/middleware.ts` - Reescrever com Supabase

### 2. Autenticação
- ✅ `apps/web/src/lib/supabase/client.ts` - Cliente browser
- ✅ `apps/web/src/lib/supabase/server.ts` - Cliente server
- ✅ `apps/web/src/lib/supabase/middleware.ts` - Middleware helper
- ✅ `apps/web/src/lib/env.ts` - Validação env vars

### 3. RBAC
- ✅ `apps/web/src/lib/auth/permissions.ts` - Sistema de permissões
- ✅ `apps/web/src/lib/auth/rbac.ts` - Lógica RBAC
- ✅ `apps/web/src/hooks/use-user.ts` - Hook de usuário
- ✅ `apps/web/src/hooks/use-permissions.ts` - Hook de permissões

### 4. Componentes
- ❌ `apps/web/src/components/auth/clerk-header.tsx` - DELETAR
- ❌ `apps/web/src/components/auth/protected.tsx` - DELETAR (Clerk version)
- ✅ `apps/web/src/components/auth/protected.tsx` - Reescrever com Supabase
- ✅ `apps/web/src/components/auth/user-menu.tsx` - CRIAR
- ✅ `apps/web/src/components/auth/auth-form.tsx` - CRIAR
- ✅ `apps/web/src/components/auth/org-switcher.tsx` - CRIAR

### 5. Páginas
- ✅ `apps/web/src/app/layout.tsx` - Remover ClerkProvider
- ✅ `apps/web/src/app/(main)/dashboard/layout.tsx` - Atualizar auth
- ❌ `apps/web/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - DELETAR
- ❌ `apps/web/src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - DELETAR
- ❌ `apps/web/src/app/(auth)/sso-callback/page.tsx` - DELETAR
- ✅ `apps/web/src/app/(auth)/login/page.tsx` - CRIAR
- ✅ `apps/web/src/app/(auth)/register/page.tsx` - CRIAR
- ✅ `apps/web/src/app/(auth)/forgot-password/page.tsx` - CRIAR

### 6. API Routes
- ❌ `apps/web/src/app/api/webhooks/clerk/route.ts` - DELETAR
- ✅ `apps/web/src/app/api/auth/callback/route.ts` - CRIAR

### 7. Correções de Erros
- ✅ `apps/web/src/lib/logger.ts` - CRIAR logging service
- ✅ `apps/web/src/app/error.tsx` - CRIAR error boundary
- ✅ `apps/web/src/app/loading.tsx` - CRIAR loading state
- ✅ `apps/web/src/app/(main)/dashboard/error.tsx` - CRIAR
- ✅ `apps/web/src/app/(main)/dashboard/loading.tsx` - CRIAR

---

## 📝 CHECKLIST DE CORREÇÕES

### Problemas Críticos (Prioridade 1)
- [ ] ✅ Corrigir `ignoreBuildErrors: true`
- [ ] ✅ Corrigir `ignoreDuringBuilds: true`
- [ ] ✅ Corrigir bug `removeConsole`
- [ ] ✅ Implementar sistema de autenticação funcional (Supabase)
- [ ] ✅ Adicionar validação de env vars
- [ ] ✅ Criar .env.example

### Problemas de Segurança
- [ ] ✅ Remover logs sensíveis
- [ ] ✅ Implementar logging service
- [ ] ✅ Adicionar CSP headers
- [ ] ✅ Implementar rate limiting (Supabase Edge Functions)

### Problemas de Qualidade
- [ ] ✅ Substituir 34 usos de 'any'
- [ ] ✅ Adicionar error boundaries
- [ ] ✅ Adicionar loading states
- [ ] ✅ Corrigir função cn() duplicada
- [ ] ✅ Remover imports não utilizados

### Problemas de Performance
- [ ] ✅ Configurar otimização de imagens
- [ ] ✅ Implementar Zustand persist

### Problemas de UX/UI
- [ ] ✅ Melhorar responsividade
- [ ] ✅ Usar CSS variables para cores
- [ ] ✅ Corrigir dark mode

---

## 🚀 EXECUÇÃO

Iniciando implementação agora...
