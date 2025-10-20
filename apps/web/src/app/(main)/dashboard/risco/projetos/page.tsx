import { Metadata } from 'next';
import { Construction, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Risco de Projetos | AtlasReg',
};

export default function RiscoProjetosPage() {
  const projetos = [
    { id: 1, nome: 'LT 500kV Miracema-Sapeaçu', empresa: 'Taesa', prazo: '2025-12-30', atraso: 45, risco: 'alto', capex: 850 },
    { id: 2, nome: 'SE 500/230kV Jundiaí', empresa: 'ISA CTEEP', prazo: '2025-11-15', atraso: 12, risco: 'medio', capex: 320 },
    { id: 3, nome: 'LT 230kV Curitiba-Ponta Grossa', empresa: 'Copel', prazo: '2025-10-30', atraso: 0, risco: 'baixo', capex: 180 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Construction className="h-8 w-8 text-[#00ADE8]" />
        Risco de Projetos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Projetos em Atraso</p>
            <p className="text-3xl font-bold text-orange-400">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Alto Risco</p>
            <p className="text-3xl font-bold text-red-400">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">CAPEX em Risco</p>
            <p className="text-3xl font-bold text-foreground">R$ 2,3 Bi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projetos com Atraso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projetos.map(p => (
              <div key={p.id} className="p-4 border border-border/40 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.nome}</h3>
                    <p className="text-sm text-muted-foreground">{p.empresa}</p>
                  </div>
                  <Badge className={`
                    ${p.risco === 'alto' ? 'bg-red-500/10 text-red-400' : ''}
                    ${p.risco === 'medio' ? 'bg-orange-500/10 text-orange-400' : ''}
                    ${p.risco === 'baixo' ? 'bg-green-500/10 text-green-400' : ''}
                  `}>
                    {p.risco}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Prazo:</span>
                    <span className="ml-1 text-foreground">{p.prazo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Atraso:</span>
                    <span className="ml-1 text-orange-400">{p.atraso} dias</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CAPEX:</span>
                    <span className="ml-1 text-foreground">R$ {p.capex}M</span>
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

