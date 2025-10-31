'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { useUser } from './use-user'
import type { Database } from '@/types/database'

type UserRole = Database['public']['Enums']['user_role']
type Permission = Database['public']['Tables']['permissions']['Row']

/**
 * Hook para verificar permissões do usuário
 *
 * @example
 * function MyComponent() {
 *   const { hasPermission, hasRole, role, loading } = usePermissions()
 *
 *   if (hasPermission('events.create')) {
 *     return <CreateEventButton />
 *   }
 *
 *   if (hasRole('admin')) {
 *     return <AdminPanel />
 *   }
 * }
 */
export function usePermissions(organizationId?: string) {
  const { user, loading: userLoading } = useUser()
  const [permissions, setPermissions] = useState<string[]>([])
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      setPermissions([])
      setRole(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function loadPermissions() {
      try {
        setLoading(true)

        // Se organizationId não foi fornecido, pegar a primeira organização do usuário
        let orgId = organizationId

        if (!orgId) {
          const { data: memberships } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user!.id)
            .limit(1)
            .single()

          if (memberships) {
            orgId = memberships.organization_id
            setRole(memberships.role)
          }
        }

        if (!orgId) {
          setPermissions([])
          setLoading(false)
          return
        }

        // Obter role do usuário na organização
        const { data: membership } = await supabase
          .from('organization_members')
          .select('role')
          .eq('organization_id', orgId)
          .eq('user_id', user!.id)
          .single()

        if (!membership) {
          setPermissions([])
          setLoading(false)
          return
        }

        setRole(membership.role)

        // Obter permissões do role
        const { data: rolePermissions } = await supabase
          .from('role_permissions')
          .select('permission_id, permissions(name)')
          .eq('role', membership.role)

        if (rolePermissions) {
          const perms = rolePermissions
            .map((rp) => {
              const permission = rp.permissions as unknown as Permission
              return permission?.name
            })
            .filter(Boolean) as string[]

          setPermissions(perms)
        }
      } catch (error) {
        console.error('Error loading permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [user, userLoading, organizationId])

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  /**
   * Verifica se o usuário tem múltiplas permissões (todas)
   */
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((perm) => permissions.includes(perm))
  }

  /**
   * Verifica se o usuário tem pelo menos uma das permissões
   */
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((perm) => permissions.includes(perm))
  }

  /**
   * Verifica se o usuário tem um role específico
   */
  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole
  }

  /**
   * Verifica se o usuário tem um dos roles especificados
   */
  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    return role ? requiredRoles.includes(role) : false
  }

  /**
   * Verifica se é admin (útil para verificações rápidas)
   */
  const isAdmin = role === 'admin'

  return {
    permissions,
    role,
    loading: loading || userLoading,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isAdmin,
  }
}
