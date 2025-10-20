import { Metadata } from 'next';
import { Filter, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Filtros Salvos | AtlasReg',
};

export default function FiltrosSalvosPage() {
  const filtrosSalvos = [
    {
      id: 1,
      nome: 'Multas > R$ 10M',
      descricao: 'Multas acima de 10 milhões nos últimos 6 meses',
      filtros: { tipo: 'multa', valor_min: 10, periodo: '6m' },
      resultados: 12,
      ultima_execucao: '2025-10-18',
    },
    {
      id: 2,
      nome: 'Taesa - Todos Eventos',
      descricao: 'Todos os eventos relacionados à Taesa',
      filtros: { empresa: 'Taesa' },
      resultados: 45,
      ultima_execucao: '2025-10-18',
    },
    {
      id: 3,
      nome: 'M&A Q4/2025',
      descricao: 'Transações de M&A no último trimestre',
      filtros: { tipo: 'ma', periodo: 'q4-2025' },
      resultados: 8,
      ultima_execucao: '2025-10-17',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <Filter className="h-8 w-8 text-[#00ADE8]" />
          Filtros Salvos
        </h1>
        <Button className="bg-[#00ADE8] hover:bg-[#00ADE8]/90">
          <Save className="h-4 w-4 mr-2" />
          Novo Filtro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Filtros Ativos</p>
            <p className="text-3xl font-bold text-[#00ADE8]">{filtrosSalvos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Mais Usado</p>
            <p className="text-lg font-bold text-foreground">Multas > R$ 10M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Execuções Hoje</p>
            <p className="text-3xl font-bold text-foreground">8</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filtrosSalvos.map((filtro) => (
          <Card key={filtro.id} className="hover:border-[#00ADE8]/40 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{filtro.nome}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{filtro.descricao}</p>
                </div>
                <Badge className="bg-[#00ADE8]/10 text-[#00ADE8]">
                  {filtro.resultados} resultados
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.entries(filtro.filtros).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Executar</Button>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

