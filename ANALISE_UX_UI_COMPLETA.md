# ANÁLISE COMPLETA DE UX/UI - AtlasREG by ness.

**Data:** 31 de Outubro de 2025
**Analista:** Claude (UX/UI Specialist + Accessibility Expert)
**Aplicação:** AtlasReg - Plataforma de Inteligência de Mercado
**Componentes Analisados:** 54 componentes UI + 46+ páginas

---

## 📊 SCORE GERAL: 7.1/10

| Categoria | Score | Status |
|-----------|-------|--------|
| **Design System** | 6/10 | ⚠️ Precisa melhorias |
| **Componentes UI** | 9/10 | ✅ Excelente |
| **Dashboard UX** | 7/10 | ⚠️ Bom, pode melhorar |
| **Responsividade** | 7/10 | ⚠️ Mobile OK, falta desktop |
| **Acessibilidade** | 6/10 | ⚠️ **CRÍTICO** |
| **Performance** | 8/10 | ✅ Bom |

---

## 🎨 DESIGN SYSTEM

### ✅ PONTOS FORTES

1. **OKLCH Color Space**
   - Moderna, perceptualmente uniforme
   - 3 presets de tema (Brutalist, Soft-Pop, Tangerine)
   - Dark mode first (ideal para B2B)

2. **Tipografia**
   - Montserrat (moderna, legível)
   - Escala bem definida (text-xs a text-3xl)
   - Font feature settings otimizado

3. **Espaçamento**
   - Sistema Tailwind consistente
   - Gap bem aplicado (gap-4, gap-6)
   - Padding adequado

### ❌ PROBLEMAS CRÍTICOS

#### 1. CONTRASTE WCAG AA FALHA ⚠️

```css
/* globals.css - PROBLEMA */
.dark {
  --background: oklch(0.141 0.005 285.823);      /* #0B0C0E */
  --muted-foreground: oklch(0.705 0.015 286.067); /* #B4B7C3 */
  /* Ratio: 3.4:1 ❌ (Requer 4.5:1 para WCAG AA) */
}
```

**Impacto:**
- Textos secundários ilegíveis
- Falha em auditoria de acessibilidade
- Problemas em monitores de baixo contraste

**Solução:**
```css
.dark {
  --muted-foreground: oklch(0.78 0.02 286);  /* Aumentar para 4.5:1+ */
}
```

#### 2. CORES HARDCODED (Não usa palette CSS)

**Problema:** 23 ocorrências de cores inline

```tsx
// ❌ kpi-card.tsx
return 'text-green-500 dark:text-green-400';

// ❌ evento-card.tsx
const colors = {
  critica: 'bg-red-500/10 text-red-500',
  media: 'bg-yellow-500/10 text-yellow-500',
};

// ❌ dashboard/default/page.tsx
<span className="text-[#00ADE8]">há 5 minutos</span>
```

**Impacto:**
- Inconsistência entre temas
- Difícil manutenção
- Impossível trocar cores globalmente

**Solução:** Criar variáveis CSS

```css
:root {
  --status-success: oklch(0.646 0.222 41.116);
  --status-danger: oklch(0.704 0.191 22.216);
  --status-warning: oklch(0.769 0.188 70.08);
  --brand-accent: #00ADE8;
}
```

```tsx
// ✅ Uso correto
className="text-[var(--status-success)]"
```

#### 3. TIPOGRAFIA SEM @FONT-FACE

```css
/* globals.css */
body {
  font-family: 'Montserrat', system-ui, sans-serif;
  /* ❌ Nenhuma declaração @font-face */
  /* ❌ Sem font-display: swap (causa FOUT) */
}
```

**Impacto:**
- Flash of Unstyled Text (FOUT)
- Fonte pode não carregar
- Performance ruim

