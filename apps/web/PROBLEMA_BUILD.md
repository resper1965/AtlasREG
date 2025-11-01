# 🔧 Problema: Build Falha com Google Fonts

## 📋 Status Atual

**Erro:** Build do Next.js falha ao tentar baixar fonte Montserrat do Google Fonts

```
Failed to fetch font `Montserrat`: https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap
Please check your network connection.
```

**Causa:** Ambiente de desenvolvimento sem acesso à internet ou restrições de rede

---

## 🎯 Soluções Disponíveis

### ✅ Solução 1: Fonte do Sistema (Temporário)

Comentar o Google Font e usar fonte do sistema:

```typescript
// apps/web/src/app/layout.tsx

// import { Montserrat } from 'next/font/google'

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ['400', '500', '600'],
//   variable: '--font-montserrat'
// });

// No body, usar:
<body className="min-h-screen antialiased font-sans">
```

**Vantagens:**
- Build funciona imediatamente
- Sem dependência de rede
- Boa para desenvolvimento

**Desvantagens:**
- Perde a fonte customizada
- Apenas temporário

---

### ✅ Solução 2: Self-Host da Fonte (Recomendado para Produção)

Baixar a fonte e hospedar localmente:

#### Passo 1: Baixar Montserrat

```bash
# Baixe de: https://fonts.google.com/specimen/Montserrat
# Ou use: https://google-webfonts-helper.herokuapp.com/fonts/montserrat
```

#### Passo 2: Adicionar ao Projeto

```
apps/web/
  public/
    fonts/
      montserrat/
        montserrat-400.woff2
        montserrat-500.woff2
        montserrat-600.woff2
```

#### Passo 3: Criar @font-face em globals.css

```css
/* apps/web/src/app/globals.css */

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat/montserrat-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat/montserrat-500.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Montserrat';
  src: url('/fonts/montserrat/montserrat-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

#### Passo 4: Atualizar layout.tsx

```typescript
// apps/web/src/app/layout.tsx

// Remover import do Google Font
// import { Montserrat } from 'next/font/google'

export default async function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={themeMode === 'dark' ? 'dark' : ''}>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
```

**Vantagens:**
- Build independente de rede
- Performance melhor (sem request externo)
- Controle total sobre a fonte
- Resolve o warning de `font-display: swap` do UX/UI

**Desvantagens:**
- Aumenta tamanho do bundle (~30-50kb)
- Precisa gerenciar arquivos de fonte

---

### ✅ Solução 3: Fallback com next/font (Produção)

Usar variável de ambiente para controlar:

```typescript
// apps/web/src/app/layout.tsx

let montserrat: any = null;

if (process.env.ENABLE_GOOGLE_FONTS !== 'false') {
  try {
    const { Montserrat } = require('next/font/google');
    montserrat = Montserrat({
      subsets: ["latin"],
      weight: ['400', '500', '600'],
      variable: '--font-montserrat'
    });
  } catch (e) {
    console.warn('Failed to load Google Font, using system font');
  }
}

// No body:
<body className={montserrat?.className || 'font-sans'}>
```

**Vantagens:**
- Flexível
- Graceful degradation
- Funciona em dev e prod

**Desvantagens:**
- Um pouco mais complexo

---

## 🚀 Problema OpenNext/Cloudflare

Após resolver o Google Fonts, o próximo problema é:

### Versões Atuais

```json
{
  "next": "^15.5.5",
  "@opennextjs/cloudflare": "^1.11.0",
  "@cloudflare/next-on-pages": "^1.13.16" // DEPRECATED
}
```

### Status

- **@opennextjs/cloudflare 1.11.0** é a versão mais recente
- **Next.js 15.5.5** pode não ser totalmente compatível
- **@cloudflare/next-on-pages** está deprecated e recomenda usar OpenNext

### Opções

#### Opção A: Downgrade do Next.js

```bash
npm install next@15.2.3 --save-exact
```

Versão conhecida por funcionar com OpenNext.

#### Opção B: Aguardar Atualização

OpenNext ainda está se adaptando ao Next.js 15.5+

#### Opção C: Deploy Alternativo

Usar Vercel (nativo Next.js) em vez de Cloudflare Workers:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel deploy
```

---

## 📝 Recomendação

Para **desenvolvimento imediato**:

1. ✅ Use **Solução 1** (fonte do sistema) para desbloquear o build
2. ✅ Teste o build: `npm run build`
3. ✅ Teste a aplicação: `npm run dev`

Para **produção**:

1. ✅ Use **Solução 2** (self-host) - melhor performance
2. ✅ Deploy no **Vercel** em vez de Cloudflare (mais compatível com Next.js 15)
3. ✅ Ou downgrade para Next.js 15.2.3 se precisar Cloudflare

---

## 🔍 Verificar Versões Compatíveis

```bash
# Verificar changelog do OpenNext
npm view @opennextjs/cloudflare

# Verificar releases
# https://github.com/opennextjs/opennextjs-cloudflare/releases

# Verificar compatibilidade Next.js
# https://opennext.js.org/cloudflare
```

---

## ✅ Próximos Passos

1. Escolher solução para Google Fonts
2. Testar build do Next.js
3. Se funcionar, testar OpenNext
4. Se falhar, considerar deploy alternativo

---

**Escolha sua solução e eu implemento!** 🚀
