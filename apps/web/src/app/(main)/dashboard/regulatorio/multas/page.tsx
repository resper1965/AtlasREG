/**
 * Página: Multas e PVs - Regulatório
 * AtlasReg by ness. - Dark mode first
 */

import { AlertTriangle, Building2, DollarSign, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ChartMultasEvolucao } from '@/components/dashboard/chart-multas-evolucao';
import { multasPor12Meses } from '@/lib/mock-data/energia-mock';
import { formatarReal } from '@/lib/constants/energy-market';

export default function MultasPage() {
  // Dados mockados de multas
  const multasAtivas = [
    {
      numero_pv: 'PV-2025-0234',
      empresa: 'Transmissora X',
      valor: 15000000,
      data_autuacao: '2025-10-15',
      tipo: 'Atraso de Obra',
      status: 'Ativo',
      dias_atraso: 180,
      projeto: 'LT 500kV Subestação A - B (230km)',
      probabilidade_condenacao: 85,
    },
    {
      numero_pv: 'PV-2025-0198',
      empresa: 'Transmissora Y',
      valor: 8500000,
      data_autuacao: '2025-09-22',
      tipo: 'Indisponibilidade de Ativos',
      status: 'Em Recurso',
      dias_indisponibilidade: 45,
      ativo: 'LT 230kV - Linha 3',
      probabilidade_condenacao: 60,
    },
    {
      numero_pv: 'PV-2025-0156',
      empresa: 'Copel Transmissão',
      valor: 3200000,
      data_autuacao: '2025-08-10',
      tipo: 'Questões Ambientais',
      status: 'Condenado',
      infracoes: 'Não conformidade ambiental',
      probabilidade_condenacao: 100,
    },
    {
      numero_pv: 'PV-2025-0089',
      empresa: 'Chesf',
      valor: 12000000,
      data_autuacao: '2025-06-15',
      tipo: 'Qualidade do Serviço',
      status: 'Em Análise',
      indice_qualidade: 'Abaixo do limite',
      probabilidade_condenacao: 70,
    },
  ];

  const totalMultasAtivas = multasAtivas.reduce((acc, m) => acc + m.valor, 0);
  const totalProcessos = 247;  // Total setor
  const taxaCondenacao = 68;  // % histórica

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Multas e Processos de Fiscalização
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise de multas aplicadas pela ANEEL - Processos de Fiscalização (PVs)
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          titulo="Multas do Mês (Out/25)"
          valor={formatarReal(45000000)}
          variacao={23}
          trend="down"
          icone={AlertTriangle}
          descricao="↑ 23% vs setembro"
        />
        
        <KPICard
          titulo="Processos Ativos"
          valor={totalProcessos.toString()}
          icone={Building2}
          valorSecundario={formatarReal(2100000000) + " em risco"}
          descricao="Todas as transmissoras"
        />
        
        <KPICard
          titulo="Taxa de Condenação"
          valor={`${taxaCondenacao}%`}
          icone={TrendingDown}
          descricao="Média histórica últimos 3 anos"
        />
        
        <KPICard
          titulo="Valor Médio/Multa"
          valor={formatarReal(580000)}
          icone={DollarSign}
          descricao="Baseado em 247 processos"
        />
      </div>

      {/* Gráfico Evolução */}
      <ChartMultasEvolucao dados={multasPor12Meses} />

      {/* Lista de Processos */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Processos de Fiscalização Ativos
          </CardTitle>
          <CardDescription>
            Principais PVs em andamento - ordem decrescente de valor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {multasAtivas.map((multa, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border/40 bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Esquerda: Info principal */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 font-mono">
                      {multa.numero_pv}
                    </Badge>
                    <Badge variant={
                      multa.status === 'Condenado' ? 'destructive' :
                      multa.status === 'Em Recurso' ? 'default' :
                      'outline'
                    }>
                      {multa.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {multa.empresa}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tipo: {multa.tipo} • Data: {new Date(multa.data_autuacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {/* Detalhes */}
                  <div className="text-xs text-muted-foreground">
                    {multa.projeto && <p>Projeto: {multa.projeto}</p>}
                    {multa.dias_atraso && <p>Atraso: {multa.dias_atraso} dias</p>}
                    {multa.ativo && <p>Ativo: {multa.ativo}</p>}
                  </div>
                </div>
                
                {/* Direita: Valor e Risco */}
                <div className="text-right space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="text-lg font-semibold text-red-500">
                      {formatarReal(multa.valor)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prob. Condenação</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${multa.probabilidade_condenacao}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {multa.probabilidade_condenacao}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Ver mais */}
          <div className="text-center pt-2">
            <button className="text-sm text-[#00ADE8] hover:text-[#00ADE8]/80 font-medium">
              Ver todos os {totalProcessos} processos →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

