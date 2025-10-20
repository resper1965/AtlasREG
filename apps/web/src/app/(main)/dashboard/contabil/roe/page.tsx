import { Metadata } from 'next';
import { Percent, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'ROE e Rentabilidade | AtlasReg',
  description: 'Return on Equity e análise de rentabilidade',
};

export default function ROEPage() {
  // Ordenar por ROE
  const empresasPorROE = [...TOP_TRANSMISSORAS].sort((a, b) => b.roe - a.roe);
  
  const roeMediaSetor = TOP_TRANSMISSORAS.reduce((acc, e) => acc + e.roe, 0) / TOP_TRANSMISSORAS.length;
  const waccRegulatorio = 8.92;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Percent className="h-8 w-8 text-[#00ADE8]" />
          ROE e Rentabilidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Return on Equity e análise de geração de valor para acionistas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROE Médio Setor</p>
                <p className="text-3xl font-bold text-[#00ADE8]">{roeMediaSetor.toFixed(1)}%</p>
              </div>
              <Percent className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Média ponderada</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">WACC Regulatório</p>
              <p className="text-3xl font-bold text-foreground">{waccRegulatorio.toFixed(2)}%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Custo de capital</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Spread Médio</p>
              <p className="text-3xl font-bold text-green-400">+{(roeMediaSetor - waccRegulatorio).toFixed(1)} p.p.</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">ROE - WACC</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Acima do WACC</p>
              <p className="text-3xl font-bold text-green-400">
                {empresasPorROE.filter(e => e.roe > waccRegulatorio).length}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">De {empresasPorROE.length} empresas</p>
          </CardContent>
        </Card>
      </div>

      {/* Metodologia */}
      <Card className="border-[#00ADE8]/20 bg-[#00ADE8]/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-[#00ADE8]" />
            Metodologia de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>ROE (Return on Equity):</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                ROE = Lucro Líquido / Patrimônio Líquido × 100
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Indica o retorno gerado para os acionistas sobre o capital investido.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>WACC (Custo de Capital):</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Taxa regulatória definida pela ANEEL (8.92% real)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Benchmark mínimo para remuneração do capital investido.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>Spread (Geração de Valor):</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Spread = ROE - WACC
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Spread positivo indica geração de valor acima do custo de capital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking de ROE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking por ROE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Ranking</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">ROE</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">vs WACC</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Spread</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">RAP Anual</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Avaliação</th>
                </tr>
              </thead>
              <tbody>
                {empresasPorROE.map((emp, idx) => {
                  const spread = emp.roe - waccRegulatorio;
                  const acimaWACC = emp.roe > waccRegulatorio;
                  
                  return (
                    <tr key={emp.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-muted-foreground">
                            #{idx + 1}
                          </span>
                          {idx < 3 && (
                            <Award className={`h-4 w-4 ${
                              idx === 0 ? 'text-yellow-400' :
                              idx === 1 ? 'text-gray-400' :
                              'text-orange-400'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{emp.nome}</p>
                          <p className="text-xs text-muted-foreground">{emp.grupo}</p>
                        </div>
                      </td>
                      <td className="text-center px-2">
                        <p className={`text-lg font-bold ${
                          emp.roe >= 11 ? 'text-green-400' :
                          emp.roe >= 10 ? 'text-blue-400' :
                          emp.roe >= 9 ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          {emp.roe.toFixed(1)}%
                        </p>
                      </td>
                      <td className="text-center px-2">
                        {acimaWACC ? (
                          <TrendingUp className="h-5 w-5 text-green-400 mx-auto" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-red-400 mx-auto rotate-180" />
                        )}
                      </td>
                      <td className="text-center px-2">
                        <Badge className={`
                          ${spread >= 2 ? 'bg-green-500/10 text-green-400' : ''}
                          ${spread >= 1 && spread < 2 ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${spread >= 0 && spread < 1 ? 'bg-orange-500/10 text-orange-400' : ''}
                          ${spread < 0 ? 'bg-red-500/10 text-red-400' : ''}
                        `}>
                          {spread > 0 ? '+' : ''}{spread.toFixed(2)} p.p.
                        </Badge>
                      </td>
                      <td className="text-right text-sm text-foreground px-2">
                        R$ {emp.rapAnual.toFixed(0)}M
                      </td>
                      <td className="text-center px-2">
                        {spread >= 2 ? (
                          <Badge variant="outline" className="text-green-400 border-green-400/40">
                            Excelente
                          </Badge>
                        ) : spread >= 1 ? (
                          <Badge variant="outline" className="text-blue-400 border-blue-400/40">
                            Bom
                          </Badge>
                        ) : spread >= 0 ? (
                          <Badge variant="outline" className="text-orange-400 border-orange-400/40">
                            Regular
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-400 border-red-400/40">
                            Abaixo
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

      {/* Distribuição */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribuição de ROE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-2">ROE ≥ 11%</p>
              <p className="text-3xl font-bold text-green-400">
                {empresasPorROE.filter(e => e.roe >= 11).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">empresas</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-muted-foreground mb-2">ROE 10-11%</p>
              <p className="text-3xl font-bold text-blue-400">
                {empresasPorROE.filter(e => e.roe >= 10 && e.roe < 11).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">empresas</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-muted-foreground mb-2">ROE 9-10%</p>
              <p className="text-3xl font-bold text-orange-400">
                {empresasPorROE.filter(e => e.roe >= 9 && e.roe < 10).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">empresas</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-muted-foreground mb-2">ROE {'<'} 9%</p>
              <p className="text-3xl font-bold text-red-400">
                {empresasPorROE.filter(e => e.roe < 9).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">empresas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

