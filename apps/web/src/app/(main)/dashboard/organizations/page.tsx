import { auth } from "@clerk/nextjs/server";
import { OrganizationList, OrganizationProfile } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function OrganizationsPage() {
  const { orgId, orgRole } = await auth();

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
          {orgId ? (
            <Card>
              <CardHeader>
                <CardTitle>Perfil da Organização</CardTitle>
                <CardDescription>
                  Gerencie configurações, membros e permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrganizationProfile
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "border-0 shadow-none",
                    },
                  }}
                />
              </CardContent>
            </Card>
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
              <OrganizationList
                hidePersonal={false}
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "border-0 shadow-none",
                  },
                }}
                afterCreateOrganizationUrl="/dashboard/organizations"
                afterSelectOrganizationUrl="/dashboard/default"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Info */}
      {orgRole && (
        <Card>
          <CardHeader>
            <CardTitle>Seu Papel na Organização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#00ADE8] text-white rounded-full text-sm font-medium">
                {orgRole}
              </span>
              <span className="text-sm text-muted-foreground">
                {orgRole === 'org:admin' && 'Acesso total e gerenciamento de membros'}
                {orgRole === 'org:member' && 'Acesso aos recursos da organização'}
                {orgRole === 'org:viewer' && 'Apenas visualização'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

