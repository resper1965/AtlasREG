# 👥 BMad Team All - Criação do Painel Executivo

**Missão:** Criar Painel Executivo do AtlasReg com dados reais do setor de energia  
**Timeline:** 5-6 horas  
**Agentes:** Analyst, UX Expert, Developer, QA

---

## 📋 FASE 1: ANÁLISE (Analyst - 30min)

### Requisitos do Painel

**Objetivo:**
Dashboard principal que dá visão 360° do setor de transmissão brasileiro em tempo real.

**Usuários:**
- Analistas de mercado
- Investidores (fundos, private equity)
- Executivos de transmissoras
- Reguladores (ANEEL)

**Métricas Essenciais:**

1. **KPIs Principais (6 cards)**
   - RAP Total do Setor (R$ 23,5 Bi)
   - Novas Outorgas no Mês (quantidade + RAP)
   - Multas Aplicadas no Mês (R$ + variação)
   - Eventos Críticos na Semana (quantidade)
   - Volume M&A YTD (R$ + deals)
   - Valor em Risco (PVs ativos)

2. **Gráficos Analíticos (4)**
   - RAP por Empresa (Top 10) - Bar chart
   - Evolução de Multas (12 meses) - Line chart
   - M&A Timeline (últimos deals) - Timeline
   - Distribuição por Severidade - Pie chart

3. **Timeline de Eventos (últimos 30 dias)**
   - Card de evento com: tipo, empresa, valor, análise
   - Filtros rápidos: todos, regulatório, financeiro, risco
   - Paginação

4. **Análises Rápidas (insights IA)**
   - Top 3 tendências da semana
   - Empresas em destaque (positivo/negativo)
   - Alertas importantes

**Dados Necessários:**
- Eventos (últimos 30 dias)
- Empresas (Top 10)
- Indicadores do setor
- Multas (12 meses)
- M&A (YTD)

---

## 🎨 FASE 2: DESIGN (UX Expert - 1h)

### Layout Proposto

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: AtlasReg by ness. | Painel Executivo                   │
│  Última atualização: há 5 minutos                               │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  6 KPI CARDS (Grid 3x2)                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │RAP Total │ │Outorgas  │ │Multas    │                       │
│  │R$ 23,5Bi │ │3 (R$150M)│ │R$ 45M ↑  │                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │Eventos   │ │M&A YTD   │ │Valor em  │                       │
│  │12 críticos│ │R$ 12,3Bi │ │Risco 2,1B│                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
└───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬─────────────────────────────┐
│  GRÁFICO: RAP Top 10 (Bar)      │  GRÁFICO: Multas 12m (Line) │
│                                 │                             │
│  Taesa      ████████ R$ 3,5Bi  │     R$                      │
│  ISA CTEEP  ███████  R$ 3,2Bi  │  60M │    ╱╲                │
│  Copel      ████     R$ 1,8Bi  │  40M │   ╱  ╲  ╱            │
│  ...                            │  20M │__╱____╲╱             │
│                                 │      └──────────────────    │
└─────────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TIMELINE DE EVENTOS (últimos 30 dias)                          │
│  Filtros: [Todos] Regulatório Financeiro Risco Operacional     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🔴 CRÍTICO | 15/10/2025                                   │ │
│  │ Transmissora X multada em R$ 15M por atraso               │ │
│  │ Empresa: Transmissora X | Tipo: Multa                     │ │
│  │ Análise: Impacto -0.45% ROE, risco reputacional alto     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🟢 ALTA | 12/10/2025                                      │ │
│  │ CTEEP vende 40% da ATE III por R$ 1,2 bilhão             │ │
│  │ Empresa: ISA CTEEP | Tipo: M&A                            │ │
│  │ Análise: Múltiplo 13.6x RAP, valuation premium 5%        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ... mais 28 eventos                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INSIGHTS IA (últimos 7 dias)                                   │
│  • Aumento de 23% em multas vs mês anterior                    │
│  • 3 M&A deals em 2 semanas (acima da média)                   │
│  • Transmissora Y com 3 projetos atrasados (risco alto)        │
└─────────────────────────────────────────────────────────────────┘
```

### Design System

**Cores por Severidade:**
- 🔴 Crítica: Red 600
- 🟠 Alta: Orange 600
- 🟡 Média: Yellow 600
- 🔵 Baixa: Blue 600

**Cores por Sentimento:**
- 🟢 Positivo: Green 600
- ⚪ Neutro: Gray 600
- 🔴 Negativo: Red 600

**Typography:**
- Montserrat Medium (títulos)
- Montserrat Regular (corpo)
- Números: Montserrat SemiBold

**ness. Accent:** #00ADE8 (links, highlights)

---

## 💻 FASE 3: DESENVOLVIMENTO (Developer - 3-4h)

### Arquivos a Criar

1. **`apps/web/src/app/(main)/dashboard/default/page.tsx`**
   - Componente principal do Painel Executivo
   - 6 KPI cards
   - 4 gráficos
   - Timeline eventos
   - Insights IA

2. **`apps/web/src/components/dashboard/kpi-card.tsx`**
   - Card reutilizável para KPIs
   - Valor, variação %, ícone, cor

3. **`apps/web/src/components/dashboard/evento-card.tsx`**
   - Card de evento na timeline
   - Tipo, severidade, empresa, análise

4. **`apps/web/src/components/dashboard/chart-rap-empresas.tsx`**
   - Bar chart com Recharts
   - Top 10 por RAP

5. **`apps/web/src/components/dashboard/chart-multas-evolucao.tsx`**
   - Line chart evolução 12 meses

6. **`apps/web/src/lib/mock-data/energia-mock.ts`**
   - Dados mockados REALISTAS do setor
   - Baseado em números reais

7. **`apps/web/src/lib/api/events-api.ts`**
   - API client (preparado para backend)
   - Por enquanto retorna mock

---

## ✅ FASE 4: QA (QA - 1h)

### Checklist de Qualidade

**Funcional:**
- [ ] KPIs mostram valores corretos
- [ ] Gráficos renderizam
- [ ] Timeline carrega eventos
- [ ] Filtros funcionam
- [ ] Navegação entre páginas

**Performance:**
- [ ] Carregamento <2s
- [ ] Animações fluidas
- [ ] Sem lag em scroll

**UX:**
- [ ] Textos em português
- [ ] Cores ness. corretas
- [ ] Responsivo (mobile)
- [ ] Acessibilidade (WCAG AA)

**Dados:**
- [ ] Números realistas do setor
- [ ] Formatação correta (R$, %, datas)
- [ ] Análises fazem sentido

---

## 📊 PROGRESSO ESTIMADO

```
Análise (Analyst):    ████████████████████ 100% (30min)
Design (UX Expert):   ████████████████████ 100% (1h)
Desenvolvimento:      ░░░░░░░░░░░░░░░░░░░░   0% (3-4h)
QA & Polish:          ░░░░░░░░░░░░░░░░░░░░   0% (1h)

TOTAL: 5.5-6.5 horas
```

---

## 🚀 EXECUTAR AGORA

**Analyst ✅ Completo** - Requisitos definidos  
**UX Expert ✅ Completo** - Layout proposto  
**Developer ⏳ Iniciando** - Código do Painel

**Próximo:** Criar componentes e página!

---

**Powered by:** BMad Team All + ness. 💙


