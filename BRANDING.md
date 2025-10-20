# ness. - Guia de Branding

**Empresa:** ness.  
**Aplicado em:** AtlasReg Platform

---

## 🎨 Wordmark ness.

### Especificação Visual

```
ness.
^^^^─ Montserrat Medium, branco ou preto
    └─ #00ADE8 (cyan accent) - SEMPRE NESTA COR
```

### Regras Fundamentais

#### ✅ CORRETO

1. **Texto + Ponto Azul:**
   ```
   ness.
   ^^^^─ Branco (#FFFFFF) em fundo escuro
       └─ #00ADE8 (CYAN)
   ```

2. **HTML/React:**
   ```html
   <span className="font-medium">
     ness<span className="text-[#00ADE8]">.</span>
   </span>
   ```

3. **CSS:**
   ```css
   .wordmark {
     font-family: 'Montserrat', sans-serif;
     font-weight: 500;
     color: #FFFFFF; /* ou #000000 */
   }
   .wordmark-dot {
     color: #00ADE8 !important;
   }
   ```

#### ❌ INCORRETO

- ❌ `ness.` (ponto na mesma cor do texto)
- ❌ `ness` (sem ponto)
- ❌ `NESS.` (uppercase)
- ❌ `Ness.` (capitalizado)
- ❌ `ness.` com ponto em qualquer cor que NÃO seja #00ADE8

---

## 🎨 Paleta de Cores ness.

### Cores Principais (OKLCH)

```css
/* Fundos Dark-First */
--ness-bg-primary: oklch(0.141 0.005 285.823);    /* #0B0C0E - Canvas principal */
--ness-surface-1: #111317;                         /* Cards nível 1 */
--ness-surface-2: #151820;                         /* Cards nível 2 */
--ness-surface-3: #1B2030;                         /* Modals, elevação máxima */

/* Texto */
--ness-text-primary: #EEF1F6;                      /* Texto principal */
--ness-text-secondary: #A0A8B8;                    /* Labels, metadata */
--ness-text-muted: #6B7280;                        /* Placeholders */

/* Accent - COR DO PONTO */
--ness-accent: #00ADE8;                            /* CYAN - Ponto do ness. */
--ness-accent-hover: #0090C0;                      /* Hover state */

/* Feedback */
--ness-success: #10B981;                           /* Verde */
--ness-warning: #F59E0B;                           /* Laranja */
--ness-error: #EF4444;                             /* Vermelho */
```

### Uso em Componentes

```tsx
// Logo no Topbar
<div className="flex items-center gap-2">
  <span className="text-2xl font-medium text-white">
    ness<span className="text-[#00ADE8]">.</span>
  </span>
  <span className="text-sm text-gray-400">AtlasReg</span>
</div>

// Footer
<footer className="py-6 text-center text-sm text-gray-500">
  Powered by{' '}
  <span className="font-medium text-white">
    ness<span className="text-[#00ADE8]">.</span>
  </span>
  {' '}© 2025
</footer>
```

---

## 🖼️ Aplicações do Branding

### No AtlasReg

1. **Topbar (Header)**
   - Logo ness. no canto superior esquerdo (24px altura)
   - Ponto #00ADE8 visível

2. **Footer**
   - "Powered by ness." (16px)
   - Links de contato/sobre

3. **Login Page**
   - Logo grande centralizado (48px)
   - Subtítulo "AtlasReg Platform"

4. **Loading States**
   - Spinner com cor #00ADE8
   - Texto "Carregando..." com fonte Montserrat

5. **Email Templates**
   - Header com logo ness.
   - Accent color #00ADE8 em CTAs

---

## 📐 Tipografia

### Montserrat (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');

:root {
  --font-montserrat: 'Montserrat', sans-serif;
}

/* Weights */
--font-regular: 400;    /* Body text */
--font-medium: 500;     /* Wordmark ness., buttons, labels */
--font-semibold: 600;   /* Headings */
```

### Hierarquia Tipográfica

- **Wordmark:** Montserrat Medium (500)
- **Headings:** Montserrat SemiBold (600)
- **Body:** Montserrat Regular (400)
- **Buttons/Labels:** Montserrat Medium (500)

---

## 🎯 Ícones - Heroicons

**Biblioteca:** Heroicons v2 (https://heroicons.com)

**Especificações:**
- **Style:** Outline (stroke-width: 1.5)
- **Size padrão:** 20px
- **Cor:** Monocromático, herda cor do texto parent
- **Uso:** Navegação, actions, estados

**Exemplo:**
```tsx
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

