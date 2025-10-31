'use client'

import { ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { usePermissions } from '@/hooks/use-permissions'
import type { Database } from '@/types/database'

type UserRole = Database['public']['Enums']['user_role']

interface ProtectedProps {
  children: ReactNode
  permission?: string
  role?: UserRole
  fallback?: ReactNode
  showAlert?: boolean
}

/**
 * Componente para proteger seções baseado em permissões/roles
 * Usa Supabase para verificação de acesso
 *
 * @example
 * <Protected permission="events.create">
 *   <CreateEventButton />
 * </Protected>
 *
 * @example
 * <Protected role="admin">
 *   <AdminPanel />
 * </Protected>
 */
export function Protected({
  children,
  permission,
  role,
  fallback,
  showAlert = true,
}: ProtectedProps) {
  const { hasPermission, hasRole, loading } = usePermissions()

  // Mostrar loading enquanto verifica permissões
  if (loading) {
    return null
  }

  // Verificar permissão
  if (permission && !hasPermission(permission)) {
    return renderFallback()
  }

  // Verificar role
  if (role && !hasRole(role)) {
    return renderFallback()
  }

  return <>{children}</>

  function renderFallback() {
    if (fallback) {
      return <>{fallback}</>
    }

    if (!showAlert) {
      return null
    }

    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar este recurso.
          {permission && (
            <span className="mt-1 block text-xs">
              Permissão necessária: {permission}
            </span>
          )}
          {role && (
            <span className="mt-1 block text-xs">Papel necessário: {role}</span>
          )}
        </AlertDescription>
      </Alert>
    )
  }
}

/**
 * HOC para proteger páginas inteiras
 *
 * @example
 * const AdminPage = withProtection(
 *   MyAdminComponent,
 *   { role: 'admin' }
 * )
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: { permission?: string; role?: UserRole }
) {
  return function ProtectedComponent(props: P) {
    return (
      <Protected {...options}>
        <Component {...props} />
      </Protected>
    )
  }
}

