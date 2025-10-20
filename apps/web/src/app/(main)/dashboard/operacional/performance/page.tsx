import { Metadata } from 'next';
import { Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';

export const metadata: Metadata = {
  title: 'Performance Operacional | AtlasReg',
};

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Gauge className="h-8 w-8 text-[#00ADE8]" />
        Performance Operacional
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Disponibilidade Média</p>
            <p className="text-3xl font-bold text-green-400">98.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Perdas Técnicas</p>
            <p className="text-3xl font-bold text-foreground">2.1%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tempo Médio Reparo</p>
            <p className="text-3xl font-bold text-foreground">4.2h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ocorrências/mês</p>
            <p className="text-3xl font-bold text-foreground">142</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance por Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TOP_TRANSMISSORAS.slice(0, 8).map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                <span className="text-sm font-medium text-foreground">{emp.nome}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Disponibilidade</p>
                    <p className="text-sm font-semibold text-green-400">98.{Math.floor(Math.random() * 9)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Perdas</p>
                    <p className="text-sm font-semibold text-foreground">{(1.5 + Math.random()).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

