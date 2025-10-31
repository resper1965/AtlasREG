import { Spinner } from '@/components/ui/spinner'

/**
 * Loading state específico para o dashboard
 * Exibido durante carregamento de páginas do dashboard
 */
export default function DashboardLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">
          Carregando dashboard...
        </p>
      </div>
    </div>
  )
}