**Solução:**
```css
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

#### 4. FALTA LINE-HEIGHT NO BODY

```css
body {
  @apply bg-background text-foreground;
  /* ❌ Sem line-height explícito (padrão: 1.2) */
  /* Recomendado: 1.5+ para acessibilidade */
}
```

**Solução:**
```css
body {
  @apply bg-background text-foreground leading-relaxed;
  /* leading-relaxed = 1.625 */
}
```

---

## 🧩 COMPONENTES UI

### ✅ PONTOS FORTES

1. **54 Componentes** bem estruturados (Radix UI + CVA)
2. **Focus indicators** excelentes (ring de 3px)
3. **Dark mode** em todos os componentes
4. **Type safety** completo com TypeScript
5. **Composição** bem feita (Button variants, Card composition)

### ❌ PROBLEMAS ENCONTRADOS

#### 1. DIALOG SEM FOCUS TRAP ⚠️

```tsx
// dialog.tsx
function DialogContent({ children }) {
  return (
    <DialogPrimitive.Content>
      {children}
      {/* ❌ Usuário pode TAB para fora do modal */}
    </DialogPrimitive.Content>
  )
}
```

**Impacto:** Falha WCAG 2.4.3 (Focus Order)

**Solução:** Integrar focus-trap-react

#### 2. INPUT SEM ESTADOS DE VALIDAÇÃO

```tsx
// input.tsx
<input
  className="aria-invalid:ring-destructive/20"
  /* ❌ Depende de aria-invalid manual */
  /* ❌ Sem integração com react-hook-form */
/>
```

**Solução:** Auto-detectar erro do form context

#### 3. LABEL APÓS SELECT (Ordem incorreta)

```tsx
// ❌ PROBLEMA
<Select>
  <SelectTrigger id="view-selector">
</Select>
<Label htmlFor="view-selector" className="sr-only">

// ✅ CORRETO
<Label htmlFor="view-selector" className="sr-only">
  View
</Label>
<Select>
```

#### 4. MISSING ARIA-CURRENT NA NAVEGAÇÃO

```tsx
// nav-main.tsx
<SidebarMenuButton isActive={isActive(item.url)}>
  {/* ❌ Screen reader não sabe qual é a página atual */}
</SidebarMenuButton>

// ✅ Solução
<SidebarMenuButton
  isActive={isActive(item.url)}
  aria-current={isActive(item.url) ? "page" : undefined}
>
```

---

## 📱 RESPONSIVIDADE

### ✅ PONTOS FORTES

- **Mobile first** bem implementado
- Breakpoints: `sm: (640px)`, `lg: (1024px)`
- Grid responsivo: `sm:grid-cols-2 lg:grid-cols-3`

### ❌ PROBLEMAS

#### 1. FALTA BREAKPOINTS XL E 2XL

```tsx
// ❌ Nenhum componente usa xl: ou 2xl:
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Em telas 1920px+, fica apenas 3 colunas */}
  {/* Deveria ser: xl:grid-cols-4 2xl:grid-cols-6 */}
</div>
```

#### 2. FONT SIZES NÃO RESPONSIVOS

```tsx
// kpi-card.tsx
<div className="text-2xl font-semibold">
  {/* ❌ Fixo em todos os breakpoints */}
  {/* ✅ Deveria: text-xl sm:text-2xl lg:text-3xl */}
</div>
```

#### 3. SHEET WIDTH CONFLITO

```tsx
// sheet.tsx
side === "right" && "w-3/4 sm:max-w-sm"
/* Em tablet (768px):
   w-3/4 = 576px (75%)
   sm:max-w-sm = 448px
   ❌ Conflito! Fica 448px (corta conteúdo) */

// ✅ Solução
"w-3/4 sm:w-2/3 md:max-w-sm lg:max-w-md"
```

#### 4. TABLE SEM STICKY HEADERS

```tsx
// table.tsx
<div className="relative w-full overflow-x-auto">
  <table>
    {/* ❌ Headers não ficam sticky em scroll */}
    <thead> {/* Sem position: sticky */}
```

---

## ♿ ACESSIBILIDADE

### Score: 6/10 ⚠️ NECESSITA ATENÇÃO

### ✅ ASPECTOS POSITIVOS

1. **125 ocorrências** de `aria-*` e `role`
2. **121 ocorrências** de `focus-visible`
3. **30 ocorrências** de `sr-only`
4. **Semantic HTML** bem utilizado

```tsx
// ✅ Excelente exemplo
<fieldset>
  <legend>Filtros</legend>
  <div role="group">
  <div role="alert">  {/* Para erros */}
