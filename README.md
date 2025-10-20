# AtlasReg

Sistema de Monitoramento Regulatório com IA para coleta, processamento e análise de notícias e documentos de órgãos reguladores brasileiros.

## 🌐 Domínio

**https://atlasREG.ness.tec.br**

## 🚀 Tecnologias

### Frontend
- Next.js 15 (Turbopack)
- React
- TypeScript
- Tailwind CSS

### Backend
- FastAPI (Python)
- PostgreSQL
- Redis
- MinIO (S3-compatible)
- Elasticsearch

### Orquestração
- **Orchestrator** (Python 3.11) - Integração Cloudflare
- Apache Airflow - Workflows
- Celery - Processamento assíncrono

### Scrapers
- Scrapy - Sites estáticos
- Playwright - Sites JavaScript

### IA/ML
- BERTimbau - Classificação
- SBERT + FAISS - Busca semântica
- spaCy - NER

### Cloudflare Edge
- Workers (3) - API Gateway, Trigger, Webhook
- Queue - Mensageria
- KV - Configuração
- R2 - Storage
- Pages - Frontend estático

## 📦 Containers

11 containers Docker:
- `atlasreg-web` - Frontend
- `atlasreg-api` - Backend API
- `atlasreg-orchestrator` - Orquestrador Cloudflare
- `atlasreg-airflow-webserver` - Airflow UI
- `atlasreg-airflow-scheduler` - Airflow Scheduler
- `atlasreg-celery-worker` - Workers
- `atlasreg-celery-beat` - Scheduler
- `atlasreg-celery-flower` - Monitor
- `atlasreg-redis` - Cache/Queue
- `atlasreg-minio` - Storage S3
- `atlasreg-elasticsearch` - Search

## 🔧 Setup Local

```bash
# Clonar repositório
git clone https://github.com/SEU_USER/atlasreg.git
cd atlasreg

# Subir containers
docker-compose up -d

# Acessar
# Frontend: http://localhost:3100
# API: http://localhost:8200
# Airflow: http://localhost:8300
```

## ☁️ Deploy Cloudflare

```bash
# Deploy automático
./DEPLOY_AUTOMATICO.sh

# Ou manual
cd cloudflare/workers/api-gateway && wrangler deploy
cd ../trigger-ingest && wrangler deploy
cd ../webhook-receiver && wrangler deploy
```

## 📚 Documentação

- `COMECE_AQUI.txt` - Guia rápido
- `DEPLOY_PRONTO_atlasREG.txt` - Deploy Cloudflare
- `SISTEMA_ATLASREG_COMPLETO.txt` - Documentação técnica
- `cloudflare/README.md` - Workers

## 🔐 Segurança

- Senhas aleatórias seguras (48-64 caracteres)
- HMAC-SHA256 para webhooks
- Bearer token authentication
- SSL/TLS automático (Cloudflare)

## 💰 Custo

**$0/mês** (Cloudflare Free Tier)

## 📧 Contato

**Email:** resper@ness.com.br  
**Powered by: ness.**

---

**Data:** Outubro 2025  
**Versão:** 2.0.0  
**Status:** ✓ Operacional
