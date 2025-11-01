import { Metadata } from 'next';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Grupos Econômicos | AtlasReg',
};

export default function GruposEconomicosPage() {
  // Agrupar empresas por grupo
  type Empresa = typeof TOP_TRANSMISSORAS[number];
  const grupos = TOP_TRANSMISSORAS.reduce((acc, emp) => {
    const grupo = emp.grupo;
    if (!acc[grupo]) {
      acc[grupo] = { empresas: [] as Empresa[], rapTotal: 0 };
    }
    acc[grupo].empresas.push(emp);
    acc[grupo].rapTotal += emp.rapAnual;
    return acc;
  }, {} as Record<string, { empresas: Empresa[], rapTotal: number }>);

  const gruposArray = Object.entries(grupos).map(([nome, data]) => ({
    nome,
    empresas: data.empresas.length,
    rapTotal: data.rapTotal,
    participacao: (data.rapTotal / 23500) * 100,
  })).sort((a, b) => b.rapTotal - a.rapTotal);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Users className="h-8 w-8 text-[#00ADE8]" />
        Grupos Econômicos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Grupos Ativos</p>
            <p className="text-3xl font-bold text-[#00ADE8]">{gruposArray.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Top 3 Market Share</p>
            <p className="text-3xl font-bold text-foreground">38%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Grupos Estrangeiros</p>
            <p className="text-3xl font-bold text-foreground">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">RAP Médio/Grupo</p>
            <p className="text-3xl font-bold text-foreground">R$ 2,1 Bi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking por Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gruposArray.map((grupo, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-[#00ADE8]/40 transition-colors">
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{grupo.nome}</h3>
                  <p className="text-xs text-muted-foreground">{grupo.empresas} transmissora(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00ADE8]">R$ {grupo.rapTotal.toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground">{grupo.participacao.toFixed(1)}% do setor</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

