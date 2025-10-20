/**
 * Página: Todas as Transmissoras
 * AtlasReg by ness. - Dark mode first
 */

import { Building2, Search, MapPin, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/kpi-card';
import { top10Transmissoras } from '@/lib/mock-data/energia-mock';
import { formatarReal } from '@/lib/constants/energy-market';

export default function EmpresasPage() {
  // Expandir para todas as transmissoras (mockado)
  const todasEmpresas = [
    ...top10Transmissoras,
    { id: 11, nome: 'ENTE', grupo_economico: 'Energisa', rap_anual: 680000000, linhas_km: 2800, score_risco_total: 32 },
    { id: 12, nome: 'ATE', grupo_economico: 'Alupar', rap_anual: 650000000, linhas_km: 3100, score_risco_total: 25 },
    { id: 13, nome: 'ATE II', grupo_economico: 'TAESA', rap_anual: 620000000, linhas_km: 2500, score_risco_total: 23 },
    { id: 14, nome: 'Transirapé', grupo_economico: 'State Grid', rap_anual: 580000000, linhas_km: 2200, score_risco_total: 28 },
    { id: 15, nome: 'TSN', grupo_economico: 'Copel', rap_anual: 520000000, linhas_km: 1900, score_risco_total: 30 },
  ];

  const totalEmpresas = 120;
  const totalRAP = 23500000000;
  const totalLinhas = 185000;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Transmissoras de Energia
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastro completo de empresas autorizadas pela ANEEL
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          titulo="Total de Transmissoras"
          valor={totalEmpresas.toString()}
          icone={Building2}
          descricao="Empresas autorizadas ANEEL"
        />
        
        <KPICard
          titulo="RAP Total"
          valor={formatarReal(totalRAP)}
          icone={Building2}
          descricao="Receita anual permitida"
        />
        
        <KPICard
          titulo="Infraestrutura Total"
          valor={`${totalLinhas.toLocaleString('pt-BR')} km`}
          icone={Zap}
          descricao="Linhas de transmissão"
        />
      </div>

      {/* Busca */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ, grupo econômico..."
                className="pl-10 bg-muted/50 border-border/40"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              Por Região
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empresas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {todasEmpresas.map((empresa) => (
          <Card
            key={empresa.id}
            className="border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-[#00ADE8]/30 transition-all cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium text-foreground group-hover:text-[#00ADE8] transition-colors">
                    {empresa.nome}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {empresa.grupo_economico}
                  </p>
                  {empresa.ticker_b3 && (
                    <Badge variant="outline" className="mt-2 text-xs bg-[#00ADE8]/10 text-[#00ADE8] border-[#00ADE8]/20">
                      {empresa.ticker_b3}
                    </Badge>
                  )}
                </div>
                
                {/* Score de Risco */}
                <div className="text-right">
                  <div className={`text-xs font-medium ${
                    (empresa.score_risco_total || 0) < 30 ? 'text-green-500' :
                    (empresa.score_risco_total || 0) < 50 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    Risco: {empresa.score_risco_total}/100
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">RAP Anual</p>
                  <p className="font-semibold text-foreground">
                    {formatarReal(empresa.rap_anual || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Linhas</p>
                  <p className="font-semibold text-foreground">
                    {(empresa.linhas_km || 0).toLocaleString('pt-BR')} km
                  </p>
                </div>
                {empresa.ebitda_margin && (
                  <div>
                    <p className="text-muted-foreground">EBITDA%</p>
                    <p className="font-semibold text-green-500">
                      {empresa.ebitda_margin.toFixed(1)}%
                    </p>
                  </div>
                )}
                {empresa.roe && (
                  <div>
                    <p className="text-muted-foreground">ROE%</p>
                    <p className="font-semibold text-green-500">
                      {empresa.roe.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {empresa.rating_credito && (
                <div className="pt-2 border-t border-border/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Rating:</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {empresa.rating_credito}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ver mais */}
      <div className="text-center">
        <Button variant="outline">
          Carregar mais empresas (15 de {totalEmpresas})
        </Button>
      </div>
    </div>
  );
}

