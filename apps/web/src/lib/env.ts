import { z } from 'zod'

/**
 * Schema de validação para variáveis de ambiente
 * Garante que todas as env vars necessárias estão configuradas
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY é obrigatória').optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Optional: Database (se usar Postgres direto)
  DATABASE_URL: z.string().url().optional(),

  // Optional: Analytics
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

/**
 * Tipo inferido do schema de validação
 */
export type Env = z.infer<typeof envSchema>

/**
 * Função para validar e parsear env vars
 * Lança erro se alguma variável necessária estiver faltando
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `${err.path.join('.')}: ${err.message}`
      })

      throw new Error(
        `❌ Erro na configuração de variáveis de ambiente:\n${missingVars.join('\n')}\n\nVerifique seu arquivo .env`
      )
    }
    throw error
  }
}

/**
 * Variáveis de ambiente validadas
 * Use este objeto ao invés de process.env diretamente
 *
 * @example
 * import { env } from '@/lib/env'
 *
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
 */
export const env = validateEnv()
