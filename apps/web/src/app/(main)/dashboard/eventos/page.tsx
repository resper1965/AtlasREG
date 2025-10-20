/**
 * Página: Feed de Eventos - Visão Global
 * AtlasReg by ness. - Dark mode first
 */

import { Activity, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventoCard } from '@/components/dashboard/evento-card';
import { eventosRecentes } from '@/lib/mock-data/energia-mock';

export default function EventosPage() {
  const totalEventos = 245;  // Últimos 30 dias
  const eventosCriticos = 12;
  const eventosAlta = 45;
  const eventosMedia = 98;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Feed de Eventos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todos os eventos coletados e analisados - últimos 30 dias
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Rápidas */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/40 bg-card/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{totalEventos}</p>
              <p className="text-xs text-muted-foreground mt-1">Total de eventos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{eventosCriticos}</p>
              <p className="text-xs text-red-400 mt-1">Críticos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-orange-500/5 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{eventosAlta}</p>
              <p className="text-xs text-orange-400 mt-1">Alta prioridade</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">{eventosMedia}</p>
              <p className="text-xs text-yellow-400 mt-1">Média prioridade</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs por Categoria */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="bg-muted/50 w-full sm:w-auto">
          <TabsTrigger value="todos">Todos ({totalEventos})</TabsTrigger>
          <TabsTrigger value="regulatorio">Regulatório (89)</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro (76)</TabsTrigger>
          <TabsTrigger value="operacional">Operacional (52)</TabsTrigger>
          <TabsTrigger value="risco">Alto Risco (28)</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4 mt-6">
          {eventosRecentes.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
          
          {/* Paginação */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="regulatorio" className="mt-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Filtrado por categoria: Regulatório (89 eventos)
          </p>
        </TabsContent>
        
        <TabsContent value="financeiro" className="mt-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Filtrado por categoria: Financeiro (76 eventos)
          </p>
        </TabsContent>
        
        <TabsContent value="operacional" className="mt-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Filtrado por categoria: Operacional (52 eventos)
          </p>
        </TabsContent>
        
        <TabsContent value="risco" className="mt-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Filtrado por alto risco (28 eventos)
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

