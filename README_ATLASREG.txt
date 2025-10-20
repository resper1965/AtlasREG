╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                          A T L A S R E G                                     ║
║                                                                              ║
║            Sistema de Monitoramento Regulatório com IA                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

================================================================================
INFORMAÇÕES DO PROJETO
================================================================================

NOME:          AtlasReg (ou AtlasREG)
LOCALIZAÇÃO:   /home/resper/nSaulo
STATUS:        ✓ OPERACIONAL (11 containers rodando)
ISOLAMENTO:    ✓ 100% SEGREGADO (network e volumes exclusivos)

================================================================================
CONTAINERS ATLASREG (11)
================================================================================

Todos com prefixo "atlasreg-":

  Frontend & Backend:
  ├─ atlasreg-web                  (Next.js - http://localhost:3100)
  └─ atlasreg-api                  (FastAPI - http://localhost:8200)

  Orquestração:
  ├─ atlasreg-orchestrator         (Python Cloudflare Integration)
  ├─ atlasreg-airflow-webserver    (UI - http://localhost:8300)
  └─ atlasreg-airflow-scheduler    (Scheduler)

  Processamento:
  ├─ atlasreg-celery-worker        (Workers assíncronos)
  ├─ atlasreg-celery-beat          (Scheduler)
  └─ atlasreg-celery-flower        (Monitor - http://localhost:5600)

  Infraestrutura:
  ├─ atlasreg-redis                (Cache/Queue - porta 6382)
  ├─ atlasreg-minio                (S3 Storage - portas 9200/9201)
  └─ atlasreg-elasticsearch        (Search Engine - porta 9300)

================================================================================
ACESSO RÁPIDO
================================================================================

Frontend:          http://localhost:3100
API:               http://localhost:8200
Airflow:           http://localhost:8300 (admin/admin)
Celery Flower:     http://localhost:5600
MinIO Console:     http://localhost:9201 (admin/atlasreg2025)
Elasticsearch:     http://localhost:9300

================================================================================
COMANDOS PRINCIPAIS
================================================================================

Subir tudo:        cd /home/resper/nSaulo && docker-compose up -d
Parar tudo:        cd /home/resper/nSaulo && docker-compose stop
Ver logs:          cd /home/resper/nSaulo && docker-compose logs -f
Ver status:        docker ps | grep atlasreg
Restart serviço:   docker-compose restart <service>

================================================================================
TESTE RÁPIDO: ORCHESTRATOR
================================================================================

# 1. Enviar mensagem de teste
docker exec atlasreg-redis redis-cli -n 2 RPUSH orchestrator:queue:ingest-queue \
  '{"type":"start_daily_ingest","date":"2025-10-20"}'

# 2. Ver processamento
docker logs -f atlasreg-orchestrator

================================================================================
SEGREGAÇÃO CONFIRMADA
================================================================================

✓ Network exclusiva:  atlasreg_atlasreg-network
✓ Volumes isolados:   atlasreg_*
✓ Portas exclusivas:  3100, 5600, 6382, 8200, 8300, 9200, 9201, 9300
✓ ZERO interferência com outros projetos no servidor

Outros projetos detectados (NÃO fazem parte do AtlasReg):
- privacy-dataset-frontend
- app-admin-dashboard
- app-backend

================================================================================
DOCUMENTAÇÃO
================================================================================

COMO_COMECAR.txt                 → Guia rápido de uso
SEGREGACAO_ATLASREG.txt          → Detalhes de isolamento
IDENTIDADE_ATLASREG.txt          → Identidade do projeto
DEPLOY_CLOUDFLARE_GUIA.txt       → Integração Cloudflare
STATUS_COMPLETO_FINAL.txt        → Status atual
SISTEMA_ATLASREG_COMPLETO.txt    → Documentação técnica completa

apps/orchestrator/README.md      → Guia do Orchestrator
docs/CURSOR_TECNICA_COMPLETA.txt → Arquitetura técnica

================================================================================
ARQUITETURA
================================================================================

Cloudflare Edge (Futuro)
    │
    ↓ Queue
    │
Orchestrator ← Redis Queue (Modo Standalone Atual)
    │
    ├→ Airflow → DAGs → Scrapers
    ├→ Celery → Tasks → Processamento
    └→ IA/ML → BERTimbau + SBERT → Elasticsearch
              │
              └→ MinIO (JSON Gold)

================================================================================
POWERED BY
================================================================================

- Next.js 15 (Frontend)
- FastAPI (Backend)
- Python 3.11 (Orchestrator)
- Scrapy + Playwright (Scrapers)
- Airflow + Celery (Orquestração)
- BERTimbau + SBERT + FAISS (IA)
- PostgreSQL + Redis + MinIO + Elasticsearch (Dados)
- Docker + Docker Compose (Containerização)

================================================================================
DESENVOLVIDO POR: ness.
DATA: Outubro 2025
VERSÃO: 2.0.0
================================================================================
