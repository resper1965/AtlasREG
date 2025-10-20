# AtlasReg - Docker Setup

Configuração Docker completa para desenvolvimento local no Docker Desktop.

---

## 🚀 Quick Start

### 1. Pré-requisitos

- Docker Desktop instalado e rodando
- 8GB+ RAM disponível
- 20GB+ espaço em disco

### 2. Configuração Inicial

```bash
# 1. Copiar .env.example para .env
cp .env.example .env

# 2. Editar .env com suas credenciais (especialmente DATABASE_URL do Neon)
nano .env  # ou use seu editor preferido

# 3. Criar diretórios necessários (será feito automaticamente, mas pode criar antes)
mkdir -p apps/{web,api,scraper}/{src,tests}
mkdir -p models
```

### 3. Subir Stack Completa

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver status
docker-compose ps
```

---

## 🌐 Portas e Acessos

| Serviço | Porta Externa | Porta Interna | URL de Acesso |
|---------|---------------|---------------|---------------|
| **Frontend (Next.js)** | 3100 | 3000 | http://localhost:3100 |
| **API (FastAPI)** | 8100 | 8000 | http://localhost:8100 |
| **API Docs (Swagger)** | 8100 | 8000 | http://localhost:8100/docs |
| **Airflow UI** | 8200 | 8080 | http://localhost:8200 |
| **Celery Flower** | 5600 | 5555 | http://localhost:5600 |
| **MinIO Console** | 9101 | 9001 | http://localhost:9101 |
| **MinIO API** | 9100 | 9000 | http://localhost:9100 |
| **Elasticsearch** | 9300 | 9200 | http://localhost:9300 |
| **Redis** | 6380 | 6379 | localhost:6380 |

### Credenciais Padrão

**MinIO Console:**
- URL: http://localhost:9101
- Username: `admin`
- Password: `atlasreg2025`

**Airflow:**
- URL: http://localhost:8200
- Username: `admin`
- Password: `admin`

---

## 📦 Serviços

### Databases & Storage

#### Redis (Cache & Queue)
```bash
# Conectar via CLI
docker exec -it atlasreg-redis redis-cli

# Verificar chaves
docker exec -it atlasreg-redis redis-cli KEYS '*'
```

#### MinIO (Object Storage)
```bash
# Acessar console
open http://localhost:9101

# Criar buckets via mc client (dentro do container)
docker exec -it atlasreg-minio sh
mc alias set local http://localhost:9000 admin atlasreg2025
mc mb local/raw-documents
mc mb local/processed-documents
```

#### Elasticsearch (Search)
```bash
# Verificar health
curl http://localhost:9300/_cluster/health

# Ver indices
curl http://localhost:9300/_cat/indices
```

### Backend Services

#### API (FastAPI)
```bash
# Ver logs
docker-compose logs -f api

# Restart
docker-compose restart api

# Acessar shell
docker exec -it atlasreg-api bash

# Run migrations
docker exec -it atlasreg-api alembic upgrade head
```

#### Airflow (Scraping)
```bash
# Ver logs scheduler
docker-compose logs -f airflow-scheduler

# Trigger DAG manualmente
docker exec -it atlasreg-airflow-webserver airflow dags trigger aneel_news_scraper

# Listar DAGs
docker exec -it atlasreg-airflow-webserver airflow dags list
```

#### Celery (Processing)
```bash
# Ver workers ativos
docker exec -it atlasreg-celery-worker celery -A celery_app inspect active

# Ver tasks registradas
docker exec -it atlasreg-celery-worker celery -A celery_app inspect registered

# Flower UI para monitoring
open http://localhost:5600
```

### Frontend

#### Next.js
```bash
# Ver logs
docker-compose logs -f web

# Rebuild
docker-compose up -d --build web

# Acessar shell
docker exec -it atlasreg-web sh

# Install new package
docker exec -it atlasreg-web npm install <package>
```

---

## 🛠️ Comandos Úteis

### Gerenciamento de Serviços

```bash
# Subir apenas serviços específicos
docker-compose up -d redis minio elasticsearch

# Parar tudo
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Rebuild um serviço
docker-compose up -d --build api

# Ver uso de recursos
docker stats

# Limpar containers parados e imagens não usadas
docker system prune -a
```

### Debugging

```bash
# Ver logs de um serviço específico
docker-compose logs -f <service-name>

