# OpenNext Issue - Next.js 15.5.5

## Status
⚠️ **BLOQUEADO** - Bug confirmado em @opennextjs/cloudflare@1.11.0

## Erro
```
✘ [ERROR] Invalid alias name: "next/dist/compiled/node-fetch"
✘ [ERROR] Invalid alias name: "next/dist/compiled/ws"
✘ [ERROR] Invalid alias name: "next/dist/compiled/@ampproject/toolbox-optimizer"
✘ [ERROR] Invalid alias name: "next/dist/compiled/edge-runtime"
```

## Contexto
- **Next.js**: 15.5.5
- **@opennextjs/cloudflare**: 1.11.0 (latest)
- **@opennextjs/aws**: 3.8.5
- **Data**: 20 de Outubro de 2025

## Tentativas Realizadas

### 1. Build com open-next.config.ts
```typescript
const config = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
  edgeExternals: ['node:crypto'],
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
};
```
**Resultado**: ❌ Mesmo erro

### 2. Build com output: 'standalone'
```javascript
// next.config.mjs
output: 'standalone',
images: {
  unoptimized: true,
}
```
**Resultado**: ❌ Mesmo erro

### 3. Build com Docker (node:20-alpine)
```bash
docker run --rm -v $(pwd)/apps/web:/app -w /app node:20-alpine sh -c "npm run build"
```
**Resultado**: ✅ Next.js build OK, ❌ OpenNext bundle falha

## Análise

O problema ocorre na fase "Bundling the OpenNext server" quando o esbuild tenta processar os aliases internos do Next.js 15.5.5. 

Possíveis causas:
1. **Incompatibilidade** entre OpenNext 1.11.0 e Next.js 15.5.5 (apesar da documentação afirmar suporte)
2. **Bug no esbuild** ao processar os módulos compilados do Next.js 15
3. **Falta de configuração** específica para Next.js 15.5.x

## Soluções Alternativas

### ✅ SOLUÇÃO 1: Cloudflare Tunnel (Docker Local)
```yaml
# Já implementado em docker-compose.yml
frontend:
  ports:
    - "3100:3000"
  # Expor via cloudflared tunnel
```

**Status**: ✅ **FUNCIONAL**
- Next.js 15.5.5 rodando local
- Clerk auth funcionando
- SSR completo
- Multitenancy OK

### ⏳ SOLUÇÃO 2: Aguardar Update do OpenNext
Monitorar:
- https://github.com/opennextjs/opennextjs-cloudflare
- https://github.com/opennextjs/opennextjs-aws

Possível fix em versão 1.11.1+ ou 1.12.0

### 🔄 SOLUÇÃO 3: Downgrade Next.js
```bash
npm install next@15.0.0
# ou
npm install next@14.2.15
```
**Trade-off**: Perder features do 15.5.5

## Recomendação

**Usar Cloudflare Tunnel por enquanto:**

```bash
# 1. Build local com Docker
docker-compose up --build frontend

# 2. Expor com cloudflared
cloudflared tunnel --url http://localhost:3100

# 3. Configurar DNS
atlasREG.ness.tec.br → tunnel
```

**Vantagens**:
- ✅ Next.js 15.5.5 completo
- ✅ Clerk funcionando
- ✅ SSR/ISR/Server Actions
- ✅ Zero modificações no código
- ✅ Deploy em < 5 minutos

**Quando OpenNext funcionar**, migrar para Pages/Workers.

## Links Úteis
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---
**Email**: resper@ness.com.br  
**Status**: Em monitoramento  
**Última atualização**: 20/10/2025

