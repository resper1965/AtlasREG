import { Metadata } from 'next';
import { Award, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EVENTOS_MOCK } from '@/lib/constants/energy-market';
import { EventoTipo } from '@/types/energy-market';

export const metadata: Metadata = {
  title: 'Outorgas | AtlasReg',
  description: 'Outorgas e concessões de transmissão',
};

export default function OutorgasPage() {
  const outorgas = EVENTOS_MOCK.filter(e => 
    e.tipo === EventoTipo.OUTORGA_CONCEDIDA || e.tipo === EventoTipo.OUTORGA_VENCIDA
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Award className="h-8 w-8 text-[#00ADE8]" />
          Outorgas e Concessões
        </h1>
        <p className="text-muted-foreground mt-2">
          Outorgas concedidas, vencidas e em processo de licitação
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Concedidas 2025</p>
              <p className="text-3xl font-bold text-foreground">12</p>
            </div>
            <p className="text-xs text-green-400 mt-2">↑ 50% vs 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">RAP Total</p>
              <p className="text-3xl font-bold text-[#00ADE8]">R$ 1,2 Bi</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">RAP anual agregado</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Em Licitação</p>
              <p className="text-3xl font-bold text-foreground">8</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Previsão Q4/25</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Vencidas 2025</p>
              <p className="text-3xl font-bold text-orange-400">5</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Renovação pendente</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Outorgas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outorgas Concedidas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outorgas.slice(0, 8).map((outorga) => (
              <div key={outorga.id} className="flex items-start gap-4 p-4 rounded-lg border border-border/40 hover:border-[#00ADE8]/40 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-green-500/10 text-green-400 border-0">
                    {outorga.tipo === EventoTipo.OUTORGA_CONCEDIDA ? 'Concedida' : 'Vencida'}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground mb-1">{outorga.titulo}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{outorga.descricao}</p>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-[#00ADE8]" />
                      <span className="text-muted-foreground">RAP:</span>
                      <span className="text-foreground font-medium">
                        R$ {outorga.valor?.toFixed(0)}M/ano
                      </span>
                    </div>
                    {outorga.empresas && outorga.empresas[0] && (
                      <div>
                        <span className="text-muted-foreground">Vencedor:</span>
                        <span className="text-foreground font-medium ml-1">
                          {outorga.empresas[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Data:</span>
                      <span className="text-foreground font-medium ml-1">{outorga.data}</span>
                    </div>
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