# Ver logs com tail
docker-compose logs -f --tail=100 api

# Entrar no container
docker exec -it atlasreg-<service> bash  # ou sh para Alpine

# Verificar variáveis de ambiente
docker exec atlasreg-api env
```

### Database

```bash
# Conectar ao PostgreSQL (Neon - remoto)
# Use a DATABASE_URL do seu .env com psql ou DBeaver

# Rodar migrations
docker exec -it atlasreg-api alembic upgrade head

# Criar nova migration
docker exec -it atlasreg-api alembic revision --autogenerate -m "description"

# Rollback migration
docker exec -it atlasreg-api alembic downgrade -1
```

---

## 🔧 Development Workflow

### Primeira Vez

1. **Setup inicial:**
```bash
cp .env.example .env
# Editar .env com DATABASE_URL do Neon
docker-compose up -d
```

2. **Aguardar serviços ficarem healthy:**
```bash
# Monitorar status
watch docker-compose ps

# Ou ver logs
docker-compose logs -f
```

3. **Inicializar database:**
```bash
docker exec -it atlasreg-api alembic upgrade head
docker exec -it atlasreg-api python scripts/seed_data.py  # se existir
```

4. **Acessar aplicações:**
- Frontend: http://localhost:3100
- API Docs: http://localhost:8100/docs
- Airflow: http://localhost:8200

### Desenvolvimento Diário

```bash
# Iniciar stack
docker-compose up -d

# Trabalhar no código (hot-reload ativo)
# - API: uvicorn com --reload
# - Frontend: next dev com fast refresh

# Ver logs em tempo real
docker-compose logs -f api web

# Parar ao final do dia
docker-compose down
```

### Testes

```bash
# API tests
docker exec -it atlasreg-api pytest

# Frontend tests
docker exec -it atlasreg-web npm test

# E2E tests
docker exec -it atlasreg-web npm run test:e2e
```

---

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Ver processo usando a porta
lsof -i :3100  # ou qualquer porta

# Matar processo
kill -9 <PID>

# Ou mudar porta no docker-compose.yml
# "3200:3000" ao invés de "3100:3000"
```

### Serviço não inicia

```bash
# Ver logs detalhados
docker-compose logs <service>

# Verificar health check
docker inspect atlasreg-<service> | grep Health

# Restart forçado
docker-compose restart <service>
```

### Volumes corrompidos

```bash
# Parar tudo
docker-compose down

# Remover volumes específicos
docker volume rm atlasreg_redis_data

# Ou remover tudo (CUIDADO)
docker-compose down -v

# Subir novamente
docker-compose up -d
```

### Build falha

```bash
# Limpar cache de build
docker-compose build --no-cache <service>

# Ou rebuild tudo
docker-compose build --no-cache
docker-compose up -d
```

### Conexão com Neon falha

```bash
# Verificar DATABASE_URL no .env
cat .env | grep DATABASE_URL

# Testar conexão
docker exec -it atlasreg-api python -c "from app.database import engine; print(engine.url)"

# Ver logs da API
docker-compose logs api | grep -i database
```

---

## 📊 Monitoramento

### Health Checks

```bash
# API
curl http://localhost:8100/health

# Elasticsearch
curl http://localhost:9300/_cluster/health

# Redis
docker exec atlasreg-redis redis-cli ping
```

### Metrics

- **Celery Flower:** http://localhost:5600 - Worker stats, tasks, etc
- **Airflow:** http://localhost:8200 - DAG runs, task instances
- **Docker Desktop:** Containers tab - CPU, Memory usage

---

## 🚀 Deploy para Produção

Este docker-compose é para **desenvolvimento local**. Para produção:

1. Usar imagens otimizadas (multi-stage builds)
2. Remover hot-reload (--reload, dev server)
3. Configurar secrets manager (não .env)
4. Usar orchestrator (Kubernetes, Docker Swarm)
5. Configurar Traefik para SSL/HTTPS
6. Habilitar autenticação em todos os serviços
7. Configurar backups automáticos
8. Monitoring (Prometheus + Grafana)

Ver: `/docs/architecture/deployment.md`

---

## 📚 Referências

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [FastAPI Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Airflow Docker](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html)

---

**Última atualização:** 2025-10-17  
**Versão:** 1.0


