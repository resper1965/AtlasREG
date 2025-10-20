import { Metadata } from 'next';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Empresas por Risco | AtlasReg',
};

export default function EmpresasRiscoPage() {
  const empresasComRisco = TOP_TRANSMISSORAS.map(emp => ({
    ...emp,
    scoreRisco: Math.floor(20 + Math.random() * 60),
    multasAno: Math.floor(Math.random() * 30),
  })).sort((a, b) => b.scoreRisco - a.scoreRisco);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Shield className="h-8 w-8 text-[#00ADE8]" />
        Empresas por Risco
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Alto Risco</p>
            <p className="text-3xl font-bold text-red-400">
              {empresasComRisco.filter(e => e.scoreRisco >= 70).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Médio Risco</p>
            <p className="text-3xl font-bold text-orange-400">
              {empresasComRisco.filter(e => e.scoreRisco >= 40 && e.scoreRisco < 70).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Baixo Risco</p>
            <p className="text-3xl font-bold text-green-400">
              {empresasComRisco.filter(e => e.scoreRisco < 40).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">#</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Empresa</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Score</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Nível</th>
                  <th className="text-center text-xs font-medium text-muted-foreground py-3 px-2">Multas/Ano</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">RAP</th>
                </tr>
              </thead>
              <tbody>
                {empresasComRisco.map((emp, idx) => (
                  <tr key={emp.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="py-3 px-2 font-bold text-muted-foreground">#{idx + 1}</td>
                    <td className="py-3 px-2 font-medium text-foreground">{emp.nome}</td>
                    <td className="text-center px-2">
                      <span className={`text-lg font-bold ${
                        emp.scoreRisco >= 70 ? 'text-red-400' :
                        emp.scoreRisco >= 40 ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {emp.scoreRisco}
                      </span>
                    </td>
                    <td className="text-center px-2">
                      <Badge className={`
                        ${emp.scoreRisco >= 70 ? 'bg-red-500/10 text-red-400' : ''}
                        ${emp.scoreRisco >= 40 && emp.scoreRisco < 70 ? 'bg-orange-500/10 text-orange-400' : ''}
                        ${emp.scoreRisco < 40 ? 'bg-green-500/10 text-green-400' : ''}
                      `}>
                        {emp.scoreRisco >= 70 ? 'Alto' : emp.scoreRisco >= 40 ? 'Médio' : 'Baixo'}
                      </Badge>
                    </td>
                    <td className="text-center text-sm text-foreground px-2">R$ {emp.multasAno}M</td>
                    <td className="text-right text-sm text-foreground px-2">R$ {emp.rapAnual}M</td>
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
