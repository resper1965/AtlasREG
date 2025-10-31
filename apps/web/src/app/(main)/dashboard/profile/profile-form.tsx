'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileFormProps {
  user: User
  profile: Profile | null
}

/**
 * Formulário de edição de perfil do usuário
 * Permite atualizar nome completo e avatar
 */
export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setSuccess(true)
      logger.info('Profile updated', { userId: user.id })

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      setError(message)
      logger.error('Profile update failed', { userId: user.id, error: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>
            Perfil atualizado com sucesso!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="João Silva"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl">URL do Avatar</Label>
          <Input
            id="avatarUrl"
            type="url"
            placeholder="https://exemplo.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            URL pública da sua foto de perfil
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
