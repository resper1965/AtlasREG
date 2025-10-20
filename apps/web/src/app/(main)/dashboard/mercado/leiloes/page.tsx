import { Metadata } from 'next';
import { Gavel, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Leilões | AtlasReg',
};

export default function LeiloesPage() {
  const leiloes = [
    { id: 1, nome: 'Leilão 001/2025', data: '2025-11-20', lotes: 5, rap_total: 450, status: 'Previsto' },
    { id: 2, nome: 'Leilão 002/2025', data: '2025-12-15', lotes: 3, rap_total: 280, status: 'Previsto' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Gavel className="h-8 w-8 text-[#00ADE8]" />
        Leilões de Transmissão
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Previstos 2025</p>
            <p className="text-3xl font-bold text-[#00ADE8]">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">RAP Total</p>
            <p className="text-3xl font-bold text-foreground">R$ 1,5 Bi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lotes Totais</p>
            <p className="text-3xl font-bold text-foreground">18</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Próximos Leilões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leiloes.map(l => (
              <div key={l.id} className="p-4 border border-border/40 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{l.nome}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{l.lotes} lotes • RAP R$ {l.rap_total}M/ano</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[#00ADE8] border-[#00ADE8]/40">
                      {l.data}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{l.status}</p>
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

