import { Metadata } from 'next';
import { Gavel, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EVENTOS_MOCK, LABELS_TIPO_EVENTO } from '@/lib/constants/energy-market';
import { EventoTipo } from '@/types/energy-market';

export const metadata: Metadata = {
  title: 'Decisões ANEEL | AtlasReg',
  description: 'Decisões regulatórias da ANEEL',
};

export default function DecisoesANEELPage() {
  // TEMPORÁRIO: Mock não tem eventos DECISAO_REGULATORIA ainda
  // const decisoes = EVENTOS_MOCK.filter(e => e.tipo === EventoTipo.DECISAO_REGULATORIA);
  const decisoes = EVENTOS_MOCK.slice(0, 5); // Usar primeiros 5 eventos como placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Gavel className="h-8 w-8 text-[#00ADE8]" />
          Decisões Regulatórias ANEEL
        </h1>
        <p className="text-muted-foreground mt-2">
          Decisões, resoluções e despachos da agência reguladora
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total 2025</p>
                <p className="text-3xl font-bold text-foreground">234</p>
              </div>
              <Gavel className="h-10 w-10 text-[#00ADE8] opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">↑ 12% vs 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outubro</p>
                <p className="text-3xl font-bold text-foreground">28</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400 opacity-20" />
            </div>
            <p className="text-xs text-green-400 mt-2">↑ 23% vs set/25</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Por Categoria</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tarifas</span>
                  <span className="text-foreground font-medium">45%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Outorgas</span>
                  <span className="text-foreground font-medium">32%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fiscalização</span>
                  <span className="text-foreground font-medium">23%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de Decisões */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Decisões Recentes</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Filter className="h-3 w-3" />
              Filtrar
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisoes.slice(0, 10).map((decisao, idx) => (
              <div key={decisao.id} className="flex gap-4 pb-4 border-b border-border/40 last:border-0">
                <div className="flex-shrink-0 w-20 text-right">
                  <p className="text-xs text-muted-foreground">{decisao.data}</p>
                  <Badge variant="outline" className="mt-1 text-[9px]">
                    {decisao.fonte}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground mb-1">{decisao.titulo}</h3>
                  <p className="text-xs text-muted-foreground">{decisao.descricao}</p>
                  {decisao.empresas && decisao.empresas.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {decisao.empresas.map((emp, i) => (
                        <Badge key={i} variant="secondary" className="text-[9px]">
                          {emp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Badge className={`
                    ${decisao.severidade.toLowerCase() === 'critica' ? 'bg-red-500/10 text-red-400' : ''}
                    ${decisao.severidade.toLowerCase() === 'alta' ? 'bg-orange-500/10 text-orange-400' : ''}
                    ${decisao.severidade.toLowerCase() === 'media' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                    ${decisao.severidade.toLowerCase() === 'baixa' ? 'bg-blue-500/10 text-blue-400' : ''}
                  `}>
                    {decisao.severidade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

