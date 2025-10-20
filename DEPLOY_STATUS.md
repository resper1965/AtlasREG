# 🚀 AtlasReg - Deploy Status

**Data:** 17 de Outubro de 2025  
**Status:** ✅ **Infraestrutura Básica RODANDO**

---

## ✅ Serviços Ativos

| Serviço | Status | Porta | URL/Acesso |
|---------|--------|-------|------------|
| **Redis** | ✅ HEALTHY | 6381 | `localhost:6381` |
| **MinIO** | ✅ HEALTHY | 19000 (API)<br>19001 (Console) | http://localhost:19001 |
| **Elasticsearch** | ✅ STARTING | 19200 | http://localhost:19200 |

---

## 🌐 URLs de Acesso

### MinIO Console (Object Storage)
- **URL:** http://localhost:19001
- **Username:** `admin`
- **Password:** `atlasreg2025`
- **Uso:** Criar buckets, upload/download de PDFs

### Elasticsearch
- **URL:** http://localhost:19200
- **API Health:** http://localhost:19200/_cluster/health
- **Uso:** Busca full-text de eventos

### Redis
- **Host:** localhost
- **Port:** 6381
- **Uso:** Cache, Celery message broker

---

## 📋 Comandos Úteis

### Verificar Status
```bash
# Ver todos os containers
docker ps --filter "name=atlasreg"

# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de um serviço específico
docker-compose -f docker-compose.dev.yml logs -f redis
```

### Testar Serviços
```bash
# Redis
docker exec atlasreg-redis redis-cli ping
# Deve retornar: PONG

# Elasticsearch
curl http://localhost:19200
# Deve retornar JSON com cluster info

# MinIO
curl http://localhost:19000/minio/health/live
# Deve retornar 200 OK
```

### Gerenciar Containers
```bash
# Parar tudo
docker-compose -f docker-compose.dev.yml down

# Restart um serviço
docker-compose -f docker-compose.dev.yml restart minio

# Ver uso de recursos
docker stats --filter "name=atlasreg"
```

---

## 🔧 Próximos Passos

### 1. Configurar MinIO (Criar Buckets)
```bash
# Acessar MinIO Console
open http://localhost:19001

# Login: admin / atlasreg2025

# Criar buckets:
# - raw-documents
# - processed-documents
```

### 2. Verificar Elasticsearch
```bash
# Aguardar ficar healthy (~30s)
curl http://localhost:19200/_cluster/health

# Criar index de eventos (será feito pela API depois)
```

### 3. Implementar Aplicações
- ⏭️ **API (FastAPI):** `apps/api/` - Story 1.7
- ⏭️ **Frontend (Next.js):** `apps/web/` - Story 1.8
- ⏭️ **Scraper (Airflow):** `apps/scraper/` - Story 1.6

---

## 📊 Resources Alocados

- **RAM:** ~1.5GB total
  - Redis: ~50MB
  - MinIO: ~200MB
  - Elasticsearch: ~1GB

- **Disk:** ~800MB (imagens) + volumes (crescem conforme uso)

- **CPU:** Mínimo (~5% idle)

---

## ✅ Health Check

Execute este script para verificar todos os serviços:

```bash
echo "=== AtlasReg Health Check ==="
echo ""
echo "Redis:"
docker exec atlasreg-redis redis-cli ping
echo ""
echo "MinIO:"
curl -s http://localhost:19000/minio/health/live && echo " OK" || echo " FAIL"
echo ""
echo "Elasticsearch:"
curl -s http://localhost:19200/_cluster/health | grep -o '"status":"[^"]*"'
echo ""
echo "=== Containers Status ==="
docker ps --filter "name=atlasreg" --format "{{.Names}}: {{.Status}}"
```

---

## 🎯 Status Geral

✅ **Infraestrutura de dados funcionando!**

**Prontos para desenvolvimento:**
- ✅ Redis (cache & queue) - porta 6381
- ✅ MinIO (storage) - portas 19000/19001
- ✅ Elasticsearch (search) - porta 19200

**Próximo milestone:**
- Implementar **Story 1.7** (FastAPI + Auth)
- Implementar **Story 1.8** (Next.js + Login)
- Adicionar serviços API e Web ao docker-compose

**Comandos para parar:**
```bash
docker-compose -f docker-compose.dev.yml down
```

---

**Última atualização:** 17/10/2025 15:20 BRT  
**Docker Compose:** `docker-compose.dev.yml`  
**Status:** ✅ Operational


