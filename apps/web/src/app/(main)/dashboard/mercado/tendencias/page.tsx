import { Metadata } from 'next';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Tendências | AtlasReg',
};

export default function TendenciasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-[#00ADE8]" />
        Tendências do Setor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="text-base text-green-400">Tendências Positivas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">↗</span>
                <span className="text-muted-foreground">Crescimento de RAP acima de 5%/ano</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">↗</span>
                <span className="text-muted-foreground">M&A aquecido (↑89% em volume)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">↗</span>
                <span className="text-muted-foreground">Múltiplos de valuation elevados (13-14x)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">↗</span>
                <span className="text-muted-foreground">Novos players internacionais entrando</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-base text-orange-400">Tendências de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">⚠</span>
                <span className="text-muted-foreground">Aumento de multas (+34% vs 2024)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">⚠</span>
                <span className="text-muted-foreground">Atrasos em projetos novos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">⚠</span>
                <span className="text-muted-foreground">Pressão regulatória crescente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">⚠</span>
                <span className="text-muted-foreground">Volatilidade IGP-M impacta reajustes</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Principais Movimentos (Últimos 30 Dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tipo: 'M&A', titulo: '2 grandes transações anunciadas (R$ 4,5 Bi)', impacto: 'alto' },
              { tipo: 'Regulatório', titulo: '5 novas multas aplicadas (R$ 35M)', impacto: 'medio' },
              { tipo: 'Expansão', titulo: '3 outorgas concedidas (RAP R$ 280M/ano)', impacto: 'alto' },
              { tipo: 'Operacional', titulo: 'Disponibilidade média estável em 98.5%', impacto: 'baixo' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border/40">
                <Badge className={`
                  ${item.impacto === 'alto' ? 'bg-green-500/10 text-green-400' : ''}
                  ${item.impacto === 'medio' ? 'bg-orange-500/10 text-orange-400' : ''}
                  ${item.impacto === 'baixo' ? 'bg-blue-500/10 text-blue-400' : ''}
                `}>
                  {item.tipo}
                </Badge>
                <p className="text-sm text-foreground">{item.titulo}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

