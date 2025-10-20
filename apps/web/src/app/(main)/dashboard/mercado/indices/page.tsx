import { Metadata } from 'next';
import { LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Índices de Mercado | AtlasReg',
};

export default function IndicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <LineChart className="h-8 w-8 text-[#00ADE8]" />
        Índices de Mercado
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">IGP-M (12M)</p>
            <p className="text-3xl font-bold text-foreground">3.9%</p>
            <p className="text-xs text-green-400 mt-1">↑ 0.2 p.p.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">IPCA (12M)</p>
            <p className="text-3xl font-bold text-foreground">4.5%</p>
            <p className="text-xs text-red-400 mt-1">↑ 0.3 p.p.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Selic Meta</p>
            <p className="text-3xl font-bold text-foreground">12.25%</p>
            <p className="text-xs text-muted-foreground mt-1">BCB</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Dólar PTAX</p>
            <p className="text-3xl font-bold text-foreground">R$ 5.15</p>
            <p className="text-xs text-orange-400 mt-1">↑ 2.1%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Índices Econômicos Relevantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { indice: 'IGP-M (FGV)', valor: '3.9%', desc: 'Base para reajustes tarifários' },
              { indice: 'IPCA (IBGE)', valor: '4.5%', desc: 'Meta de inflação: 3.0% ± 1.5 p.p.' },
              { indice: 'Selic', valor: '12.25%', desc: 'Taxa básica de juros' },
              { indice: 'TJLP', valor: '7.5%', desc: 'Financiamento BNDES' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-border/40">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.indice}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <p className="text-lg font-bold text-[#00ADE8]">{item.valor}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

