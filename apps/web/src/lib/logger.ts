import pino from 'pino'

/**
 * Configuração do logger baseado em Pino
 * - Em desenvolvimento: logs formatados com pino-pretty
 * - Em produção: logs em JSON para agregação
 *
 * Níveis de log: trace, debug, info, warn, error, fatal
 *
 * @example
 * import { logger } from '@/lib/logger'
 *
 * logger.info('User logged in', { userId: '123' })
 * logger.error('Authentication failed', { error: err.message })
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Configuração para produção
  ...(!isDevelopment && {
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
  }),

  // Configuração para desenvolvimento
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Serializers para sanitizar dados sensíveis
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      // Não logar headers sensíveis
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
        cookie: '[REDACTED]',
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
    error: (error: Error) => ({
      type: error.name,
      message: error.message,
      stack: isDevelopment ? error.stack : undefined,
    }),
  },
})

/**
 * Logger específico para autenticação
 */
export const authLogger = logger.child({ module: 'auth' })

/**
 * Logger específico para API
 */
export const apiLogger = logger.child({ module: 'api' })

/**
 * Logger específico para banco de dados
 */
export const dbLogger = logger.child({ module: 'database' })

/**
 * Função helper para logar erros de forma consistente
 *
 * @example
 * try {
 *   // ... código
 * } catch (error) {
 *   logError('Failed to process data', error, { userId: '123' })
 * }
 */
export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  logger.error(
    {
      ...context,
      error: {
        type: errorObj.name,
        message: errorObj.message,
        stack: isDevelopment ? errorObj.stack : undefined,
      },
    },
    message
  )
}

/**
 * Sanitiza objetos removendo campos sensíveis antes de logar
 */
export function sanitize<T extends Record<string, unknown>>(
  obj: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'apiKey', 'authorization']
): T {
  const sanitized = { ...obj } as any

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  }

  return sanitized as T
}

/**
 * Cria um logger child com contexto específico
 *
 * @example
 * const userLogger = createContextLogger({ userId: '123', org: 'acme' })
 * userLogger.info('Action performed')
 */
export function createContextLogger(context: Record<string, unknown>) {
  return logger.child(context)
}
