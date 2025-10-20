/**
 * Página: Minhas Watchlists - Ferramentas
 * AtlasReg by ness. - Dark mode first
 */

import { Star, Plus, Bell, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usuarioPadrao } from '@/lib/mock-data/usuario-mock';

export default function WatchlistsPage() {
  const watchlists = [
    {
      id: 1,
      nome: 'Principais Transmissoras',
      descricao: 'Monitoramento das Top 3 por RAP',
      empresas: ['Taesa', 'ISA CTEEP', 'Copel'],
      keywords: [],
      eventos_7d: 8,
      eventos_total: 142,
      alerta_email: true,
      alerta_inapp: true,
      criado_em: '2025-09-15',
    },
    {
      id: 2,
      nome: 'M&A em Andamento',
      descricao: 'Transações e consolidação do setor',
      empresas: [],
      keywords: ['fusão', 'aquisição', 'venda', 'compra', 'M&A'],
      eventos_7d: 3,
      eventos_total: 28,
      alerta_email: true,
      alerta_inapp: false,
      criado_em: '2025-08-20',
    },
    {
      id: 3,
      nome: 'Multas e Processos',
      descricao: 'Fiscalização ANEEL - todas as empresas',
      empresas: [],
      keywords: ['multa', 'PV', 'fiscalização', 'condenação'],
      eventos_7d: 5,
      eventos_total: 67,
      alerta_email: false,
      alerta_inapp: true,
      criado_em: '2025-10-01',
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Minhas Watchlists
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoramento personalizado de empresas e temas - {usuarioPadrao.nome}
          </p>
        </div>
        
        <Button className="gap-2 bg-[#00ADE8] hover:bg-[#00ADE8]/90">
          <Plus className="h-4 w-4" />
          Nova Watchlist
        </Button>
      </div>

      {/* Lista de Watchlists */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {watchlists.map((watchlist) => (
          <Card
            key={watchlist.id}
            className="border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-[#00ADE8]/30 transition-all group cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#00ADE8] fill-[#00ADE8]" />
                  <CardTitle className="text-base font-medium text-foreground group-hover:text-[#00ADE8] transition-colors">
                    {watchlist.nome}
                  </CardTitle>
                </div>
                
                {/* Eventos novos */}
                {watchlist.eventos_7d > 0 && (
                  <Badge variant="default" className="bg-[#00ADE8] hover:bg-[#00ADE8]/90">
                    {watchlist.eventos_7d} novos
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {watchlist.descricao}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="space-y-2">
                {watchlist.empresas.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Empresas monitoradas:</p>
                    <div className="flex flex-wrap gap-1">
                      {watchlist.empresas.map((emp, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {emp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {watchlist.keywords.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {watchlist.keywords.map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-muted/50">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
                <div>
                  <p className="text-xs text-muted-foreground">Total de eventos</p>
                  <p className="text-lg font-semibold text-foreground">
                    {watchlist.eventos_total}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Criada em</p>
                  <p className="text-sm text-foreground">
                    {new Date(watchlist.criado_em).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              {/* Alertas */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  {watchlist.alerta_email ? (
                    <Bell className="h-3 w-3 text-[#00ADE8]" />
                  ) : (
                    <Bell className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={watchlist.alerta_email ? 'text-foreground' : 'text-muted-foreground'}>
                    Email
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {watchlist.alerta_inapp ? (
                    <Bell className="h-3 w-3 text-[#00ADE8]" />
                  ) : (
                    <Bell className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={watchlist.alerta_inapp ? 'text-foreground' : 'text-muted-foreground'}>
                    In-app
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="text-foreground">
              <strong>Como funcionam as Watchlists:</strong>
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4 text-xs">
              <li>• Monitore empresas específicas ou keywords customizadas</li>
              <li>• Receba alertas por email e/ou in-app quando novos eventos ocorrerem</li>
              <li>• Configure frequência (tempo real, diário, semanal)</li>
              <li>• Exporte relatórios personalizados</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

