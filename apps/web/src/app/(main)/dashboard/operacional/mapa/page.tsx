import { Metadata } from 'next';
import { Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Mapa da Rede | AtlasReg',
};

export default function MapaRedePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Map className="h-8 w-8 text-[#00ADE8]" />
        Mapa da Rede de Transmissão
      </h1>

      <Card className="h-[600px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Mapa interativo em desenvolvimento</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Integração com dados geoespaciais</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

