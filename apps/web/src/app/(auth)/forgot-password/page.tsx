'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { authLogger } from '@/lib/logger'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      authLogger.info('Password reset requested', { email })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao enviar email'
      setError(message)
      authLogger.error('Password reset failed', { email, error: message })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Email de recuperação enviado! Verifique sua caixa de entrada.
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Voltar para login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Recuperar senha</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Digite seu email para receber as instruções
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar instruções'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Voltar para login
        </Link>
      </div>
    </div>
  )
}
