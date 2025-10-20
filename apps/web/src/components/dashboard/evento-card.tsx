/**
 * Evento Card Component - AtlasReg by ness.
 * Dark mode first com cores OKLCH
 */

import { Evento, EventoTipo, Severidade } from '@/types/energy-market';
import { LABELS_TIPO_EVENTO, LABELS_SEVERIDADE, formatarReal } from '@/lib/constants/energy-market';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Building2, Calendar } from 'lucide-react';

interface EventoCardProps {
  evento: Partial<Evento>;
  onClick?: () => void;
}

export function EventoCard({ evento, onClick }: EventoCardProps) {
  // Cores por severidade (dark mode)
  const getSeveridadeBadge = (sev?: Severidade) => {
    const colors = {
      critica: 'bg-red-500/10 text-red-500 border-red-500/20',
      alta: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      media: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      baixa: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    
    return colors[sev || 'baixa'];
  };

  // Ícone por tipo
  const getTipoIcon = (tipo?: EventoTipo) => {
    if (tipo === EventoTipo.MULTA) return AlertTriangle;
    if (tipo === EventoTipo.TRANSACAO_MA) return DollarSign;
    if (tipo?.includes('outorga')) return Building2;
    return Calendar;
  };

  const Icon = getTipoIcon(evento.tipo);

  // Formatar data
  const formatarData = (data?: string) => {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Card
      className={cn(
        'border-border/40 bg-card/30 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-[#00ADE8]/30 cursor-pointer group',
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Tipo e Severidade */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={getSeveridadeBadge(evento.severidade)}>
              {LABELS_SEVERIDADE[evento.severidade || Severidade.BAIXA]}
            </Badge>
            <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/40">
              {LABELS_TIPO_EVENTO[evento.tipo || EventoTipo.OUTRO]}
            </Badge>
          </div>
          
          {/* Ícone */}
          <Icon className="h-5 w-5 text-[#00ADE8] flex-shrink-0" />
        </div>
        
        {/* Título */}
        <CardTitle className="text-base font-medium text-foreground group-hover:text-[#00ADE8] transition-colors">
          {evento.titulo}
        </CardTitle>
        
        {/* Metadata */}
        <CardDescription className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatarData(evento.data_evento)}
          </span>
          {evento.empresas && evento.empresas.length > 0 && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {evento.empresas[0]}
                {evento.empresas.length > 1 && ` +${evento.empresas.length - 1}`}
              </span>
            </>
          )}
          {evento.valor_impacto && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className={cn(
                "flex items-center gap-1 font-medium",
                evento.valor_impacto > 0 ? 'text-green-500' : 'text-red-500'
              )}>
                <DollarSign className="h-3 w-3" />
                {formatarReal(Math.abs(evento.valor_impacto))}
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      
      {/* Análise Financeira */}
      {evento.analise_financeira && (
        <CardContent className="pt-0">
          <div className="rounded-md bg-muted/30 p-3 border border-border/20">
            <p className="text-xs text-muted-foreground mb-1 font-medium">
              💡 Análise Financeira:
            </p>
            <p className="text-xs text-foreground/90">
              {evento.analise_financeira.justificativa}
            </p>
            
            {/* Sentimento */}
            {evento.analise_financeira.sentimento && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sentimento:</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-xs',
                    evento.analise_financeira.sentimento === 'muito_positivo' && 'bg-green-500/10 text-green-500 border-green-500/20',
                    evento.analise_financeira.sentimento === 'positivo' && 'bg-green-500/10 text-green-400 border-green-500/20',
                    evento.analise_financeira.sentimento === 'neutro' && 'bg-gray-500/10 text-gray-400 border-gray-500/20',
                    evento.analise_financeira.sentimento === 'negativo' && 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                    evento.analise_financeira.sentimento === 'muito_negativo' && 'bg-red-500/10 text-red-500 border-red-500/20',
                  )}
                >
                  {evento.analise_financeira.sentimento.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      {/* Análise de Risco */}
      {evento.analise_risco && evento.requer_atencao && (
        <CardContent className="pt-2">
          <div className="rounded-md bg-orange-500/10 p-3 border border-orange-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-orange-500 mb-1">
                  Requer Atenção - Score de Risco: {evento.analise_risco.score_total}/100
                </p>
                <p className="text-xs text-foreground/80">
                  {evento.analise_risco.fatores_risco?.[0]}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

