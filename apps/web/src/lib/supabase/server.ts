import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import type { Database } from '@/types/database'

/**
 * Cliente Supabase para uso no servidor (Server Components, Server Actions, Route Handlers)
 *
 * @example
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 *   return <div>Hello {user?.email}</div>
 * }
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Component - cookies() é read-only
            // Esta função será chamada durante renderização
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server Component - cookies() é read-only
          }
        },
      },
    }
  )
}

/**
 * Cliente Supabase com Service Role Key
 * ⚠️ USO PERIGOSO: Este cliente bypassa Row Level Security (RLS)
 * Use apenas em operações administrativas
 */
export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {},
    }
  )
}
