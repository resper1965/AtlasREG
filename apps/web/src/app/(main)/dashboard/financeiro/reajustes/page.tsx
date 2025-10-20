import { Metadata } from 'next';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Reajustes Tarifários | AtlasReg',
  description: 'Reajustes tarifários aprovados pela ANEEL',
};

export default function ReajustesTarifariosPage() {
  // Mock: Reajustes 2025
  const reajustes = [
    {
      id: 1,
      empresa: 'Copel',
      percentual: 4.1,
      data_aprovacao: '2025-10-08',
      vigencia: '2025-11-01',
      base: 'IGP-M',
      impacto_receita: 74,
      rap_anterior: 1800,
      rap_novo: 1874,
    },
    {
      id: 2,
      empresa: 'Taesa',
      percentual: 3.8,
      data_aprovacao: '2025-09-15',
      vigencia: '2025-10-01',
      base: 'IGP-M',
      impacto_receita: 133,
      rap_anterior: 3500,
      rap_novo: 3633,
    },
    {
      id: 3,
      empresa: 'ISA CTEEP',
      percentual: 4.3,
      data_aprovacao: '2025-08-22',
      vigencia: '2025-09-01',
      base: 'IGP-M',
      impacto_receita: 138,
      rap_anterior: 3200,
      rap_novo: 3338,
    },
    {
      id: 4,
      empresa: 'Eletronorte',
      percentual: 3.5,
      data_aprovacao: '2025-07-10',
      vigencia: '2025-08-01',
      base: 'IGP-M',
      impacto_receita: 42,
      rap_anterior: 1200,
      rap_novo: 1242,
    },
  ];

  const totalImpacto = reajustes.reduce((acc, r) => acc + r.impacto_receita, 0);
  const percentualMedio = reajustes.reduce((acc, r) => acc + r.percentual, 0) / reajustes.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-[#00ADE8]" />
          Reajustes Tarifários
        </h1>
        <p className="text-muted-foreground mt-2">
          Reajustes aprovados pela ANEEL baseados em índices econômicos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Percentual Médio</p>
                <p className="text-3xl font-bold text-[#00ADE8]">{percentualMedio.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">2025 YTD</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Impacto Total</p>
              <p className="text-3xl font-bold text-green-400">R$ {totalImpacto}M</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Incremento receita anual</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Aprovados 2025</p>
              <p className="text-3xl font-bold text-foreground">{reajustes.length}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Até outubro</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Próximos 30d</p>
              <p className="text-3xl font-bold text-orange-400">8</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Previstos</p>
          </CardContent>
        </Card>
      </div>

      {/* Metodologia */}
      <Card className="border-[#00ADE8]/20 bg-[#00ADE8]/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#00ADE8]" />
            Metodologia de Reajuste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>Base de Cálculo:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                IGP-M acumulado 12 meses + componentes de custos operacionais (OPEX) e investimentos (CAPEX)
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>Periodicidade:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Anual, com data-base específica por contrato de concessão
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                <strong>Vigência:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Início conforme aprovação ANEEL, geralmente no mês seguinte
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Reajustes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reajustes Aprovados 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Percentual</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Base</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Aprovação</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Vigência</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">RAP Anterior</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">RAP Novo</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {reajustes.map((reajuste) => (
                  <tr key={reajuste.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium text-foreground">{reajuste.empresa}</p>
                    </td>
                    <td className="text-center px-2">
                      <Badge className="bg-green-500/10 text-green-400">
                        +{reajuste.percentual.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="text-center text-sm text-muted-foreground px-2">
                      {reajuste.base}
                    </td>
                    <td className="text-center text-sm text-muted-foreground px-2">
                      {new Date(reajuste.data_aprovacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-center text-sm text-muted-foreground px-2">
                      {new Date(reajuste.vigencia).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-right text-sm text-muted-foreground px-2">
                      R$ {reajuste.rap_anterior}M
                    </td>
                    <td className="text-right text-sm font-semibold text-foreground px-2">
                      R$ {reajuste.rap_novo}M
                    </td>
                    <td className="text-right px-2">
                      <span className="text-sm font-semibold text-green-400">
                        +R$ {reajuste.impacto_receita}M
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border/60">
                  <td colSpan={7} className="py-3 px-2 text-right text-sm font-medium text-muted-foreground">
                    Total Impacto:
                  </td>
                  <td className="text-right py-3 px-2">
                    <span className="text-base font-bold text-green-400">
                      +R$ {totalImpacto}M/ano
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Histórico IGP-M */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico IGP-M (Base de Reajuste)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { periodo: '2025 (Out)', valor: 3.9, variacao: 0.2 },
              { periodo: '2024', valor: 3.7, variacao: -4.5 },
              { periodo: '2023', valor: 8.2, variacao: 3.1 },
              { periodo: '2022', valor: 5.1, variacao: -5.2 },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                <p className="text-xs text-muted-foreground mb-1">{item.periodo}</p>
                <p className="text-xl font-bold text-foreground">{item.valor.toFixed(1)}%</p>
                <p className={`text-xs ${item.variacao > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.variacao > 0 ? '↑' : '↓'} {Math.abs(item.variacao).toFixed(1)} p.p.
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

