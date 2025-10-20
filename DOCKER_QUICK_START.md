# 🐳 AtlasReg - Docker Quick Start

Guia rápido para subir o projeto no Docker Desktop.

---

## ⚡ Start em 3 Passos

### 1️⃣ Configurar Variáveis

```bash
# Copiar template
cp .env.example .env

# Editar com suas credenciais
nano .env  # ou code .env, vim .env, etc.
```

**IMPORTANTE:** Adicione sua **DATABASE_URL do Neon PostgreSQL** no `.env`

### 2️⃣ Subir Stack

```bash
docker-compose up -d
```

### 3️⃣ Acessar Aplicações

- 🌐 **Frontend:** http://localhost:3100
- 🚀 **API Docs:** http://localhost:8100/docs
- 📊 **Airflow:** http://localhost:8200 (admin/admin)
- 🌺 **Celery Flower:** http://localhost:5600
- 📦 **MinIO Console:** http://localhost:9101 (admin/atlasreg2025)

---

## 🎯 Portas Usadas (Livres)

| Serviço | Porta | Status Check |
|---------|-------|--------------|
| Frontend | 3100 | http://localhost:3100 |
| API | 8100 | http://localhost:8100/health |
| Airflow | 8200 | http://localhost:8200 |
| Flower | 5600 | http://localhost:5600 |
| MinIO Console | 9101 | http://localhost:9101 |
| MinIO API | 9100 | - |
| Elasticsearch | 9300 | http://localhost:9300 |
| Redis | 6380 | - |

---

## 🔍 Verificar Status

```bash
# Ver todos os containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f web
```

---

## 🛑 Parar e Reiniciar

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (APAGA DADOS!)
docker-compose down -v

# Reiniciar um serviço
docker-compose restart api

# Rebuild e restart
docker-compose up -d --build api
```

---

## 🐛 Problemas Comuns

### Porta já em uso

```bash
# Ver qual processo está usando
lsof -i :3100  # troque pela porta com problema

# Ou mude a porta no docker-compose.yml
# Ex: "3200:3000" ao invés de "3100:3000"
```

### Serviço não inicia

```bash
# Ver logs detalhados
docker-compose logs <nome-do-serviço>

# Forçar rebuild
docker-compose build --no-cache <nome-do-serviço>
docker-compose up -d <nome-do-serviço>
```

### Conectar ao PostgreSQL falha

1. Verifique se DATABASE_URL está correta no `.env`
2. Confirme que o banco Neon está acessível
3. Teste a conexão:
```bash
docker exec -it atlasreg-api python -c "from app.database import engine; engine.connect()"
```

---

## 📚 Documentação Completa

- **Docker Setup Completo:** `/docker/README.md`
- **Architecture:** `/docs/fullstack-architecture.md`
- **API Documentation:** http://localhost:8100/docs (após subir)

---

## 🎬 Primeira Execução Completa

```bash
# 1. Setup
cp .env.example .env
# Edite .env com DATABASE_URL do Neon

# 2. Criar estrutura de diretórios (opcional, será criado automaticamente)
mkdir -p apps/{web,api,scraper}

# 3. Subir stack
docker-compose up -d

# 4. Aguardar serviços ficarem healthy (~2-3 min)
watch docker-compose ps

# 5. Inicializar database (quando API estiver rodando)
docker exec -it atlasreg-api alembic upgrade head

# 6. Acessar aplicações
open http://localhost:3100  # Frontend
open http://localhost:8100/docs  # API Docs
open http://localhost:8200  # Airflow
```

---

## ✅ Checklist de Saúde

Após `docker-compose up -d`, verifique:

- [ ] `docker-compose ps` mostra todos serviços "Up" e "healthy"
- [ ] http://localhost:8100/health retorna `{"status": "ok"}`
- [ ] http://localhost:9300 retorna JSON do Elasticsearch
- [ ] MinIO Console acessível em http://localhost:9101
- [ ] Redis responde: `docker exec atlasreg-redis redis-cli ping` → `PONG`

Se algum check falhar:
```bash
docker-compose logs <serviço-com-problema>
```

---

**Pronto!** Stack AtlasReg rodando localmente em portas livres! 🚀

Para desenvolvimento, consulte `/docs/prd/epic-1-foundation.md` e comece pelas stories.


