"use client"

import { Protect as ClerkProtect } from '@clerk/nextjs'
import { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldAlert } from 'lucide-react'

interface ProtectedProps {
  children: ReactNode
  permission?: string
  role?: string
  fallback?: ReactNode
  showAlert?: boolean
}

/**
 * Componente para proteger seções baseado em permissões/roles
 * Wrapper do Clerk Protect com UI customizada
 */
export function Protected({
  children,
  permission,
  role,
  fallback,
  showAlert = true,
}: ProtectedProps) {
  const defaultFallback = showAlert ? (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Acesso Negado</AlertTitle>
      <AlertDescription>
        Você não tem permissão para acessar este recurso.
        {permission && <span className="block mt-1 text-xs">Permissão necessária: {permission}</span>}
        {role && <span className="block mt-1 text-xs">Papel necessário: {role}</span>}
      </AlertDescription>
    </Alert>
  ) : null

  return (
    <ClerkProtect
      permission={permission}
      role={role}
      fallback={fallback || defaultFallback}
    >
      {children}
    </ClerkProtect>
  )
}

/**
 * HOC para proteger páginas inteiras
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: { permission?: string; role?: string }
) {
  return function ProtectedComponent(props: P) {
    return (
      <Protected {...options}>
        <Component {...props} />
      </Protected>
    )
  }
}

