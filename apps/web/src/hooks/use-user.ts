'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UserWithProfile {
  user: User
  profile: Profile | null
}

/**
 * Hook para obter usuário autenticado e seu perfil
 *
 * @example
 * function MyComponent() {
 *   const { user, profile, loading } = useUser()
 *
 *   if (loading) return <Spinner />
 *   if (!user) return <LoginPrompt />
 *
 *   return <div>Hello {profile?.full_name}</div>
 * }
 */
export function useUser() {
  const [data, setData] = useState<UserWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Função para carregar usuário e perfil
    async function loadUser() {
      try {
        setLoading(true)

        // Obter usuário atual
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          setData(null)
          return
        }

        // Obter perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = Row not found (pode acontecer se profile ainda não foi criado)
          throw profileError
        }

        setData({ user, profile })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'))
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser()
      } else {
        setData(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    loading,
    error,
    isAuthenticated: !!data?.user,
  }
}

/**
 * Hook simplificado que retorna apenas o usuário
 */
export function useAuth() {
  const { user, loading, error, isAuthenticated } = useUser()

  return {
    user,
    loading,
    error,
    isAuthenticated,
  }
}