<HomeIcon className="h-5 w-5 stroke-[1.5]" />
```

**Evitar:**
- ❌ Ícones coloridos (usar monocromático)
- ❌ Ícones solid (usar outline)
- ❌ Stroke diferente de 1.5

---

## ⚡ Animações e Transições

### Timing
```css
--transition-fast: 120ms;      /* Micro-interactions */
--transition-normal: 240ms;    /* Layout shifts, modals */
--transition-slow: 360ms;      /* Não usar frequentemente */
```

### Easing
```css
--easing-ness: cubic-bezier(0.2, 0.8, 0.2, 1);  /* Suave e natural */
```

### Exemplo
```css
.button {
  transition: all 120ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.modal {
  animation: fadeIn 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

---

## 🌓 Light vs Dark Mode

### Dark Mode (Primário - ness. padrão)
```css
.dark {
  --background: oklch(0.141 0.005 285.823);  /* #0B0C0E */
  --foreground: oklch(0.985 0 0);             /* #EEF1F6 */
}

/* Wordmark em dark */
.wordmark-dark {
  color: #FFFFFF;  /* Texto branco */
}
.wordmark-dark .dot {
  color: #00ADE8;  /* Ponto cyan */
}
```

### Light Mode (Secundário - se necessário)
```css
:root {
  --background: oklch(1 0 0);                /* Branco */
  --foreground: oklch(0.141 0.005 285.823);  /* Dark navy */
}

/* Wordmark em light */
.wordmark-light {
  color: #000000;  /* Texto preto */
}
.wordmark-light .dot {
  color: #00ADE8;  /* Ponto cyan - SEMPRE */
}
```

**Nota:** AtlasReg usa **dark-first**, light mode é fallback.

---

## 📦 Componentes React - Wordmark

### Componente Reutilizável

```tsx
// components/NessWordmark.tsx
interface NessWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'text-sm',   // 14px - Footer
  md: 'text-base', // 16px - Inline
  lg: 'text-2xl',  // 24px - Topbar
  xl: 'text-5xl',  // 48px - Login page
};

export function NessWordmark({ size = 'md', className = '' }: NessWordmarkProps) {
  return (
    <span className={`font-medium ${sizes[size]} ${className}`}>
      ness<span className="text-[#00ADE8]">.</span>
    </span>
  );
}

// Uso:
<NessWordmark size="lg" />  // Topbar
<NessWordmark size="xl" />  // Login page
```

### No Topbar do AtlasReg

```tsx
// Layout principal
<header className="bg-[#111317] border-b border-white/10">
  <div className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center gap-3">
      <NessWordmark size="lg" />
      <span className="text-sm text-gray-400">|</span>
      <span className="text-base text-gray-300">AtlasReg</span>
    </div>
    {/* ... resto do header */}
  </div>
</header>
```

### No Footer

```tsx
<footer className="bg-[#0B0C0E] border-t border-white/10 py-6">
  <div className="text-center">
    <p className="text-sm text-gray-500">
      Powered by <NessWordmark size="sm" /> © 2025
    </p>
  </div>
</footer>
```

---

## 🔍 Checklist de Branding

Antes de fazer deploy, verificar:

- [ ] Logo ness. aparece no topbar com ponto #00ADE8
- [ ] Fonte Montserrat Medium (peso 500) carregada
- [ ] Footer inclui "Powered by ness."
- [ ] Todos os ícones são Heroicons outline stroke-1.5
- [ ] Paleta de cores OKLCH aplicada corretamente
- [ ] Background principal é #0B0C0E (ou oklch equivalent)
- [ ] Texto principal é #EEF1F6
- [ ] Transições usam cubic-bezier(0.2, 0.8, 0.2, 1)
- [ ] Todos os pontos do wordmark ness. são #00ADE8
- [ ] Acessibilidade WCAG AA (contraste 4.5:1+)

---

## 📖 Referências

- **Design System ness.:** Memory ID 7330157
- **Branding Guidelines:** Memory ID 5513856
- **Front-End Spec:** `/docs/front-end-spec.md`
- **Google Fonts:** https://fonts.google.com/specimen/Montserrat
- **Heroicons:** https://heroicons.com

---

## 🚨 Regra de Ouro

> **O ponto do ness. é SEMPRE #00ADE8, independente da cor do texto base.**  
> Isso é não-negociável e define a identidade visual da marca.

---

**Documento preparado por:** Sarah (PO - BMad Method)  
**Última atualização:** 17 de Outubro de 2025  
**Versão:** 1.0


