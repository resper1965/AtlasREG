'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { logger } from '@/lib/logger'

/**
 * Error boundary específico para o dashboard
 * Captura erros dentro das páginas do dashboard
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro com contexto de dashboard
    logger.error('Dashboard error boundary', {
      error: error.message,
      digest: error.digest,
      stack: error.stack,
      context: 'dashboard',
    })
  }, [error])

  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro no Dashboard</AlertTitle>
          <AlertDescription>
            Não foi possível carregar esta página do dashboard. Tente
            novamente ou entre em contato com o suporte se o problema
            persistir.
          </AlertDescription>
        </Alert>

        {error.digest && (
          <p className="text-sm text-muted-foreground">
            Código de referência: {error.digest}
          </p>
        )}

        {process.env.NODE_ENV === 'development' && (
          <details className="rounded-md border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex gap-4">
          <Button onClick={reset} className="flex-1">
            Tentar novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/dashboard/default')}
            className="flex-1"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  )
}
