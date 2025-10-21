import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Rotas públicas (não precisam autenticação)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/public(.*)',
])

// Rotas que requerem admin
const isAdminRoute = createRouteMatcher([
  '/dashboard/configuracoes/admin(.*)',
  '/dashboard/usuarios(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Permitir rotas públicas
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Proteger rotas privadas
  const { userId, orgId, orgRole, has } = await auth()

  if (!userId) {
    // Não autenticado - redirecionar para login
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Verificar se precisa estar em uma organização
  const requiresOrg = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (requiresOrg && !orgId) {
    // Usuário autenticado mas sem organização
    const selectOrgUrl = new URL('/dashboard/organizations', request.url)
    return NextResponse.redirect(selectOrgUrl)
  }

  // Verificar permissões de admin
  if (isAdminRoute(request)) {
    if (!has({ role: 'org:admin' })) {
      // Sem permissão de admin
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  // Adicionar headers com info do usuário para logging
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-clerk-user-id', userId)
  if (orgId) requestHeaders.set('x-clerk-org-id', orgId)
  if (orgRole) requestHeaders.set('x-clerk-org-role', orgRole)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}, {
  // Configurações do middleware
  debug: process.env.NODE_ENV === 'development',
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

