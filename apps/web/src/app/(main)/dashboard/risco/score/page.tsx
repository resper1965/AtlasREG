/**
 * Página: Score de Risco por Empresa
 * AtlasReg by ness. - Dark mode first
 */

import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KPICard } from '@/components/dashboard/kpi-card';
import { top10Transmissoras } from '@/lib/mock-data/energia-mock';

export default function RiscoScorePage() {
  // Ordenar por score de risco (maior = pior)
  const empresasPorRisco = [...top10Transmissoras].sort((a, b) => 
    (b.score_risco_total || 0) - (a.score_risco_total || 0)
  );

  const scoreMinimo = 20;
  const scoreMaximo = 85;
  const scoreMedio = 32;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Score de Risco por Empresa
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise de risco consolidada: regulatório, financeiro, operacional e reputacional (0-100)
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          titulo="Score Médio do Setor"
          valor={`${scoreMedio}/100`}
          icone={AlertTriangle}
          descricao="Risco moderado-baixo"
        />
        
        <KPICard
          titulo="Menor Score (Melhor)"
          valor={`${scoreMinimo}/100`}
          icone={TrendingDown}
          descricao="EATE - State Grid"
        />
        
        <KPICard
          titulo="Maior Score (Pior)"
          valor={`${scoreMaximo}/100`}
          icone={TrendingUp}
          descricao="Empresas em situação crítica"
        />
      </div>

      {/* Explicação Score */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">
            💡 Como funciona o Score de Risco
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Score 0-30:</strong> Risco baixo - empresa saudável financeiramente, sem processos relevantes
          </p>
          <p>
            <strong className="text-foreground">Score 31-50:</strong> Risco moderado - atenção a alguns indicadores
          </p>
          <p>
            <strong className="text-foreground">Score 51-70:</strong> Risco alto - requer monitoramento constante
          </p>
          <p>
            <strong className="text-foreground">Score 71-100:</strong> Risco crítico - situação preocupante
          </p>
        </CardContent>
      </Card>

      {/* Ranking por Score */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Ranking de Risco - Top 10
          </CardTitle>
          <CardDescription>
            Empresas ordenadas por score total (maior = mais risco)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {empresasPorRisco.map((empresa, idx) => {
            const score = empresa.score_risco_total || 0;
            const nivel = score < 30 ? 'baixo' : score < 50 ? 'moderado' : score < 70 ? 'alto' : 'critico';
            
            return (
              <div
                key={empresa.id}
                className="rounded-lg border border-border/40 bg-muted/10 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Esquerda */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{empresa.nome}</p>
                        <p className="text-xs text-muted-foreground">{empresa.grupo_economico}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Score de Risco:</span>
                        <span className={`font-semibold ${
                          nivel === 'baixo' ? 'text-green-500' :
                          nivel === 'moderado' ? 'text-yellow-500' :
                          nivel === 'alto' ? 'text-orange-500' :
                          'text-red-500'
                        }`}>
                          {score}/100
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            nivel === 'baixo' ? 'bg-green-500' :
                            nivel === 'moderado' ? 'bg-yellow-500' :
                            nivel === 'alto' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Direita: Badge Nível */}
                  <Badge variant="outline" className={
                    nivel === 'baixo' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    nivel === 'moderado' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    nivel === 'alto' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }>
                    {nivel.toUpperCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

