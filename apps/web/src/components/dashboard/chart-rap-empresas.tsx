/**
 * Chart RAP por Empresa - AtlasReg by ness.
 * Dark mode first com cores OKLCH
 */

'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatarReal } from '@/lib/constants/energy-market';

interface ChartRAPEmpresasProps {
  dados: Array<{
    nome: string;
    rap_anual: number;
  }>;
}

export function ChartRAPEmpresas({ dados }: ChartRAPEmpresasProps) {
  // Formatar dados para o chart
  const chartData = dados.map(emp => ({
    nome: emp.nome,
    rap: emp.rap_anual / 1000000000,  // Converter para bilhões
    rapFormatado: formatarReal(emp.rap_anual),
  }));

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          RAP por Empresa - Top 10
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Receita Anual Permitida (RAP) das principais transmissoras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            rap: {
              label: 'RAP',
              color: '#00ADE8',  // ness. accent
            },
          }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.2}
                vertical={false}
              />
              <XAxis
                dataKey="nome"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value.toFixed(1)}B`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-card/95 backdrop-blur-sm border-border/40"
                    labelFormatter={(label) => `Empresa: ${label}`}
                    formatter={(value, name, props) => (
                      <div className="flex items-center gap-2">
                        <span className="text-[#00ADE8] font-medium">RAP:</span>
                        <span className="text-foreground font-semibold">
                          {props.payload.rapFormatado}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="rap"
                fill="#00ADE8"
                radius={[4, 4, 0, 0]}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legenda */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          RAP Total do Setor: <span className="text-[#00ADE8] font-medium">R$ 23,5 bilhões/ano</span>
        </div>
      </CardContent>
    </Card>
  );
}

