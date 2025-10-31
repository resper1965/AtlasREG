import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware para autenticação com Supabase
 * - Atualiza sessão do usuário automaticamente
 * - Protege rotas privadas
 * - Redireciona usuários não autenticados para /login
 */
export async function middleware(request: import('next/server').NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - static files (.svg, .png, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

