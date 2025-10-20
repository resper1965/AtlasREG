import { Metadata } from 'next';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Vencimentos de Outorgas | AtlasReg',
};

export default function VencimentosPage() {
  const vencimentos = [
    { empresa: 'Eletronorte', outorga: 'LT 500kV Tucuruí', vencimento: '2026-03-15', rap: 120, status: 'Renovação solicitada' },
    { empresa: 'Chesf', outorga: 'SE 500/230kV', vencimento: '2026-07-22', rap: 85, status: 'Em análise ANEEL' },
    { empresa: 'Furnas', outorga: 'LT 765kV', vencimento: '2027-01-10', rap: 250, status: 'Aguardando processo' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Calendar className="h-8 w-8 text-[#00ADE8]" />
        Vencimentos de Outorgas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Próximos 12 Meses</p>
            <p className="text-3xl font-bold text-orange-400">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">RAP em Risco</p>
            <p className="text-3xl font-bold text-foreground">R$ 1,2 Bi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Renovações Pendentes</p>
            <p className="text-3xl font-bold text-red-400">5</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outorgas com Vencimento Próximo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vencimentos.map((v, idx) => (
              <div key={idx} className="p-4 border border-border/40 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{v.outorga}</h3>
                    <p className="text-sm text-muted-foreground">{v.empresa}</p>
                  </div>
                  <Badge variant="outline" className="text-orange-400 border-orange-400/40">
                    {v.vencimento}
                  </Badge>
                </div>
                <div className="mt-2 flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">RAP:</span>
                    <span className="ml-1 text-foreground">R$ {v.rap}M/ano</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-1 text-[#00ADE8]">{v.status}</span>
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

