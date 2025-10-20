/**
 * Painel Executivo - AtlasReg by ness.
 * Dashboard principal com análises do mercado de energia
 * Dark mode first com dados reais do setor
 */

import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  Activity, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

import { KPICard } from '@/components/dashboard/kpi-card';
import { EventoCard } from '@/components/dashboard/evento-card';
import { ChartRAPEmpresas } from '@/components/dashboard/chart-rap-empresas';
import { ChartMultasEvolucao } from '@/components/dashboard/chart-multas-evolucao';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  getKPIsDashboard, 
  getTop10RAP, 
  getEventosRecentes,
  multasPor12Meses,
  insightsIA
} from '@/lib/mock-data/energia-mock';
import { formatarReal } from '@/lib/constants/energy-market';

export default function PainelExecutivo() {
  // Carregar dados
  const kpis = getKPIsDashboard();
  const top10 = getTop10RAP();
  const eventos = getEventosRecentes(10);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Painel Executivo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão 360° do setor de transmissão de energia elétrica brasileiro
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Última atualização: <span className="text-[#00ADE8]">há 5 minutos</span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          titulo="RAP Total do Setor"
          valor={formatarReal(kpis.rap_total)}
          variacao={kpis.rap_variacao}
          trend="up"
          icone={Building2}
          descricao="Receita Anual Permitida total"
        />
        
        <KPICard
          titulo="Novas Outorgas (Mês)"
          valor={kpis.novas_outorgas_mes.toString()}
          icone={FileText}
          valorSecundario={`${formatarReal(kpis.novas_outorgas_rap)} RAP/ano`}
          descricao="Concessões outorgadas em outubro"
        />
        
        <KPICard
          titulo="Multas Aplicadas (Mês)"
          valor={formatarReal(kpis.multas_mes)}
          variacao={kpis.multas_variacao}
          trend="down"  // Mais multas = negativo
          icone={AlertTriangle}
          descricao="Multas ANEEL em outubro"
        />
        
        <KPICard
          titulo="Eventos Críticos (Semana)"
          valor={kpis.eventos_criticos_semana.toString()}
          icone={Activity}
          descricao="Eventos de alta prioridade"
        />
        
        <KPICard
          titulo="M&A Volume (YTD)"
          valor={formatarReal(kpis.ma_volume_ytd)}
          icone={DollarSign}
          valorSecundario={`${kpis.ma_deals_ytd} transações`}
          descricao="Fusões e aquisições em 2025"
        />
        
        <KPICard
          titulo="Valor em Risco"
          valor={formatarReal(kpis.valor_risco_total)}
          icone={TrendingUp}
          descricao="Processos de fiscalização ativos"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartRAPEmpresas 
          dados={top10.map(t => ({ nome: t.nome || '', rap_anual: t.rap_anual || 0 }))} 
        />
        
        <ChartMultasEvolucao dados={multasPor12Meses} />
      </div>

      {/* Insights IA */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            💡 Insights da Semana
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Análises automáticas baseadas em IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insightsIA.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-muted/30 p-4 border border-border/20 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Indicador */}
                <div className={cn(
                  "mt-0.5 h-2 w-2 rounded-full flex-shrink-0",
                  insight.severidade === 'alta' && 'bg-red-500',
                  insight.severidade === 'media' && 'bg-yellow-500',
                  insight.severidade === 'baixa' && 'bg-blue-500',
                )} />
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {insight.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insight.descricao}
                  </p>
                  <p className="text-xs text-[#00ADE8] font-medium">
                    → {insight.acao_sugerida}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Timeline de Eventos */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium text-foreground">
                Timeline de Eventos
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Últimos 30 dias - eventos coletados e analisados
              </CardDescription>
            </div>
            
            {/* Filtros rápidos */}
            <Tabs defaultValue="todos" className="w-auto">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="regulatorio" className="text-xs">Regulatório</TabsTrigger>
                <TabsTrigger value="financeiro" className="text-xs">Financeiro</TabsTrigger>
                <TabsTrigger value="risco" className="text-xs">Risco</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
          
          {/* Ver mais */}
          <div className="text-center pt-2">
            <a 
              href="/dashboard/eventos" 
              className="text-sm text-[#00ADE8] hover:text-[#00ADE8]/80 font-medium transition-colors"
            >
              Ver todos os eventos →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
