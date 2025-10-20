/**
 * Chart Evolução de Multas - AtlasReg by ness.
 * Dark mode first com cores OKLCH
 */

'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatarReal } from '@/lib/constants/energy-market';
import { cn } from '@/lib/utils';

interface ChartMultasEvolucaoProps {
  dados: Array<{
    mes: string;
    valor: number;
    quantidade: number;
  }>;
}

export function ChartMultasEvolucao({ dados }: ChartMultasEvolucaoProps) {
  // Formatar dados para o chart
  const chartData = dados.map(item => ({
    mes: item.mes,
    valor: item.valor / 1000000,  // Converter para milhões
    valorFormatado: formatarReal(item.valor),
    quantidade: item.quantidade,
  }));

  // Calcular média e tendência
  const valorMedio = chartData.reduce((acc, item) => acc + item.valor, 0) / chartData.length;
  const ultimoMes = chartData[chartData.length - 1];
  const penultimoMes = chartData[chartData.length - 2];
  const variacao = ((ultimoMes.valor - penultimoMes.valor) / penultimoMes.valor) * 100;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Evolução de Multas (12 meses)
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Valor total de multas aplicadas pela ANEEL por mês
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            valor: {
              label: 'Valor',
              color: '#ef4444',  // Red para multas
            },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMultas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-card/95 backdrop-blur-sm border-border/40"
                    labelFormatter={(label) => `Mês: ${label}`}
                    formatter={(value, name, props) => (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-medium">Multas:</span>
                          <span className="text-foreground font-semibold">
                            {props.payload.valorFormatado}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Quantidade:</span>
                          <span className="text-foreground">
                            {props.payload.quantidade} processos
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#colorMultas)"
                dot={{
                  fill: '#ef4444',
                  strokeWidth: 2,
                  r: 4,
                  stroke: 'hsl(var(--card))',
                }}
                activeDot={{
                  r: 6,
                  fill: '#ef4444',
                  stroke: 'hsl(var(--card))',
                  strokeWidth: 2,
                }}
              />
              {/* Linha de média */}
              <Line
                type="monotone"
                dataKey={() => valorMedio}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Estatísticas */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="text-muted-foreground">
            Média 12 meses: <span className="text-foreground font-medium">{formatarReal(valorMedio * 1000000)}</span>
          </div>
          <div className={cn(
            "font-medium",
            variacao > 0 ? 'text-red-400' : 'text-green-400'
          )}>
            {variacao > 0 ? '↑' : '↓'} {Math.abs(variacao).toFixed(1)}% vs mês anterior
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