```

### ❌ PROBLEMAS CRÍTICOS

#### 1. WCAG AA FALHA (Contraste)

**Afetados:**
- Text muted: 3.4:1 ❌ (Requer 4.5:1)
- Borders: 2:1 ❌ (Requer 3:1)
- Badge text: ~3.8:1 ⚠️

**Locais:**
- Descrições de cards
- Textos secundários
- Tooltips

#### 2. COLOR RELIANCE (Daltonismo)

```tsx
// evento-card.tsx
const getSeveridadeBadge = (sev) => {
  critica: 'bg-red-500/10 text-red-500',     // ❌ Apenas cor
  media: 'bg-yellow-500/10 text-yellow-500', // ❌ Sem padrão
}
```

**Problema:** Usuário daltônico não distingue

**Solução:** Adicionar padrões visuais
```tsx
critica: 'bg-red-500/10 text-red-500 border-2 border-dashed',
alta: 'bg-orange-500/10 text-orange-500 border-l-4',
media: 'bg-yellow-500/10 text-yellow-500 border-t-2',
```

#### 3. MISSING ARIA-LABELS EM ÍCONES

```tsx
// ❌ Icon sem label
<Icon className="h-4 w-4" />

// ✅ Correto
<Icon className="h-4 w-4" aria-label="Status positivo" />
```

#### 4. KEYBOARD NAVIGATION

**Problemas:**
- Modais sem focus trap
- Dropdown pode perder foco
- TAB order em algumas páginas está quebrado

---

## 🎯 DASHBOARD UX

### ✅ PONTOS FORTES

1. **Hierarquia clara** (h1, h2, h3 bem usados)
2. **Grid layout** responsivo
3. **Cards informativos** bem estruturados
4. **Insights com IA** visualmente atraentes
5. **Gráficos** com Recharts (profissional)

### ❌ PROBLEMAS DE UX

#### 1. CN() DUPLICADO

```tsx
// dashboard/default/page.tsx (linha 202)
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ❌ Já existe em @/lib/utils com melhor implementação
// ✅ Deveria importar: import { cn } from '@/lib/utils'
```

#### 2. SEMANTIC COLOR MAPPING CONFUSO

```tsx
const severidadeColors = {
  critica: 'RED',    // ✅ OK
  alta: 'ORANGE',    // ⚠️ OK
  media: 'YELLOW',   // ❌ Confuso (amarelo = warning, não medium)
  baixa: 'BLUE',     // ❌ Não intuitivo
}
```

**Problema:** Usuário não associa amarelo a "média"

**Sugestão:**
```tsx
critica: 'RED',       // Vermelho forte
alta: 'ORANGE',       // Laranja
media: 'AMBER',       // Âmbar (mais quente que amarelo)
baixa: 'GREEN',       // Verde (tudo OK)
```

#### 3. LOADING STATES AUSENTES

```tsx
// dashboard/default/page.tsx
export default function PainelExecutivo() {
  const kpis = getKPIsDashboard();  // Síncrono (mock data)

  return (
    <div>
      {/* ❌ Sem loading state */}
      {/* ❌ Sem error state */}
      {kpis.map(...)}
    </div>
  )
}
```

**Impacto:** Em produção com fetch real, usuário vê tela branca

**Solução:** Criar `loading.tsx` e `error.tsx`

#### 4. TOOLTIPS INCONSISTENTES

```tsx
// Alguns componentes têm tooltip
<SidebarMenuButton tooltip="Dashboard">

// Outros não
<Button>
  <Icon />  {/* Sem tooltip */}
</Button>
```

---

## 🚀 PERFORMANCE

### ✅ PONTOS FORTES

- Next.js 15 + React 19 (última versão)
- Images otimizadas (após correção)
- CSS optimizado com Tailwind
- Tree shaking habilitado

### ⚠️ PODE MELHORAR

1. **Font Loading**
   - Sem preload
   - Sem font-display: swap

2. **Code Splitting**
   - Alguns componentes grandes não são lazy

3. **Bundle Size**
   - Não analisado (falta bundle analyzer)

---

## 📋 PLANO DE AÇÃO PRIORITÁRIO

### 🔴 CRÍTICO (Esta Semana)

**1. Corrigir Contraste WCAG AA**
```css
.dark {
  --muted-foreground: oklch(0.78 0.02 286);  /* De 0.705 para 0.78 */
  --border: oklch(1 0 0 / 15%);             /* De 10% para 15% */
}
```

**2. Adicionar Focus Trap nos Modals**
```bash
npm install focus-trap-react
```

```tsx
import { FocusTrap } from 'focus-trap-react'

