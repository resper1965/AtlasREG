/**
 * KPI Card Component - AtlasReg by ness.
 * Dark mode first com cores OKLCH
 */

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  titulo: string;
  valor: string;
  variacao?: number;  // Percentual (positivo ou negativo)
  icone: LucideIcon;
  descricao?: string;
  trend?: 'up' | 'down' | 'neutral';
  valorSecundario?: string;
  className?: string;
}

export function KPICard({
  titulo,
  valor,
  variacao,
  icone: Icon,
  descricao,
  trend,
  valorSecundario,
  className,
}: KPICardProps) {
  // Determinar cor da variação
  const getVariacaoColor = () => {
    if (!variacao) return 'text-muted-foreground';
    
    // Para métricas positivas (receita, RAP)
    if (trend === 'up' || (variacao > 0 && !trend)) {
      return 'text-green-500 dark:text-green-400';
    }
    // Para métricas negativas (multas, riscos)
    if (trend === 'down' || (variacao < 0 && !trend)) {
      return 'text-red-500 dark:text-red-400';
    }
    
    return 'text-muted-foreground';
  };

  const getVariacaoIcon = () => {
    if (!variacao) return null;
    if (variacao > 0) return '↑';
    if (variacao < 0) return '↓';
    return '→';
  };

  return (
    <Card className={cn(
      'border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:border-[#00ADE8]/20',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <Icon className="h-4 w-4 text-[#00ADE8]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Valor Principal */}
          <div className="text-2xl font-semibold tracking-tight text-foreground">
            {valor}
          </div>
          
          {/* Variação */}
          {variacao !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span className={cn('font-medium', getVariacaoColor())}>
                {getVariacaoIcon()} {Math.abs(variacao).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">
                vs mês anterior
              </span>
            </div>
          )}
          
          {/* Valor Secundário */}
          {valorSecundario && (
            <div className="text-xs text-muted-foreground">
              {valorSecundario}
            </div>
          )}
          
          {/* Descrição */}
          {descricao && (
            <p className="text-xs text-muted-foreground pt-1">
              {descricao}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

