/**
 * Página: RAP por Empresa - Financeiro
 * AtlasReg by ness. - Dark mode first
 */

import { Building2, TrendingUp, Percent, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ChartRAPEmpresas } from '@/components/dashboard/chart-rap-empresas';
import { top10Transmissoras, indicadoresSetor } from '@/lib/mock-data/energia-mock';
import { formatarReal, formatarPercentual } from '@/lib/constants/energy-market';

export default function RAPPage() {
  const rapTotal = indicadoresSetor.rap_total_setor;
  const crescimentoAnual = 5.2;  // %
  const numeroEmpresas = 120;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          RAP por Empresa
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receita Anual Permitida (RAP) - Análise detalhada por transmissora
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          titulo="RAP Total do Setor"
          valor={formatarReal(rapTotal)}
          variacao={crescimentoAnual}
          trend="up"
          icone={DollarSign}
          descricao="Receita anual permitida total"
        />
        
        <KPICard
          titulo="Número de Transmissoras"
          valor={numeroEmpresas.toString()}
          icone={Building2}
          descricao="Empresas autorizadas ANEEL"
        />
        
        <KPICard
          titulo="RAP Médio/Empresa"
          valor={formatarReal(rapTotal / numeroEmpresas)}
          icone={TrendingUp}
          descricao="Média do setor"
        />
        
        <KPICard
          titulo="Concentração Top 10"
          valor="58%"
          icone={Percent}
          descricao="Top 10 representa 58% do RAP total"
        />
      </div>

      {/* Gráfico Principal */}
      <ChartRAPEmpresas 
        dados={top10Transmissoras.map(t => ({ 
          nome: t.nome || '', 
          rap_anual: t.rap_anual || 0 
        }))} 
      />

      {/* Tabela Detalhada */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Top 10 Transmissoras - Detalhamento
          </CardTitle>
          <CardDescription>
            RAP, infraestrutura e indicadores financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 text-xs text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium">Grupo</th>
                  <th className="text-right py-3 px-4 font-medium">RAP Anual</th>
                  <th className="text-right py-3 px-4 font-medium">% Setor</th>
                  <th className="text-right py-3 px-4 font-medium">Linhas (km)</th>
                  <th className="text-right py-3 px-4 font-medium">EBITDA%</th>
                  <th className="text-right py-3 px-4 font-medium">ROE%</th>
                  <th className="text-center py-3 px-4 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {top10Transmissoras.map((empresa, idx) => {
                  const participacao = ((empresa.rap_anual || 0) / rapTotal * 100);
                  
                  return (
                    <tr 
                      key={idx}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{empresa.nome}</p>
                          {empresa.ticker_b3 && (
                            <p className="text-xs text-[#00ADE8]">{empresa.ticker_b3}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {empresa.grupo_economico}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">
                        {formatarReal(empresa.rap_anual || 0)}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {participacao.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {(empresa.linhas_km || 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-green-500 font-medium">
                          {empresa.ebitda_margin?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={
                          (empresa.roe || 0) > 10 ? 'text-green-500' : 'text-yellow-500'
                        }>
                          {empresa.roe?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {empresa.rating_credito && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {empresa.rating_credito}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise Setorial */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            💡 Análise Setorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted/30 p-4 border border-border/20">
            <p className="text-sm text-foreground mb-2">
              <strong>Concentração de Mercado:</strong> As Top 10 transmissoras concentram 58% do RAP total do setor (R$ 13,6 Bi dos R$ 23,5 Bi).
            </p>
            <p className="text-xs text-muted-foreground">
              Taesa e ISA CTEEP juntas representam 28,5% do mercado.
            </p>
          </div>
          
          <div className="rounded-lg bg-muted/30 p-4 border border-border/20">
            <p className="text-sm text-foreground mb-2">
              <strong>Crescimento:</strong> RAP total cresceu 5,2% em 2025 (vs 4,8% em 2024), impulsionado por novas outorgas e reajuste IGP-M de 4,2%.
            </p>
            <p className="text-xs text-muted-foreground">
              Espera-se expansão de 2.800 km de novas linhas em 2025.
            </p>
          </div>
          
          <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
            <p className="text-sm text-green-500 mb-2">
              <strong>Performance Financeira:</strong> Margens EBITDA médias de 85% confirmam rentabilidade elevada do setor de transmissão.
            </p>
            <p className="text-xs text-green-400/80">
              ROE médio de 10,5% supera WACC regulatório de 8,92% em 1,58 p.p., indicando geração de valor.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

