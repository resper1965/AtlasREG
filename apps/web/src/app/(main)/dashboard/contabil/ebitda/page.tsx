/**
 * Página: EBITDA por Empresa - Contábil
 * AtlasReg by ness. - Dark mode first
 */

import { TrendingUp, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/dashboard/kpi-card';
import { top10Transmissoras } from '@/lib/mock-data/energia-mock';
import { formatarReal } from '@/lib/constants/energy-market';

export default function EBITDAPage() {
  // Calcular EBITDA estimado (RAP * margin)
  const empresasComEBITDA = top10Transmissoras.map(emp => ({
    ...emp,
    ebitda_estimado: (emp.rap_anual || 0) * ((emp.ebitda_margin || 85) / 100),
  })).sort((a, b) => (b.ebitda_margin || 0) - (a.ebitda_margin || 0));

  const ebitdaMarginMedia = 85.0;
  const melhorMargin = Math.max(...top10Transmissoras.map(e => e.ebitda_margin || 0));
  const piorMargin = Math.min(...top10Transmissoras.map(e => e.ebitda_margin || 0));

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          EBITDA por Empresa
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise de rentabilidade operacional - Margem EBITDA do setor de transmissão
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          titulo="Margem EBITDA Média"
          valor={`${ebitdaMarginMedia.toFixed(1)}%`}
          icone={Percent}
          descricao="Setor de transmissão"
        />
        
        <KPICard
          titulo="Melhor Margem"
          valor={`${melhorMargin.toFixed(1)}%`}
          icone={TrendingUp}
          descricao="Transnorte Energia (90.0%)"
        />
        
        <KPICard
          titulo="Benchmark Internacional"
          valor="80%"
          icone={Percent}
          descricao="Brasil 5 p.p. acima"
        />
      </div>

      {/* Ranking */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Ranking por Margem EBITDA
          </CardTitle>
          <CardDescription>
            Top 10 empresas - margens operacionais excepcionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {empresasComEBITDA.map((empresa, idx) => {
              const margin = empresa.ebitda_margin || 0;
              const ebitda = empresa.ebitda_estimado || 0;
              
              return (
                <div key={empresa.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#00ADE8]/10 text-xs font-semibold text-[#00ADE8]">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{empresa.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          RAP: {formatarReal(empresa.rap_anual || 0)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-500">
                        {margin.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        EBITDA: {formatarReal(ebitda)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all"
                      style={{ width: `${margin}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Análise */}
      <Card className="border-border/40 bg-green-500/5 border-green-500/20">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm text-green-500 font-medium">
              ✅ Margens EBITDA Excepcionais no Setor de Transmissão
            </p>
            <p className="text-xs text-foreground/90">
              <strong>Margem média de 85%</strong> reflete o modelo de negócio regulado com baixo risco operacional. 
              Transmissão tem custos operacionais muito baixos (principalmente manutenção preventiva) 
              comparado à receita garantida (RAP).
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Comparação:</strong> Geração (40-50% EBITDA), Distribuição (25-35% EBITDA). 
              Transmissão é o segmento mais rentável do setor elétrico.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

