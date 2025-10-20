# AtlasReg - Cloudflare Workers

Este diretório contém os Workers do AtlasReg para deploy na Cloudflare.

## Estrutura

```
cloudflare/
├── workers/
│   ├── api-gateway/          # Proxy para FastAPI no VPS
│   ├── trigger-ingest/       # Trigger para iniciar coletas
│   └── webhook-receiver/     # Recebe notificações do Orchestrator
└── README.md
```

## Pré-requisitos

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticar
wrangler login
```

## Deploy

### 1. Criar Cloudflare Queue

```bash
wrangler queues create atlasreg-ingest-queue
```

### 2. Criar Cloudflare KV (opcional)

```bash
wrangler kv:namespace create "STATUS_KV"
# Copiar o ID e atualizar em webhook-receiver/wrangler.toml
```

### 3. Configurar variáveis

Editar os arquivos `wrangler.toml` em cada worker:

- **api-gateway**: Atualizar `BACKEND_URL` com IP do VPS
- **trigger-ingest**: Atualizar `API_SECRET`
- **webhook-receiver**: Atualizar `HMAC_SECRET` e KV `id`

### 4. Deploy Workers

```bash
# API Gateway
cd workers/api-gateway
wrangler deploy

# Trigger Ingest
cd ../trigger-ingest
wrangler deploy

# Webhook Receiver
cd ../webhook-receiver
wrangler deploy
```

## Uso

### Trigger manual via API

```bash
curl -X POST https://atlasreg-trigger-ingest.<SEU_SUBDOMAIN>.workers.dev/trigger \
  -H "Authorization: Bearer YOUR_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "start_daily_ingest",
    "date": "2025-10-20"
  }'
```

### Health checks

```bash
# API Gateway
curl https://atlasreg-api-gateway.<SEU_SUBDOMAIN>.workers.dev/health

# Trigger Ingest
curl https://atlasreg-trigger-ingest.<SEU_SUBDOMAIN>.workers.dev/health

# Webhook Receiver
curl https://atlasreg-webhook-receiver.<SEU_SUBDOMAIN>.workers.dev/health
```

## Configurar Orchestrator

Atualizar `/home/resper/nSaulo/.env`:

```env
# Cloudflare Mode
MODE=cloudflare

# Cloudflare Credentials
CF_API_TOKEN=your_cloudflare_api_token
CF_ACCOUNT_ID=your_account_id
CF_QUEUE_NAME=atlasreg-ingest-queue

# Webhook
HOOK_ENDPOINT=https://atlasreg-webhook-receiver.<SEU_SUBDOMAIN>.workers.dev/hooks/ingest-complete
HOOK_HMAC_SECRET=<mesmo_secret_do_worker>
```

Restart Orchestrator:

```bash
docker-compose restart orchestrator
```

## Logs

```bash
# Ver logs em tempo real
wrangler tail atlasreg-trigger-ingest
wrangler tail atlasreg-webhook-receiver
```

## Custos

Todos os Workers ficam dentro do Free Tier da Cloudflare:
- 100.000 requests/dia (Workers)
- 1.000.000 mensagens/mês (Queue)
- 100.000 reads/dia (KV)

**Custo mensal estimado: $0** 🎉

## Troubleshooting

### Erro: "Queue not found"
```bash
wrangler queues list  # Verificar se a queue foi criada
```

### Erro: "Invalid signature"
Verificar se `HMAC_SECRET` é o mesmo no Orchestrator e no Worker.

### Erro: "Backend unavailable"
Verificar se o VPS está acessível e se `BACKEND_URL` está correto.

## Próximos passos

1. Criar Cloudflare R2 bucket para storage
2. Deploy frontend no Cloudflare Pages
3. Configurar domínio customizado
4. Habilitar cron triggers

---

**Powered by: ness.**

