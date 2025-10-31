import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar organizações do usuário
  const { data: memberships } = await supabase
    .from('organization_members')
    .select(`
      id,
      role,
      organization:organizations (
        id,
        name,
        slug,
        avatar_url
      )
    `)
    .eq('user_id', user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {user.email}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.email_confirmed_at ? '✓ Verificado' : 'Pendente'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Organizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memberships?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Atualmente membro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.confirmed_at ? '🔒' : '🔓'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.confirmed_at ? 'Confirmada' : 'Pendente'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} profile={profile} />
        </CardContent>
      </Card>

      {/* Organization Memberships */}
      {memberships && memberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Organizações</CardTitle>
            <CardDescription>
              Organizações das quais você faz parte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberships.map((membership: any) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {membership.organization.avatar_url && (
                      <img
                        src={membership.organization.avatar_url}
                        alt={membership.organization.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{membership.organization.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {membership.organization.slug}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#00ADE8]/10 text-[#00ADE8] rounded-full text-xs font-medium">
                    {membership.role === 'admin' && 'Administrador'}
                    {membership.role === 'manager' && 'Gerente'}
                    {membership.role === 'editor' && 'Editor'}
                    {membership.role === 'viewer' && 'Visualizador'}
                    {membership.role === 'member' && 'Membro'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Powered by */}
      <div className="text-center text-sm text-muted-foreground">
        Powered by <span className="text-[#00ADE8] font-semibold">ness.</span>
      </div>
    </div>
  )
}

