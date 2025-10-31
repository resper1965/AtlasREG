import { Spinner } from '@/components/ui/spinner'

/**
 * Loading state global da aplicação
 * Exibido durante navegação entre páginas
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}
