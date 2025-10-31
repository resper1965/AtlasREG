import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/database'

/**
 * Cliente Supabase para uso no browser (Client Components)
 *
 * @example
 * 'use client'
 *
 * import { createClient } from '@/lib/supabase/client'
 *
 * export default function MyComponent() {
 *   const supabase = createClient()
 *
 *   async function handleLogin(email: string, password: string) {
 *     const { error } = await supabase.auth.signInWithPassword({
 *       email,
 *       password,
 *     })
 *   }
 * }
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
