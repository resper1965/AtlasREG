import { Metadata } from 'next';
import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Consolidação Setorial | AtlasReg',
};

export default function ConsolidacaoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold flex items-center gap-3">
        <Layers className="h-8 w-8 text-[#00ADE8]" />
        Consolidação Setorial
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Top 5 Market Share</p>
            <p className="text-3xl font-bold text-[#00ADE8]">52%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">HHI (Concentração)</p>
            <p className="text-3xl font-bold text-foreground">1.240</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Players Principais</p>
            <p className="text-3xl font-bold text-foreground">15</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">M&A 5 anos</p>
            <p className="text-3xl font-bold text-foreground">47</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Market Share Top 10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { empresa: 'Taesa', share: 14.9 },
              { empresa: 'ISA CTEEP', share: 13.6 },
              { empresa: 'Copel', share: 7.7 },
              { empresa: 'Chesf', share: 6.4 },
              { empresa: 'Furnas', share: 6.0 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-32">{item.empresa}</span>
                <div className="flex-1 bg-muted/30 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-[#00ADE8] h-full flex items-center justify-end pr-2"
                    style={{ width: `${item.share * 5}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{item.share}%</span>
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

