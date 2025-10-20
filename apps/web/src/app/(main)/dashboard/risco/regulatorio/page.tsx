import { Metadata } from 'next';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Risco Regulatório | AtlasReg',
  description: 'Análise de risco regulatório por empresa',
};

export default function RiscoRegulatorioPage() {
  // Mock: Score de risco por empresa
  const empresasRisco = TOP_TRANSMISSORAS.slice(0, 15).map((emp, idx) => ({
    ...emp,
    scoreRegulatório: Math.floor(20 + Math.random() * 60),
    multasUltimos12M: Math.floor(Math.random() * 50),
    pvsAbertos: Math.floor(Math.random() * 8),
    disponibilidade: 98 + Math.random() * 2,
  }));

  const calcularNivelRisco = (score: number) => {
    if (score >= 70) return { nivel: 'Alto', cor: 'red' };
    if (score >= 40) return { nivel: 'Médio', cor: 'orange' };
    return { nivel: 'Baixo', cor: 'green' };
  };

  const totalAltoRisco = empresasRisco.filter(e => e.scoreRegulatório >= 70).length;
  const totalMedioRisco = empresasRisco.filter(e => e.scoreRegulatório >= 40 && e.scoreRegulatório < 70).length;
  const totalBaixoRisco = empresasRisco.filter(e => e.scoreRegulatório < 40).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#00ADE8]" />
          Risco Regulatório
        </h1>
        <p className="text-muted-foreground mt-2">
          Score de risco calculado com base em multas, PVs e disponibilidade
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alto Risco</p>
                <p className="text-3xl font-bold text-red-400">{totalAltoRisco}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-400 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score ≥ 70</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Médio Risco</p>
              <p className="text-3xl font-bold text-orange-400">{totalMedioRisco}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score 40-69</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Baixo Risco</p>
              <p className="text-3xl font-bold text-green-400">{totalBaixoRisco}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Score {'<'} 40</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Multas 12M</p>
              <p className="text-3xl font-bold text-foreground">
                R$ {empresasRisco.reduce((acc, e) => acc + e.multasUltimos12M, 0)}M
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total do setor</p>
          </CardContent>
        </Card>
      </div>

      {/* Metodologia */}
      <Card className="border-[#00ADE8]/20 bg-[#00ADE8]/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#00ADE8]" />
            Metodologia de Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">🔴 <strong>Multas e PVs</strong> (50%)</p>
              <p className="text-xs text-muted-foreground">
                Número e valor de multas nos últimos 12 meses + PVs abertos
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">⚡ <strong>Disponibilidade</strong> (30%)</p>
              <p className="text-xs text-muted-foreground">
                Índice de disponibilidade vs meta regulatória (99%)
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">📋 <strong>Histórico</strong> (20%)</p>
              <p className="text-xs text-muted-foreground">
                Tendência histórica de conformidade regulatória
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking de Risco */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking de Risco por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Ranking</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Score</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Nível</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Multas 12M</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">PVs Abertos</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Disponibilidade</th>
                </tr>
              </thead>
              <tbody>
                {empresasRisco
                  .sort((a, b) => b.scoreRegulatório - a.scoreRegulatório)
                  .map((emp, idx) => {
                    const risco = calcularNivelRisco(emp.scoreRegulatório);
                    return (
                      <tr key={emp.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          <span className="text-sm font-bold text-muted-foreground">
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{emp.nome}</p>
                            <p className="text-xs text-muted-foreground">RAP: R$ {emp.rapAnual.toFixed(0)}M</p>
                          </div>
                        </td>
                        <td className="text-center px-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex-1 bg-muted/30 rounded-full h-2 max-w-[80px]">
                              <div
                                className={`h-2 rounded-full ${
                                  risco.cor === 'red' ? 'bg-red-400' : 
                                  risco.cor === 'orange' ? 'bg-orange-400' : 
                                  'bg-green-400'
                                }`}
                                style={{ width: `${emp.scoreRegulatório}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${
                              risco.cor === 'red' ? 'text-red-400' : 
                              risco.cor === 'orange' ? 'text-orange-400' : 
                              'text-green-400'
                            }`}>
                              {emp.scoreRegulatório}
                            </span>
                          </div>
                        </td>
                        <td className="text-center px-2">
                          <Badge className={`
                            ${risco.cor === 'red' ? 'bg-red-500/10 text-red-400' : ''}
                            ${risco.cor === 'orange' ? 'bg-orange-500/10 text-orange-400' : ''}
                            ${risco.cor === 'green' ? 'bg-green-500/10 text-green-400' : ''}
                          `}>
                            {risco.nivel}
                          </Badge>
                        </td>
                        <td className="text-center text-sm text-foreground px-2">
                          R$ {emp.multasUltimos12M}M
                        </td>
                        <td className="text-center px-2">
                          <Badge variant="outline" className="text-xs">
                            {emp.pvsAbertos}
                          </Badge>
                        </td>
                        <td className="text-center text-sm text-foreground px-2">
                          {emp.disponibilidade.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

