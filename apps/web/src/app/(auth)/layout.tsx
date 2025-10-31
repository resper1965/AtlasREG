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
          <h1 className="text-3xl font-bold tracking-tight">
            AtlasReg by ness.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inteligência de Mercado para Transmissão de Energia
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
