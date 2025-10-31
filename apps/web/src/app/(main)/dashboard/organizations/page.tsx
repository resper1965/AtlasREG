import { redirect } from 'next/navigation'
import { Users, Building2, Settings } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default async function OrganizationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar todas as organizações do usuário com detalhes
  const { data: memberships } = await supabase
    .from('organization_members')
    .select(
      `
      id,
      role,
      joined_at,
      organization:organizations (
        id,
        name,
        slug,
        avatar_url,
        created_at
      )
    `
    )
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  // Buscar organização atual do cookie/preferência
  const currentOrgId =
    memberships && memberships.length > 0 ? memberships[0].organization.id : null

  // Se há uma organização atual, buscar detalhes e membros
  let currentOrgMembers = null
  if (currentOrgId) {
    const { data } = await supabase
      .from('organization_members')
      .select(
        `
        id,
        role,
        joined_at,
        profile:profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `
      )
      .eq('organization_id', currentOrgId)
      .order('joined_at', { ascending: false })

    currentOrgMembers = data
  }

  const currentOrg = memberships?.find(
    (m: any) => m.organization.id === currentOrgId
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organizações</h1>
        <p className="text-muted-foreground">
          Gerencie suas organizações e membros
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Organização Atual</TabsTrigger>
          <TabsTrigger value="all">Todas as Organizações</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentOrg ? (
            <>
              {/* Informações da Organização */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {currentOrg.organization.avatar_url ? (
                        <img
                          src={currentOrg.organization.avatar_url}
                          alt={currentOrg.organization.name}
                          className="size-16 rounded-lg"
                        />
                      ) : (
                        <div className="flex size-16 items-center justify-center rounded-lg bg-[#00ADE8]/10">
                          <Building2 className="size-8 text-[#00ADE8]" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{currentOrg.organization.name}</CardTitle>
                        <CardDescription>
                          {currentOrg.organization.slug}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {currentOrg.role === 'admin' && 'Administrador'}
                      {currentOrg.role === 'manager' && 'Gerente'}
                      {currentOrg.role === 'editor' && 'Editor'}
                      {currentOrg.role === 'viewer' && 'Visualizador'}
                      {currentOrg.role === 'member' && 'Membro'}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Membros da Organização */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="size-5" />
                    <CardTitle>Membros</CardTitle>
                  </div>
                  <CardDescription>
                    {currentOrgMembers?.length || 0} membro(s) nesta organização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentOrgMembers?.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          {member.profile.avatar_url ? (
                            <img
                              src={member.profile.avatar_url}
                              alt={member.profile.full_name}
                              className="size-10 rounded-full"
                            />
                          ) : (
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#00ADE8]/10">
                              <Users className="size-5 text-[#00ADE8]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {member.profile.full_name || 'Sem nome'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.profile.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma Organização Selecionada</CardTitle>
                <CardDescription>
                  Selecione uma organização no menu superior ou crie uma nova
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Organizações</CardTitle>
              <CardDescription>
                Visualize todas as organizações que você faz parte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberships && memberships.length > 0 ? (
                  memberships.map((membership: any) => (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {membership.organization.avatar_url ? (
                          <img
                            src={membership.organization.avatar_url}
                            alt={membership.organization.name}
                            className="size-12 rounded-lg"
                          />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg bg-[#00ADE8]/10">
                            <Building2 className="size-6 text-[#00ADE8]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {membership.organization.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {membership.organization.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{membership.role}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Você ainda não faz parte de nenhuma organização
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Info */}
      {currentOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="size-5" />
              <CardTitle>Seu Papel na Organização</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#00ADE8] text-white hover:bg-[#008ec4]">
                {currentOrg.role}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentOrg.role === 'admin' &&
                  'Acesso total e gerenciamento de membros'}
                {currentOrg.role === 'manager' &&
                  'Gerenciar recursos e membros'}
                {currentOrg.role === 'editor' && 'Editar recursos da organização'}
                {currentOrg.role === 'viewer' && 'Apenas visualização'}
                {currentOrg.role === 'member' &&
                  'Acesso aos recursos da organização'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

