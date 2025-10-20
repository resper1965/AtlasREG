import { Metadata } from 'next';
import { Handshake, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'M&A | AtlasReg',
  description: 'Fusões, aquisições e transações',
};

export default function MAFinanceiroPage() {
  const transacoes = [
    {
      id: 1,
      data: '2025-10-10',
      tipo: 'Aquisição',
      comprador: 'CDPQ',
      alvo: 'Transmissora Centro-Oeste (25%)',
      valor: 2700,
      multiplo: 14.2,
      status: 'Anunciado',
    },
    {
      id: 2,
      data: '2025-09-28',
      tipo: 'Aquisição',
      comprador: 'State Grid',
      alvo: 'Projeto LT 500kV (100%)',
      valor: 1850,
      multiplo: 13.5,
      status: 'Concluído',
    },
    {
      id: 3,
      data: '2025-08-15',
      tipo: 'Joint Venture',
      comprador: 'Taesa + Copel',
      alvo: 'Novo projeto transmissão',
      valor: 950,
      multiplo: null,
      status: 'Em negociação',
    },
    {
      id: 4,
      data: '2025-07-22',
      tipo: 'Aquisição',
      comprador: 'ISA CTEEP',
      alvo: 'Transmissora Regional (100%)',
      valor: 1200,
      multiplo: 12.8,
      status: 'Concluído',
    },
  ];

  const totalVolume = transacoes.reduce((acc, t) => acc + t.valor, 0);
  const multiploMedio = transacoes
    .filter(t => t.multiplo)
    .reduce((acc, t) => acc + (t.multiplo || 0), 0) / transacoes.filter(t => t.multiplo).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Handshake className="h-8 w-8 text-[#00ADE8]" />
          M&A e Transações
        </h1>
        <p className="text-muted-foreground mt-2">
          Fusões, aquisições e movimentações do setor
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#00ADE8]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volume 2025</p>
                <p className="text-3xl font-bold text-[#00ADE8]">R$ {(totalVolume / 1000).toFixed(1)} Bi</p>
              </div>
              <DollarSign className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-green-400 mt-2">↑ 89% vs 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Transações 2025</p>
              <p className="text-3xl font-bold text-foreground">18</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">12 concluídas, 6 em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Múltiplo Médio</p>
              <p className="text-3xl font-bold text-foreground">{multiploMedio.toFixed(1)}x</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">EV/EBITDA</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Players Ativos</p>
              <p className="text-3xl font-bold text-foreground">24</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Compradores estratégicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de Transações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transacoes.map((trans) => (
              <div key={trans.id} className="p-4 rounded-lg border border-border/40 hover:border-[#00ADE8]/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[#00ADE8] border-[#00ADE8]/40">
                        {trans.tipo}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{trans.data}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{trans.comprador}</h3>
                  </div>
                  <Badge className={`
                    ${trans.status === 'Concluído' ? 'bg-green-500/10 text-green-400' : ''}
                    ${trans.status === 'Anunciado' ? 'bg-blue-500/10 text-blue-400' : ''}
                    ${trans.status === 'Em negociação' ? 'bg-orange-500/10 text-orange-400' : ''}
                  `}>
                    {trans.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Alvo:</span>
                    <span className="text-foreground font-medium">{trans.alvo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#00ADE8]" />
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="text-foreground font-semibold">
                        R$ {trans.valor.toFixed(0)}M
                      </span>
                    </div>

                    {trans.multiplo && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-muted-foreground">Múltiplo:</span>
                        <span className="text-foreground font-semibold">
                          {trans.multiplo.toFixed(1)}x EBITDA
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compradores Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Principais Compradores 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { nome: 'CDPQ', transacoes: 4, volume: 5200 },
              { nome: 'State Grid', transacoes: 3, volume: 4100 },
              { nome: 'ISA CTEEP', transacoes: 3, volume: 2800 },
              { nome: 'Taesa', transacoes: 2, volume: 1900 },
              { nome: 'Copel', transacoes: 2, volume: 1500 },
              { nome: 'Outros', transacoes: 4, volume: 2200 },
            ].map((player, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-semibold text-foreground">{player.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {player.transacoes} transações
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00ADE8]">
                    R$ {player.volume}M
                  </p>
                  <p className="text-xs text-muted-foreground">volume total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