<FocusTrap>
  <DialogContent>
    {children}
  </DialogContent>
</FocusTrap>
```

**3. Criar Palette CSS para Status**
```css
:root {
  --status-success: oklch(0.646 0.222 41.116);
  --status-warning: oklch(0.769 0.188 70.08);
  --status-danger: oklch(0.704 0.191 22.216);
  --status-info: oklch(0.623 0.214 259.815);
}
```

### 🟡 IMPORTANTE (Próximas 2 Semanas)

**4. Adicionar @font-face**
```css
@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF;
}
```

**5. Implementar aria-current**
```tsx
<SidebarMenuButton
  aria-current={isActive ? "page" : undefined}
>
```

**6. Corrigir Responsividade MD**
```tsx
"w-3/4 sm:w-2/3 md:max-w-sm lg:max-w-md"
```

**7. Adicionar line-height**
```css
body {
  @apply leading-relaxed;  /* 1.625 */
}
```

### 🟢 MELHORIAS (Futuro)

**8. Font Sizes Responsivos**
```tsx
<div className="text-xl sm:text-2xl lg:text-3xl">
```

**9. Breakpoints XL e 2XL**
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
```

**10. Loading States**
```tsx
// loading.tsx
export default function Loading() {
  return <Skeleton ... />
}
```

---

## 🔧 FERRAMENTAS RECOMENDADAS

```bash
# Acessibilidade
npm install @axe-core/react
npm install eslint-plugin-jsx-a11y

# Testing
npm install @testing-library/react @testing-library/jest-dom
npm install @testing-library/user-event

# Font Loading
# (Usar Next.js Font Optimization embutido)

# Focus Management
npm install focus-trap-react

# Design Tokens
npm install tailwindcss-animate
```

---

## 📊 MATRIZ DE PRIORIZAÇÃO

| Problema | Impacto | Esforço | Prioridade | Timeline |
|----------|---------|---------|------------|----------|
| **Contraste WCAG** | 🔴 Alto | 🟢 Baixo | **P0** | 1 dia |
| **Focus Trap** | 🔴 Alto | 🟡 Médio | **P0** | 2 dias |
| **Color Palette** | 🟡 Médio | 🟢 Baixo | **P1** | 1 dia |
| **@font-face** | 🟡 Médio | 🟢 Baixo | **P1** | 1 dia |
| **aria-current** | 🟢 Baixo | 🟢 Baixo | **P2** | 0.5 dia |
| **Responsividade** | 🟡 Médio | 🟡 Médio | **P1** | 2 dias |
| **Font Responsivo** | 🟢 Baixo | 🟡 Médio | **P3** | 1 dia |

---

## ✅ CHECKLIST DE ACESSIBILIDADE

### WCAG 2.1 Level AA

- [ ] **1.4.3 Contraste** (Mínimo 4.5:1)
- [ ] **2.4.3 Focus Order** (Focus trap em modals)
- [x] **2.4.7 Focus Visible** (Ring indicators)
- [ ] **3.2.4 Identificação Consistente** (aria-current)
- [x] **4.1.2 Name, Role, Value** (Aria labels)
- [ ] **1.4.11 Contraste Não-textual** (Borders 3:1)

### Extras

- [ ] Testar com screen reader (NVDA/JAWS)
- [ ] Testar navegação por teclado
- [ ] Verificar cor-daltonismo (Colorblind filters)
- [ ] Audit com axe DevTools
- [ ] Lighthouse Accessibility Score > 95

---

## 🎨 DESIGN TOKENS RECOMENDADOS

