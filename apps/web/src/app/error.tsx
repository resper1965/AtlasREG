'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { logger } from '@/lib/logger'

/**
 * Error boundary global da aplicação
 * Captura erros não tratados e exibe UI de fallback
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro
    logger.error('Global error boundary', {
      error: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Algo deu errado!</AlertTitle>
          <AlertDescription>
            Ocorreu um erro inesperado na aplicação. Nossa equipe foi
            notificada e estamos trabalhando para resolver o problema.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {error.digest && (
            <p className="text-sm text-muted-foreground">
              Código do erro: {error.digest}
            </p>
          )}

          {process.env.NODE_ENV === 'development' && (
            <details className="rounded-md border p-4">
              <summary className="cursor-pointer text-sm font-medium">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 overflow-auto text-xs">
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={reset} className="flex-1">
            Tentar novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/dashboard/default')}
            className="flex-1"
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
