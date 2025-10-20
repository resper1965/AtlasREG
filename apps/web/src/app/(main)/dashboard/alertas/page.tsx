import { Metadata } from 'next';
import { Bell, AlertTriangle, Info, CheckCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Alertas | AtlasReg',
  description: 'Central de notificações e alertas',
};

export default function AlertasPage() {
  const alertas = [
    {
      id: 1,
      tipo: 'critico',
      titulo: 'Multa de R$ 15M aplicada à Taesa',
      descricao: 'ANEEL aplicou multa por atraso em obra da LT 500kV. Prazo para recurso: 30 dias.',
      timestamp: '2h atrás',
      lido: false,
    },
    {
      id: 2,
      tipo: 'importante',
      titulo: 'Nova outorga concedida - R$ 95M RAP/ano',
      descricao: 'ANEEL concedeu outorga para LT 230kV. Oportunidade para análise de M&A.',
      timestamp: '5h atrás',
      lido: false,
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Reajuste tarifário aprovado - Copel +4.1%',
      descricao: 'Reajuste aprovado pela ANEEL. Impacto positivo no ROE estimado.',
      timestamp: '1 dia atrás',
      lido: true,
    },
    {
      id: 4,
      tipo: 'sucesso',
      titulo: 'Sua watchlist "Taesa" teve nova atividade',
      descricao: '3 novos eventos relacionados à Taesa nas últimas 24h.',
      timestamp: '1 dia atrás',
      lido: true,
    },
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'importante':
        return <Bell className="h-4 w-4 text-[#00ADE8]" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'sucesso':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      critico: { bg: 'bg-red-500/10', text: 'text-red-400' },
      importante: { bg: 'bg-[#00ADE8]/10', text: 'text-[#00ADE8]' },
      info: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      sucesso: { bg: 'bg-green-500/10', text: 'text-green-400' },
    };
    return variants[tipo] || variants.info;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-[#00ADE8]" />
            Alertas e Notificações
          </h1>
          <p className="text-muted-foreground mt-2">
            Central de notificações sobre eventos críticos do setor
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Alertas
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Críticos</p>
                <p className="text-2xl font-bold text-red-400">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#00ADE8]/20 bg-[#00ADE8]/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Importantes</p>
                <p className="text-2xl font-bold text-[#00ADE8]">5</p>
              </div>
              <Bell className="h-8 w-8 text-[#00ADE8] opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Informativos</p>
                <p className="text-2xl font-bold text-blue-400">12</p>
              </div>
              <Info className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Não Lidos</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos (19)</TabsTrigger>
          <TabsTrigger value="nao-lidos">Não Lidos (8)</TabsTrigger>
          <TabsTrigger value="criticos">Críticos (2)</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-3">
          {alertas.map((alerta) => (
            <Card
              key={alerta.id}
              className={`cursor-pointer transition-all hover:border-[#00ADE8]/40 ${
                !alerta.lido ? 'border-[#00ADE8]/20 bg-[#00ADE8]/5' : 'opacity-70'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTipoIcon(alerta.tipo)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!alerta.lido && (
                            <div className="h-2 w-2 rounded-full bg-[#00ADE8]" />
                          )}
                          <h3 className="font-semibold text-foreground">{alerta.titulo}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                      </div>
                      <Badge
                        className={`${getTipoBadge(alerta.tipo).bg} ${getTipoBadge(alerta.tipo).text} border-0`}
                      >
                        {alerta.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{alerta.timestamp}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Marcar como lido
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#00ADE8]">
                          Ver detalhes →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="nao-lidos">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Filtro: Apenas alertas não lidos
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criticos">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Filtro: Apenas alertas críticos
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quando e como receber alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Multas e PVs</p>
                  <p className="text-xs text-muted-foreground">Notificar sobre processos de fiscalização</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Decisões Regulatórias</p>
                  <p className="text-xs text-muted-foreground">Alertas sobre decisões da ANEEL</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">M&A e Transações</p>
                  <p className="text-xs text-muted-foreground">Notificações sobre fusões e aquisições</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Minhas Watchlists</p>
                  <p className="text-xs text-muted-foreground">Eventos relacionados às empresas monitoradas</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Digest Diário</p>
                  <p className="text-xs text-muted-foreground">Resumo diário por email (8h)</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

