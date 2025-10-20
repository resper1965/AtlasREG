import { Metadata } from 'next';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Valuation | AtlasReg',
  description: 'Valuation e múltiplos de transmissoras',
};

export default function ValuationPage() {
  // Mock: Múltiplos de valuation
  const empresasValuation = TOP_TRANSMISSORAS.slice(0, 15).map((emp, idx) => ({
    ...emp,
    evEbitda: 12.5 + Math.random() * 5 - 2.5,
    pRap: 1.1 + Math.random() * 0.3,
    valorMercado: emp.rapAnual * (1.1 + Math.random() * 0.3),
    dividendYield: 4.5 + Math.random() * 3,
  }));

  const mediaSetorEvEbitda = empresasValuation.reduce((acc, e) => acc + e.evEbitda, 0) / empresasValuation.length;
  const mediaSetorPRap = empresasValuation.reduce((acc, e) => acc + e.pRap, 0) / empresasValuation.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-[#00ADE8]" />
          Valuation e Múltiplos
        </h1>
        <p className="text-muted-foreground mt-2">
          Análise de múltiplos e valuation de transmissoras
        </p>
      </div>

      {/* Médias do Setor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EV/EBITDA Médio</p>
                <p className="text-3xl font-bold text-[#00ADE8]">{mediaSetorEvEbitda.toFixed(1)}x</p>
              </div>
              <TrendingUp className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Setor transmissão</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">P/RAP Médio</p>
              <p className="text-3xl font-bold text-foreground">{mediaSetorPRap.toFixed(2)}x</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Múltiplo específico</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Dividend Yield</p>
              <p className="text-3xl font-bold text-green-400">6.2%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Média ponderada</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Cap. Mercado</p>
              <p className="text-3xl font-bold text-foreground">R$ 89 Bi</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Top 15 empresas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Múltiplos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Múltiplos por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">RAP Anual</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">Valor Mercado</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">EV/EBITDA</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">P/RAP</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">DY (%)</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {empresasValuation.map((emp, idx) => (
                  <tr key={emp.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.nome}</p>
                        <p className="text-xs text-muted-foreground">{emp.roe.toFixed(1)}% ROE</p>
                      </div>
                    </td>
                    <td className="text-right text-sm text-foreground px-2">
                      R$ {emp.rapAnual.toFixed(0)}M
                    </td>
                    <td className="text-right text-sm text-foreground px-2">
                      R$ {emp.valorMercado.toFixed(0)}M
                    </td>
                    <td className="text-right px-2">
                      <Badge className={`
                        ${emp.evEbitda > mediaSetorEvEbitda ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}
                      `}>
                        {emp.evEbitda.toFixed(1)}x
                      </Badge>
                    </td>
                    <td className="text-right px-2">
                      <Badge className={`
                        ${emp.pRap > mediaSetorPRap ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}
                      `}>
                        {emp.pRap.toFixed(2)}x
                      </Badge>
                    </td>
                    <td className="text-right text-sm text-foreground px-2">
                      {emp.dividendYield.toFixed(1)}%
                    </td>
                    <td className="text-right px-2">
                      {emp.evEbitda < mediaSetorEvEbitda ? (
                        <Badge variant="outline" className="text-green-400 border-green-400/40">
                          Barato
                        </Badge>
                      ) : emp.evEbitda > mediaSetorEvEbitda + 2 ? (
                        <Badge variant="outline" className="text-orange-400 border-orange-400/40">
                          Caro
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-blue-400 border-blue-400/40">
                          Justo
                        </Badge>
                      )}
                    </td>
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

