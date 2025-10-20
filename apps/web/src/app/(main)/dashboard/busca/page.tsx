import { Metadata } from 'next';
import { Search, Filter, SlidersHorizontal, Download, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EVENTOS_MOCK, LABELS_TIPO_EVENTO, TOP_TRANSMISSORAS } from '@/lib/constants/energy-market';
import { EventoCard } from '@/components/dashboard/evento-card';
import { EventoTipo, Severidade, Sentimento } from '@/types/energy-market';

export const metadata: Metadata = {
  title: 'Busca Avançada | AtlasReg',
  description: 'Busca semântica e filtros avançados',
};

export default function BuscaAvancadaPage() {
  // Mock: Simular resultados de busca
  const resultados = EVENTOS_MOCK.slice(0, 8);
  const totalResultados = EVENTOS_MOCK.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
          <Search className="h-8 w-8 text-[#00ADE8]" />
          Busca Avançada
        </h1>
        <p className="text-muted-foreground mt-2">
          Busca semântica com IA + filtros estruturados
        </p>
      </div>

      {/* Barra de Busca Principal */}
      <Card className="border-[#00ADE8]/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos, empresas, decisões... (ex: 'multas da Taesa em 2025')"
                className="pl-10 h-12 text-base bg-muted/50"
              />
            </div>
            <Button className="h-12 px-6 bg-[#00ADE8] hover:bg-[#00ADE8]/90">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2">🔥 Buscas populares:</span>
            {['Maiores multas', 'Outorgas 2025', 'M&A recentes', 'Alto risco'].map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-[#00ADE8]/10">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros Avançados (Sidebar) */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#00ADE8]" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tipo de Evento */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Tipo de Evento
              </label>
              <Select>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(LABELS_TIPO_EVENTO).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severidade */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Severidade
              </label>
              <Select>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Empresa */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Empresa
              </label>
              <Select>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {TOP_TRANSMISSORAS.slice(0, 10).map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Período
              </label>
              <Select>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Últimos 30 dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Valor (R$ milhões)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Mín" type="number" className="bg-muted/50 h-9 text-sm" />
                <Input placeholder="Máx" type="number" className="bg-muted/50 h-9 text-sm" />
              </div>
            </div>

            <Separator />

            {/* Ações */}
            <div className="space-y-2">
              <Button className="w-full bg-[#00ADE8] hover:bg-[#00ADE8]/90" size="sm">
                <Filter className="h-3 w-3 mr-2" />
                Aplicar Filtros
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Limpar Tudo
              </Button>
              <Button variant="ghost" className="w-full" size="sm">
                <Save className="h-3 w-3 mr-2" />
                Salvar Filtro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header dos Resultados */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{totalResultados}</span> resultados encontrados
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Ordenado por relevância (busca semântica + filtros)
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="relevancia">
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevância</SelectItem>
                  <SelectItem value="data-desc">Mais recente</SelectItem>
                  <SelectItem value="data-asc">Mais antigo</SelectItem>
                  <SelectItem value="valor-desc">Maior valor</SelectItem>
                  <SelectItem value="valor-asc">Menor valor</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Lista de Resultados */}
          <div className="space-y-4">
            {resultados.map((evento) => (
              <EventoCard key={evento.id} evento={evento} showSimilarity />
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-[#00ADE8] text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

