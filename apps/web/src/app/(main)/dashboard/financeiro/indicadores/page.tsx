import { Metadata } from 'next';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Indicadores Setoriais | AtlasReg',
  description: 'Indicadores e benchmarks do setor de transmissão',
};

export default function IndicadoresSetoriaisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-[#00ADE8]" />
          Indicadores Setoriais
        </h1>
        <p className="text-muted-foreground mt-2">
          Benchmarks e indicadores agregados do setor de transmissão
        </p>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RAP Total Setor</p>
                <p className="text-3xl font-bold text-[#00ADE8]">R$ 23,5 Bi</p>
              </div>
              <DollarSign className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-green-400 mt-2">↑ 5.2% vs 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">EBITDA Margin Médio</p>
              <p className="text-3xl font-bold text-foreground">85%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Média ponderada</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">ROE Médio</p>
              <p className="text-3xl font-bold text-foreground">10.5%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Acima WACC (8.92%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Disponibilidade</p>
              <p className="text-3xl font-bold text-green-400">98.5%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Meta: 99%</p>
          </CardContent>
        </Card>
      </div>

      {/* Operacionais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Indicadores Operacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Extensão da Rede</p>
              <p className="text-2xl font-bold text-foreground">185 mil km</p>
              <p className="text-xs text-muted-foreground mt-1">Linhas de transmissão</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Subestações</p>
              <p className="text-2xl font-bold text-foreground">3.500</p>
              <p className="text-xs text-muted-foreground mt-1">Total no país</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Capacidade</p>
              <p className="text-2xl font-bold text-foreground">400 mil MVA</p>
              <p className="text-xs text-muted-foreground mt-1">Transformação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROE Médio</span>
                <span className="text-lg font-semibold text-foreground">10.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">WACC Regulatório</span>
                <span className="text-lg font-semibold text-foreground">8.92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Spread Médio</span>
                <span className="text-lg font-semibold text-green-400">+1.58 p.p.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">EBITDA Margin</span>
                <span className="text-lg font-semibold text-foreground">85.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alavancagem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dívida/EBITDA Médio</span>
                <span className="text-lg font-semibold text-foreground">3.8x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conservador</span>
                <span className="text-lg font-semibold text-green-400">≤ 2.5x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Moderado</span>
                <span className="text-lg font-semibold text-blue-400">3.5x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Agressivo</span>
                <span className="text-lg font-semibold text-orange-400">≥ 5.0x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crescimento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crescimento e Expansão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-sm text-muted-foreground mb-2">Crescimento RAP</p>
              <p className="text-2xl font-bold text-green-400">+5.2%</p>
              <p className="text-xs text-muted-foreground mt-1">Anual</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-sm text-muted-foreground mb-2">Expansão Rede</p>
              <p className="text-2xl font-bold text-foreground">2.800 km</p>
              <p className="text-xs text-muted-foreground mt-1">Por ano</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-sm text-muted-foreground mb-2">Investimento</p>
              <p className="text-2xl font-bold text-foreground">R$ 8,5 Bi</p>
              <p className="text-xs text-muted-foreground mt-1">CAPEX 2025</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-sm text-muted-foreground mb-2">Novos Projetos</p>
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-xs text-muted-foreground mt-1">Em construção</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benchmarks Internacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">País</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">ROE</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">EBITDA Margin</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Disponibilidade</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Múltiplo M&A</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { pais: 'Brasil', roe: 10.5, ebitda: 85.0, disp: 98.5, multiplo: 13.2 },
                  { pais: 'EUA', roe: 9.8, ebitda: 82.5, disp: 99.1, multiplo: 12.5 },
                  { pais: 'Chile', roe: 11.2, ebitda: 86.5, disp: 98.8, multiplo: 14.0 },
                  { pais: 'Colômbia', roe: 10.0, ebitda: 83.8, disp: 98.2, multiplo: 12.8 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-3 px-2 font-medium text-foreground">{row.pais}</td>
                    <td className="text-center text-sm text-foreground px-2">{row.roe.toFixed(1)}%</td>
                    <td className="text-center text-sm text-foreground px-2">{row.ebitda.toFixed(1)}%</td>
                    <td className="text-center text-sm text-foreground px-2">{row.disp.toFixed(1)}%</td>
                    <td className="text-center text-sm text-foreground px-2">{row.multiplo.toFixed(1)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