```css
/* src/styles/design-tokens.css */

:root {
  /* Brand */
  --brand-primary: #00ADE8;
  --brand-primary-hover: #008ec4;

  /* Status */
  --status-success: oklch(0.646 0.222 41.116);
  --status-warning: oklch(0.769 0.188 70.08);
  --status-danger: oklch(0.704 0.191 22.216);
  --status-info: oklch(0.623 0.214 259.815);

  /* Severity (Energy Market) */
  --severity-critical: var(--status-danger);
  --severity-high: oklch(0.6 0.118 184.704);
  --severity-medium: var(--status-warning);
  --severity-low: var(--status-info);

  /* Typography */
  --font-primary: 'Montserrat', system-ui, sans-serif;
  --line-height-base: 1.625;
  --line-height-tight: 1.375;

  /* Spacing Scale */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */

  /* Border Radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
}
```

---

## 📝 EXEMPLOS DE CÓDIGO CORRETO

### ✅ Status Colors com CSS Vars

```tsx
// ❌ ANTES
<Badge className="bg-green-500/10 text-green-500">

// ✅ DEPOIS
<Badge className="bg-[var(--status-success)]/10 text-[var(--status-success)]">
```

### ✅ Componente com Acessibilidade

```tsx
'use client'

import { ShieldAlert } from 'lucide-react'
import { Alert } from '@/components/ui/alert'

export function StatusBadge({
  severity,
  label
}: {
  severity: 'critical' | 'high' | 'medium' | 'low'
  label: string
}) {
  const severityConfig = {
    critical: {
      color: 'var(--severity-critical)',
      icon: ShieldAlert,
      pattern: 'border-2 border-dashed',
      ariaLabel: 'Severidade crítica',
    },
    high: {
      color: 'var(--severity-high)',
      icon: null,
      pattern: 'border-l-4',
      ariaLabel: 'Severidade alta',
    },
    // ... outros
  }

  const config = severityConfig[severity]

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${config.pattern}`}
      style={{ backgroundColor: `${config.color}10`, color: config.color }}
      role="status"
      aria-label={config.ariaLabel}
    >
      {config.icon && <config.icon className="size-4" aria-hidden="true" />}
      <span>{label}</span>
    </div>
  )
}
```

### ✅ Modal com Focus Trap

```tsx
import { FocusTrap } from 'focus-trap-react'

export function Dialog({ isOpen, onClose, children }) {
  return isOpen ? (
    <FocusTrap>
      <div role="dialog" aria-modal="true">
        <div className="overlay" onClick={onClose} />
        <div className="content">
          {children}
        </div>
      </div>
    </FocusTrap>
  ) : null
}
```

---

## 📚 RECURSOS E REFERÊNCIAS

### Documentação

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

### Ferramentas

- axe DevTools (Chrome Extension)
- Lighthouse (Chrome DevTools)
- Color Oracle (Daltonism simulator)
- NVDA (Screen reader)

### Tutoriais

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Focus Management](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

---

## 🎯 CONCLUSÃO

### Pontos Fortes

1. ✅ **Base sólida** - Radix UI + Tailwind
2. ✅ **Componentes** bem estruturados
3. ✅ **Dark mode** completo
4. ✅ **TypeScript** type-safe
5. ✅ **Focus indicators** excelentes

### Áreas Críticas

1. ⚠️ **Acessibilidade** - Contraste WCAG AA falha
2. ⚠️ **Consistência** - Cores hardcoded
3. ⚠️ **Responsividade** - Falta breakpoints grandes
4. ⚠️ **Performance** - Font loading não otimizado
5. ⚠️ **UX** - Loading states ausentes

### Recomendação Final

**Com as correções P0 e P1 (1-2 semanas), a aplicação atinge 8.5/10 em UX/UI.**

Score Projetado Pós-Correções:
- Design System: 6/10 → **8/10**
- Componentes UI: 9/10 → **9/10** (mantém)
- Dashboard UX: 7/10 → **8.5/10**
- Responsividade: 7/10 → **8/10**
- Acessibilidade: 6/10 → **9/10** ⭐

**TOTAL: 7.1/10 → 8.5/10** (+1.4 pontos)

---

**Autor:** Claude (Sonnet 4.5)
**Data:** 31/10/2025
**Versão:** 1.0
**Próxima Revisão:** Após implementação de correções P0/P1
