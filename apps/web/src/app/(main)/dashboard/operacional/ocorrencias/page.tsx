/**
 * Página: Ocorrências ONS - Operacional
 * AtlasReg by ness. - Dark mode first
 */

import { Zap, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPICard } from '@/components/dashboard/kpi-card';

export default function OcorrenciasPage() {
  const ocorrencias = [
    {
      id: 1,
      tipo: 'Desligamento Emergencial',
      linha: 'LT 500kV Recife II - Suape',
      empresa: 'Chesf',
      data: '2025-10-16',
      hora: '14:35',
      carga_interrompida_mw: 350,
      duracao_minutos: 240,
      causa: 'Falha em disjuntor',
      regiao: 'Nordeste',
      estado: 'PE',
      status: 'Recomposto',
    },
    {
      id: 2,
      tipo: 'Manutenção Não Programada',
      linha: 'LT 345kV Itumbiara - São Simão',
      empresa: 'Furnas',
      data: '2025-10-15',
      hora: '09:15',
      carga_interrompida_mw: 180,
      duracao_minutos: 120,
      causa: 'Inspeção emergencial',
      regiao: 'Sudeste',
      estado: 'MG',
      status: 'Recomposto',
    },
    {
      id: 3,
      tipo: 'Desligamento Programado',
      linha: 'LT 230kV Porto Velho - Vilhena',
      empresa: 'Eletronorte',
      data: '2025-10-14',
      hora: '06:00',
      carga_interrompida_mw: 0,  // Programado = 0 impacto
      duracao_minutos: 360,
      causa: 'Manutenção preventiva',
      regiao: 'Norte',
      estado: 'RO',
      status: 'Concluído',
    },
  ];

  const totalOcorrenciasMes = 156;
  const disponibilidadeMedia = 98.5;
  const tempoMedioRecomposicao = 2.3;  // horas

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Ocorrências Operacionais - ONS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento de desligamentos e eventos no Sistema Interligado Nacional
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard
          titulo="Ocorrências no Mês"
          valor={totalOcorrenciasMes.toString()}
          variacao={8}
          trend="down"
          icone={Zap}
          descricao="Outubro 2025"
        />
        
        <KPICard
          titulo="Disponibilidade Média"
          valor={`${disponibilidadeMedia}%`}
          icone={AlertCircle}
          descricao="Acima da meta ANEEL (98%)"
        />
        
        <KPICard
          titulo="Tempo Médio Recomposição"
          valor={`${tempoMedioRecomposicao}h`}
          variacao={-12}
          trend="up"
          icone={Clock}
          descricao="↓ 12% vs mês anterior"
        />
        
        <KPICard
          titulo="Restrições Operativas"
          valor="23"
          icone={MapPin}
          descricao="Ativas no momento"
        />
      </div>

      {/* Lista de Ocorrências */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Ocorrências Recentes
          </CardTitle>
          <CardDescription>
            Últimos eventos registrados pelo ONS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ocorrencias.map((ocorrencia) => (
            <div
              key={ocorrencia.id}
              className="rounded-lg border border-border/40 bg-muted/10 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    ocorrencia.tipo.includes('Emergencial') ? 'destructive' :
                    ocorrencia.tipo.includes('Não Programada') ? 'default' :
                    'outline'
                  }>
                    {ocorrencia.tipo}
                  </Badge>
                  <Badge variant="outline" className={
                    ocorrencia.status === 'Recomposto' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }>
                    {ocorrencia.status}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {new Date(ocorrencia.data).toLocaleDateString('pt-BR')} • {ocorrencia.hora}
                </div>
              </div>
              
              <p className="text-sm font-medium text-foreground mb-2">
                {ocorrencia.linha}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Empresa</p>
                  <p className="text-foreground font-medium">{ocorrencia.empresa}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Região</p>
                  <p className="text-foreground font-medium">{ocorrencia.regiao} ({ocorrencia.estado})</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carga Afetada</p>
                  <p className={`font-medium ${ocorrencia.carga_interrompida_mw > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {ocorrencia.carga_interrompida_mw} MW
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duração</p>
                  <p className="text-foreground font-medium">
                    {(ocorrencia.duracao_minutos / 60).toFixed(1)}h
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Causa:</strong> {ocorrencia.causa}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Análise */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">
            💡 Análise Operacional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="rounded-lg bg-green-500/10 p-3 border border-green-500/20">
            <p className="text-green-500 mb-1">
              <strong>Disponibilidade Acima da Meta:</strong>
            </p>
            <p className="text-foreground/90">
              Com 98,5% de disponibilidade média, o setor supera a meta ANEEL de 98%. 
              Isso garante o recebimento integral da Parcela Variável para a maioria das transmissoras.
            </p>
          </div>
          
          <div className="rounded-lg bg-muted/30 p-3 border border-border/20">
            <p className="text-foreground mb-1">
              <strong>Causas Principais:</strong>
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• Raios e descargas atmosféricas (45%)</li>
              <li>• Falhas em equipamentos (25%)</li>
              <li>• Manutenção não programada (20%)</li>
              <li>• Outros (10%)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

