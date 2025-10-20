import { Metadata } from 'next';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Disponibilidade | AtlasReg',
  description: 'Índices de disponibilidade e ocorrências',
};

export default function DisponibilidadePage() {
  // Mock: Disponibilidade por empresa
  const disponibilidades = TOP_TRANSMISSORAS.slice(0, 12).map((emp, idx) => ({
    ...emp,
    disponibilidade: 98 + Math.random() * 2 - 0.5,
    meta: 99,
    ocorrencias: Math.floor(Math.random() * 15),
    tempoIndisponibilidade: Math.floor(Math.random() * 100) + 10,
  }));

  const mediaSetor = disponibilidades.reduce((acc, e) => acc + e.disponibilidade, 0) / disponibilidades.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Activity className="h-8 w-8 text-[#00ADE8]" />
          Disponibilidade Operacional
        </h1>
        <p className="text-muted-foreground mt-2">
          Índices de disponibilidade e ocorrências do ONS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média Setor</p>
                <p className="text-3xl font-bold text-[#00ADE8]">{mediaSetor.toFixed(2)}%</p>
              </div>
              <Activity className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Últimos 12 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Acima da Meta</p>
              <p className="text-3xl font-bold text-green-400">8</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">De 12 empresas (67%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Abaixo da Meta</p>
              <p className="text-3xl font-bold text-orange-400">4</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Risco de penalização</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Ocorrências Out/25</p>
              <p className="text-3xl font-bold text-foreground">142</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">↓ 8% vs set/25</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Disponibilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disponibilidade por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Disponibilidade</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Meta</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Status</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Ocorrências</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Indisponibilidade</th>
                </tr>
              </thead>
              <tbody>
                {disponibilidades.map((emp, idx) => {
                  const acimaMeta = emp.disponibilidade >= emp.meta;
                  return (
                    <tr key={emp.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{emp.nome}</p>
                          <p className="text-xs text-muted-foreground">RAP: R$ {emp.rapAnual.toFixed(0)}M</p>
                        </div>
                      </td>
                      <td className="text-center px-2">
                        <p className={`text-lg font-bold ${
                          acimaMeta ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {emp.disponibilidade.toFixed(2)}%
                        </p>
                      </td>
                      <td className="text-center text-sm text-muted-foreground px-2">
                        {emp.meta.toFixed(0)}%
                      </td>
                      <td className="text-center px-2">
                        {acimaMeta ? (
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-green-400">OK</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <AlertCircle className="h-4 w-4 text-orange-400" />
                            <span className="text-xs text-orange-400">Atenção</span>
                          </div>
                        )}
                      </td>
                      <td className="text-center px-2">
                        <Badge variant="outline" className="text-xs">
                          {emp.ocorrencias}
                        </Badge>
                      </td>
                      <td className="text-center text-sm text-muted-foreground px-2">
                        {emp.tempoIndisponibilidade}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ocorrências Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ocorrências Recentes (ONS)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: 1,
                data: '2025-10-17',
                empresa: 'Taesa',
                tipo: 'Desligamento Programado',
                duracao: '4h',
                impacto: 'Baixo',
              },
              {
                id: 2,
                data: '2025-10-16',
                empresa: 'ISA CTEEP',
                tipo: 'Falha Equipamento',
                duracao: '12h',
                impacto: 'Médio',
              },
              {
                id: 3,
                data: '2025-10-15',
                empresa: 'Copel',
                tipo: 'Manutenção Emergencial',
                duracao: '8h',
                impacto: 'Alto',
              },
              {
                id: 4,
                data: '2025-10-14',
                empresa: 'Terna',
                tipo: 'Desligamento Programado',
                duracao: '6h',
                impacto: 'Baixo',
              },
            ].map((ocorrencia) => (
              <div key={ocorrencia.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/40">
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  {ocorrencia.data}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{ocorrencia.empresa}</p>
                  <p className="text-xs text-muted-foreground">{ocorrencia.tipo}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ocorrencia.duracao}
                </Badge>
                <Badge className={`
                  ${ocorrencia.impacto === 'Alto' ? 'bg-red-500/10 text-red-400' : ''}
                  ${ocorrencia.impacto === 'Médio' ? 'bg-orange-500/10 text-orange-400' : ''}
                  ${ocorrencia.impacto === 'Baixo' ? 'bg-blue-500/10 text-blue-400' : ''}
                `}>
                  {ocorrencia.impacto}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

