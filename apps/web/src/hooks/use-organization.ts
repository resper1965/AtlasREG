'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { useUser } from './use-user'
import type { Database } from '@/types/database'

type Organization = Database['public']['Tables']['organizations']['Row']
type OrganizationMember = Database['public']['Tables']['organization_members']['Row']

interface OrganizationWithRole extends Organization {
  role: OrganizationMember['role']
}

/**
 * Hook para gerenciar organizações do usuário
 *
 * @example
 * function OrgSwitcher() {
 *   const {
 *     organizations,
 *     currentOrganization,
 *     switchOrganization,
 *     loading
 *   } = useOrganization()
 *
 *   return (
 *     <Select onValueChange={switchOrganization}>
 *       {organizations.map(org => (
 *         <option key={org.id} value={org.id}>{org.name}</option>
 *       ))}
 *     </Select>
 *   )
 * }
 */
export function useOrganization() {
  const { user, loading: userLoading } = useUser()
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([])
  const [currentOrganization, setCurrentOrganization] =
    useState<OrganizationWithRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      setOrganizations([])
      setCurrentOrganization(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    async function loadOrganizations() {
      try {
        setLoading(true)

        // Obter todas as organizações do usuário
        const { data: memberships, error } = await supabase
          .from('organization_members')
          .select('organization_id, role, organizations(*)')
          .eq('user_id', user!.id)

        if (error) throw error

        if (!memberships || memberships.length === 0) {
          setOrganizations([])
          setCurrentOrganization(null)
          setLoading(false)
          return
        }

        // Mapear para incluir role
        const orgsWithRole: OrganizationWithRole[] = memberships
          .map((m) => {
            const org = m.organizations as unknown as Organization
            if (!org) return null
            return {
              ...org,
              role: m.role,
            }
          })
          .filter(Boolean) as OrganizationWithRole[]

        setOrganizations(orgsWithRole)

        // Tentar recuperar organização atual do localStorage
        const savedOrgId =
          typeof window !== 'undefined'
            ? localStorage.getItem('currentOrganizationId')
            : null

        const current =
          orgsWithRole.find((o) => o.id === savedOrgId) || orgsWithRole[0]

        setCurrentOrganization(current || null)
      } catch (error) {
        console.error('Error loading organizations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [user, userLoading])

  /**
   * Muda a organização atual
   */
  const switchOrganization = (organizationId: string) => {
    const org = organizations.find((o) => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentOrganizationId', organizationId)
      }
    }
  }

  /**
   * Cria uma nova organização
   */
  const createOrganization = async (name: string, slug: string) => {
    if (!user) throw new Error('User not authenticated')

    const supabase = createClient()

    // Criar organização
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name, slug })
      .select()
      .single()

    if (orgError) throw orgError

    // Adicionar usuário como admin
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: 'admin',
      })

    if (memberError) throw memberError

    // Recarregar organizações
    const newOrg: OrganizationWithRole = {
      ...org,
      role: 'admin',
    }

    setOrganizations([...organizations, newOrg])
    setCurrentOrganization(newOrg)

    return newOrg
  }

  return {
    organizations,
    currentOrganization,
    switchOrganization,
    createOrganization,
    loading: loading || userLoading,
  }
}
