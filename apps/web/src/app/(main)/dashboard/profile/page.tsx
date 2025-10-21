import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const user = await currentUser();

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
              {user?.emailAddresses[0]?.emailAddress}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.emailAddresses[0]?.verification?.status === "verified" ? "✓ Verificado" : "Pendente"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Organizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.organizationMemberships?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Atualmente membro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.twoFactorEnabled ? "🔒 2FA" : "🔓"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.twoFactorEnabled ? "Ativado" : "Desativado"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clerk User Profile Component */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações, senha, 2FA e configurações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "border-0 shadow-none",
                navbar: "hidden md:block",
                pageScrollBox: "p-0",
              },
            }}
          >
            {/* Custom pages no perfil */}
            <UserProfile.Page label="Preferências" labelIcon={<span>⚙️</span>} url="preferences">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Preferências do Sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Configure suas preferências de uso do AtlasReg
                </p>
                {/* Adicionar preferências customizadas aqui */}
              </div>
            </UserProfile.Page>

            <UserProfile.Page label="Atividade" labelIcon={<span>📊</span>} url="activity">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Atividade Recente</h3>
                <p className="text-sm text-muted-foreground">
                  Últimas ações realizadas no sistema
                </p>
                {/* Log de atividades */}
              </div>
            </UserProfile.Page>
          </UserProfile>
        </CardContent>
      </Card>

      {/* Organization Memberships */}
      {user?.organizationMemberships && user.organizationMemberships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Organizações</CardTitle>
            <CardDescription>
              Organizações das quais você faz parte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.organizationMemberships.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {membership.organization.imageUrl && (
                      <img
                        src={membership.organization.imageUrl}
                        alt={membership.organization.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{membership.organization.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {membership.role}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#00ADE8]/10 text-[#00ADE8] rounded-full text-xs font-medium">
                    {membership.role === 'org:admin' && 'Administrador'}
                    {membership.role === 'org:member' && 'Membro'}
                    {membership.role === 'org:viewer' && 'Visualizador'}
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
  );
}

