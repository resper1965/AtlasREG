# FASE 2 - COMPONENTES UI E PÁGINAS (GUIA DE IMPLEMENTAÇÃO)

**Status:** ✅ Hooks e Core Components Completos
**Próximo:** Implementar páginas de autenticação e finalizar UI

---

## ✅ JÁ IMPLEMENTADO (Fase 2A)

### 1. Hooks Customizados

| Hook | Arquivo | Status | Descrição |
|------|---------|--------|-----------|
| `useUser()` | `src/hooks/use-user.ts` | ✅ | Usuário autenticado + perfil |
| `useAuth()` | `src/hooks/use-user.ts` | ✅ | Versão simplificada |
| `usePermissions()` | `src/hooks/use-permissions.ts` | ✅ | Verificação de permissões/roles |
| `useOrganization()` | `src/hooks/use-organization.ts` | ✅ | Gerenciar organizações |

### 2. Componentes Core

| Componente | Arquivo | Status |
|------------|---------|--------|
| `Protected` | `src/components/auth/protected.tsx` | ✅ |
| `UserMenu` | `src/components/auth/user-menu.tsx` | ✅ |

---

## 📝 IMPLEMENTAÇÃO RESTANTE (Fase 2B)

### Páginas de Autenticação

Crie os seguintes arquivos:

#### 1. Layout de Autenticação
**Arquivo:** `apps/web/src/app/(auth)/layout.tsx`

```tsx
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se já está autenticado, redirecionar para dashboard
  if (user) {
    redirect('/dashboard/default')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">AtlasReg by ness.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inteligência de Mercado para Transmissão de Energia
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
```

#### 2. Página de Login
**Arquivo:** `apps/web/src/app/(auth)/login/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { authLogger } from '@/lib/logger'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      authLogger.info('User logged in', { email })
      router.push('/dashboard/default')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(message)
      authLogger.error('Login failed', { email, error: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Entrar</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Digite suas credenciais para acessar sua conta
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}
```

#### 3. Página de Registro
**Arquivo:** `apps/web/src/app/(auth)/register/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { authLogger } from '@/lib/logger'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      authLogger.info('User registered', { email })

      // Redirecionar para verificação de email
      router.push('/login?message=check-email')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(message)
      authLogger.error('Registration failed', { email, error: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Criar conta</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados abaixo para começar
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="João Silva"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </div>
    </div>
  )
}
```

#### 4. Página de Recuperação de Senha
**Arquivo:** `apps/web/src/app/(auth)/forgot-password/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { authLogger } from '@/lib/logger'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      authLogger.info('Password reset requested', { email })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao enviar email'
      setError(message)
      authLogger.error('Password reset failed', { email, error: message })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Email de recuperação enviado! Verifique sua caixa de entrada.
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Voltar para login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Recuperar senha</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Digite seu email para receber as instruções
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar instruções'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Voltar para login
        </Link>
      </div>
    </div>
  )
}
```

---

## 🔄 ATUALIZAR LAYOUTS

### Layout Principal
**Arquivo:** `apps/web/src/app/layout.tsx`

Remover ClerkProvider e adicionar provider personalizado:

```tsx
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { getPreference } from '@/server/server-actions'
import { PreferencesStoreProvider } from '@/stores/preferences/preferences-provider'
import {
  THEME_MODE_VALUES,
  THEME_PRESET_VALUES,
  type ThemePreset,
  type ThemeMode,
} from '@/types/preferences/theme'

import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'AtlasReg by ness. | Inteligência de Mercado para Transmissão de Energia',
  description:
    'Plataforma de IA para monitoramento automático e análise do setor de transmissão de energia elétrica brasileiro.',
  keywords: [
    'energia elétrica',
    'transmissão',
    'ANEEL',
    'ONS',
    'SIGEL',
    'inteligência de mercado',
    'ness',
  ],
  authors: [{ name: 'Ricardo Esper', email: 'resper@ness.com.br' }],
  creator: 'ness.',
  publisher: 'ness.',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>(
    'theme_mode',
    THEME_MODE_VALUES,
    'light'
  )
  const themePreset = await getPreference<ThemePreset>(
    'theme_preset',
    THEME_PRESET_VALUES,
    'default'
  )

  return (
    <html
      lang="pt-BR"
      className={themeMode === 'dark' ? 'dark' : ''}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className={`${montserrat.className} min-h-screen antialiased`}>
        <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
          {children}
          <Toaster />
        </PreferencesStoreProvider>
      </body>
    </html>
  )
}
```

### Dashboard Layout
**Arquivo:** `apps/web/src/app/(main)/dashboard/layout.tsx`

```tsx
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/auth/user-menu'
import { Sidebar } from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="text-xl font-semibold">AtlasReg by ness.</div>
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 🚨 ERROR BOUNDARIES

### Root Error Boundary
**Arquivo:** `apps/web/src/app/error.tsx`

```tsx
'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Application error', { error: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Algo deu errado!</AlertTitle>
          <AlertDescription>
            Ocorreu um erro inesperado. Por favor, tente novamente.
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-xs">{error.message}</pre>
            )}
          </AlertDescription>
        </Alert>

        <Button onClick={reset} className="w-full">
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
```

### Dashboard Error Boundary
**Arquivo:** `apps/web/src/app/(main)/dashboard/error.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { logger } from '@/lib/logger'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Dashboard error', { error: error.message })
  }, [error])

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="size-4" />
        <AlertTitle>Erro no Dashboard</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>Não foi possível carregar esta página.</p>
          <Button onClick={reset} variant="outline" size="sm">
            Recarregar
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

---

## ⏳ LOADING STATES

### Root Loading
**Arquivo:** `apps/web/src/app/loading.tsx`

```tsx
import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
```

### Dashboard Loading
**Arquivo:** `apps/web/src/app/(main)/dashboard/loading.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar layout de auth: `app/(auth)/layout.tsx`
- [ ] Criar página de login: `app/(auth)/login/page.tsx`
- [ ] Criar página de registro: `app/(auth)/register/page.tsx`
- [ ] Criar página de recuperação: `app/(auth)/forgot-password/page.tsx`
- [ ] Atualizar `app/layout.tsx` (remover Clerk)
- [ ] Atualizar `app/(main)/dashboard/layout.tsx`
- [ ] Criar `app/error.tsx`
- [ ] Criar `app/(main)/dashboard/error.tsx`
- [ ] Criar `app/loading.tsx`
- [ ] Criar `app/(main)/dashboard/loading.tsx`
- [ ] Adicionar Spinner component (se não existir)
- [ ] Testar fluxos de autenticação

---

## 🎨 MELHORIAS DE UX/UI A IMPLEMENTAR

1. **Variáveis CSS para Cores**
   - Substituir `#00ADE8` hardcoded por `var(--color-brand)`
   - Adicionar em `globals.css`

2. **Responsividade**
   - Adicionar breakpoints `xl:` e `2xl:`
   - Testar em mobile/tablet

3. **Accessibility**
   - Verificar contraste de cores
   - Adicionar aria-labels
   - Testar navegação por teclado

4. **Loading States**
   - Skeleton screens
   - Spinners
   - Progress indicators

5. **Feedback Visual**
   - Toast notifications
   - Success/error states
   - Loading states

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar os arquivos listados acima
2. Testar autenticação end-to-end
3. Revisar UX/UI completo
4. Adicionar testes automatizados

---

**Data:** 31/10/2025
**Status:** Guia Completo - Pronto para Implementação
