import { Metadata } from 'next';
import { Grid3x3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Matriz de Risco | AtlasReg',
};

export default function MatrizRiscoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Grid3x3 className="h-8 w-8 text-[#00ADE8]" />
        Matriz de Risco
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matriz Probabilidade × Impacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 p-4">
            {[...Array(16)].map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const risco = row * 4 + col;
              return (
                <div
                  key={i}
                  className={`h-20 rounded flex items-center justify-center text-xs font-medium ${
                    risco >= 12 ? 'bg-red-500/20 text-red-400' :
                    risco >= 8 ? 'bg-orange-500/20 text-orange-400' :
                    risco >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}
                >
                  {risco >= 12 ? 'ALTO' : risco >= 8 ? 'MÉDIO' : risco >= 4 ? 'BAIXO' : 'MÍNIMO'}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

