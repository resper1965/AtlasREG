# AtlasReg Cursor v2.0

**Orquestrador Cloudflare-Python para AtlasReg Core**

Powered by: ness. (Montserrat Medium, ponto em #00ADE8)

---

## Visão Geral

O **AtlasReg Cursor** é um serviço Python de longa duração que atua como orquestrador entre a infraestrutura Cloudflare Edge e o motor de IA/Processamento do AtlasReg Core.

### Responsabilidades

- ✅ Consumir mensagens da Cloudflare Queue (ou Redis em modo standalone)
- ✅ Buscar configuração do Cloudflare KV
- ✅ Acionar scrapers e processamento no AtlasReg Core
- ✅ Publicar JSON Gold no Cloudflare R2 (ou MinIO)
- ✅ Notificar Cloudflare Worker via webhook com HMAC

### Arquitetura

```
Cloudflare Edge          AtlasReg Cursor           AtlasReg Core
├─ Queue             →   CFQueueConsumer    →     Airflow DAGs
├─ KV                →   CFConfigClient            ↓
├─ R2                ←   R2Publisher          ←   Celery Workers
└─ Worker (hooks)    ←   Notifier             ←   Scrapers + IA
```

---

## Instalação

### Requisitos

- Python 3.11+
- Docker e Docker Compose
- AtlasReg Core rodando

### Setup Local

```bash
# 1. Criar ambiente virtual
cd apps/cursor
python3.11 -m venv venv
source venv/bin/activate

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar variáveis
cp .env.example .env
# Editar .env com credenciais

# 4. Executar
python cursor_main.py
```

### Setup Docker

```bash
# Build container
docker-compose build cursor

# Subir cursor
docker-compose up -d cursor

# Logs
docker logs -f atlasreg-cursor

# Status
docker ps | grep cursor
```

---

## Configuração

### Variáveis de Ambiente

**Modo de Operação:**
```bash
MODE=standalone  # standalone (Redis) ou cloudflare (CF Queue)
```

**Cloudflare (modo cloudflare):**
```bash
CF_API_ENDPOINT=https://api.cloudflare.com
CF_API_TOKEN=your_token_here
CF_ACCOUNT_ID=your_account_id
CF_QUEUE_ENDPOINT=https://...
CF_KV_API_ENDPOINT=https://...
CF_KV_NAMESPACE_ID=your_namespace_id
```

**R2 Storage:**
```bash
R2_ENDPOINT=https://...
R2_ACCESS_KEY=your_key
R2_SECRET_KEY=your_secret
R2_BUCKET_NAME=atlasreg-gold
```

**Webhook:**
```bash
HOOK_ENDPOINT=https://your-worker.workers.dev
HOOK_HMAC_SECRET=your_secret_here
```

**AtlasReg Core:**
```bash
DATABASE_URL=postgresql://...
CELERY_BROKER_URL=redis://redis:6379/1
AIRFLOW_API_URL=http://airflow-webserver:8080
MINIO_ENDPOINT=minio:9000
ELASTICSEARCH_URL=http://elasticsearch:9200
REDIS_URL=redis://redis:6379/2
```

---

## Arquitetura de Módulos

### Estrutura de Pastas

```
apps/cursor/
├── cursor_main.py           # Entry point principal
├── config/
│   ├── settings.py          # Pydantic Settings
│   └── news_watchlist_config.json  # Config local fallback
├── modules/
│   ├── cf_config_client.py  # Client KV
│   ├── cf_queue_consumer.py # Consumer Queue
│   ├── r2_publisher.py      # Publisher R2/MinIO
│   ├── hmac_signer.py       # HMAC assinatura
│   ├── notifier.py          # Webhook notifier
│   └── atlasreg_executor.py # Executor principal (facade)
├── adapters/
│   ├── airflow_adapter.py   # Trigger Airflow DAGs
│   ├── celery_adapter.py    # Send Celery tasks
│   └── scraper_adapter.py   # Run Scrapy diretamente
├── utils/
│   ├── logger.py            # Structured logging
│   └── retry.py             # Retry decorators
└── requirements.txt
```

### Componentes Principais

#### 1. CFQueueConsumer

Consome mensagens da fila (Cloudflare Queue ou Redis List).

```python
consumer = CFQueueConsumer(mode="standalone", redis_url="redis://...")
message = consumer.poll(timeout=30)
```

**Mensagens Suportadas:**
- `start_daily_ingest`: Rotina diária de coleta
- `reprocess`: Re-processar data específica

#### 2. CFConfigClient

Busca configuração do Cloudflare KV (ou arquivo local).

```python
config_client = CFConfigClient(kv_api_endpoint="...", api_token="...")
config = config_client.get_config("NEWS_WATCHLIST_CONFIG")
```

**Config Schema:**
```json
{
  "sources": [
    {
      "id": "aneel_news",
      "handler_id": "SCRAPY_CVM_API",
      "url_feed": "https://...",
      "enabled": true
    }
  ]
}
```

#### 3. AtlasRegExecutor

Facade que executa scrapers e processamento.

```python
executor = AtlasRegExecutor(airflow, celery, scraper)
result = executor.execute_source(source_config, run_id)
```

**Handlers Suportados:**
- `SCRAPY_CVM_API`: Scrapy spider tipo API
- `SCRAPY_NEWSROOM_PLAYER`: Scrapy com player_id
- `DOWNLOAD_CSV`: Download direto
- `AIRFLOW_DAG`: Trigger DAG específico
- `CUSTOM_SCRAPER`: Handler customizado

#### 4. R2Publisher

Publica JSON Gold no R2 (ou MinIO).

```python
publisher = R2Publisher(endpoint_url="...", access_key="...", secret_key="...")
result = publisher.publish(data=gold_json, key="gold/2025-10-20/run_123.json")
```

**Funcionalidades:**
- SHA256 hash automático
- Metadata customizada
- Presigned URLs
- List objects

#### 5. Notifier

Notifica Cloudflare Worker via webhook assinado.

```python
notifier = Notifier(hook_endpoint="...", hmac_secret="...")
notifier.notify_ingest_complete(
    run_id="run_123",
    status="success",
    file_path="gold/2025-10-20/run_123.json",
    sha256="abc123...",
    documents_count=65
)
```

---

## Fluxo de Execução

### 1. Rotina Diária (`start_daily_ingest`)

```
1. Receber mensagem da fila
   ↓
2. Buscar config do KV (lista de fontes ativas)
   ↓
3. Para cada fonte:
   a. Identificar handler_id
   b. Acionar scraper apropriado (Airflow/Celery/Scrapy)
   c. Aguardar conclusão
   ↓
4. Trigger processamento IA (Celery tasks)
   - Classificação BERTimbau
   - Extração de entidades spaCy
   - Indexação FAISS + Elasticsearch
   ↓
5. Gerar JSON Gold consolidado
   ↓
6. Calcular SHA256
   ↓
7. Publicar no R2/MinIO
   ↓
8. Notificar webhook (com HMAC)
   ↓
9. Done ✅
```

### 2. Re-processamento (`reprocess`)

```
1. Receber mensagem com data específica
   ↓
2. Trigger task de reprocessamento
   ↓
3. Aguardar conclusão
   ↓
4. Gerar JSON Gold
   ↓
5. Publicar no R2
   ↓
6. Notificar webhook
   ↓
7. Done ✅
```

---

## Adapters Pattern

O Cursor usa **Adapter Pattern** para se integrar com diferentes componentes do AtlasReg Core:

### AirflowAdapter

Trigger DAGs via REST API.

```python
airflow = AirflowAdapter(
    api_url="http://airflow-webserver:8080",
    username="admin",
    password="admin"
)

# Trigger DAG
dag_run = airflow.trigger_dag(
    dag_id="aneel_news_daily",
    conf={'run_id': 'run_123'}
)

# Aguardar conclusão
status = airflow.wait_for_completion(
    dag_id="aneel_news_daily",
    dag_run_id=dag_run['dag_run_id'],
    timeout=1800
)
```

### CeleryAdapter

Envia tasks para workers.

```python
celery = CeleryAdapter(
    broker_url="redis://redis:6379/1",
    result_backend="redis://redis:6379/1"
)

# Enviar task
result = celery.send_task('process_document', args=[doc_id, run_id])

# Aguardar resultado
output = celery.wait_for_task(result, timeout=300)
```

### ScraperAdapter

Executa scrapers diretamente (fallback).

```python
scraper = ScraperAdapter(scrapy_project_path="/app/scrapers")

result = scraper.run_spider(
    spider_name="aneel_news",
    args={'url': 'https://...', 'run_id': 'run_123'}
)
```

---

## Modo Standalone vs Cloudflare

### Standalone Mode (Desenvolvimento)

```bash
MODE=standalone
REDIS_URL=redis://redis:6379/2
```

**Características:**
- Queue: Redis List (`cursor:queue:ingest-queue`)
- Config: Arquivo local (`config/news_watchlist_config.json`)
- Storage: MinIO local
- Hook: API local ou skip

**Vantagens:**
- Sem dependências externas
- Fácil debug
- Testes locais

### Cloudflare Mode (Produção)

```bash
MODE=cloudflare
CF_QUEUE_ENDPOINT=https://...
CF_KV_API_ENDPOINT=https://...
R2_ENDPOINT=https://...
```

**Características:**
- Queue: Cloudflare Queue real
- Config: Cloudflare KV
- Storage: Cloudflare R2
- Hook: Cloudflare Worker

**Vantagens:**
- Serverless
- Global distribution
- Alta disponibilidade

---

## Testing

### Test Mode com Mock Messages

```python
# apps/cursor/test_cursor.py

from modules.cf_queue_consumer import CFQueueConsumer
import redis

# Setup
consumer = CFQueueConsumer(mode="standalone", redis_url="redis://localhost:6382/2")

# Push mock message
mock_message = {
    'type': 'start_daily_ingest',
    'date': '2025-10-20',
    'payload': {}
}

consumer.push_mock_message(mock_message)

# Poll
message = consumer.poll(timeout=5)
print(f"Received: {message}")
```

### Integration Tests

```bash
# Executar testes
cd apps/cursor
pytest tests/ -v

# Testes específicos
pytest tests/test_adapters.py -v
pytest tests/test_executor.py -v
pytest tests/test_publisher.py -v
```

---

## Monitoring

### Logs Estruturados

Cursor usa **structlog** para logs JSON:

```json
{
  "event": "source_execution_complete",
  "level": "info",
  "timestamp": "2025-10-20T09:15:32.123Z",
  "source_id": "aneel_news",
  "run_id": "run_abc123",
  "success": true,
  "items_count": 8
}
```

### Metrics (Prometheus)

```python
# Expor métricas
from prometheus_client import Counter, Histogram

messages_processed = Counter('cursor_messages_processed_total', 'Total messages')
processing_duration = Histogram('cursor_processing_duration_seconds', 'Processing time')
```

### Health Check

```bash
# Container health
docker exec atlasreg-cursor python -c "import redis; r=redis.from_url('redis://redis:6379/2'); print(r.ping())"

# Logs
docker logs atlasreg-cursor --tail 100 -f
```

---

## Troubleshooting

### Problema: Cursor não consome mensagens

**Diagnóstico:**
```bash
# Verificar fila Redis
docker exec atlasreg-redis redis-cli -n 2 LLEN cursor:queue:ingest-queue
```

**Solução:**
- Verificar MODE está correto
- Verificar REDIS_URL
- Verificar container está rodando

### Problema: Airflow trigger falha

**Diagnóstico:**
```bash
# Testar Airflow API
curl -u admin:admin http://localhost:8300/api/v1/dags
```

**Solução:**
- Habilitar Airflow API em airflow.cfg
- Verificar credenciais
- Verificar network entre containers

### Problema: Celery task timeout

**Diagnóstico:**
```bash
# Verificar workers
docker exec atlasreg-celery-worker celery -A celery_app inspect active
```

**Solução:**
- Aumentar timeout
- Verificar workers ativos
- Check broker Redis

### Problema: R2 upload falha

**Diagnóstico:**
```python
# Test boto3 connection
import boto3
s3 = boto3.client('s3', endpoint_url='http://minio:9000', ...)
s3.list_buckets()
```

**Solução:**
- Verificar credenciais
- Criar bucket se não existir
- Verificar network

---

## Development

### Adicionar Novo Handler

1. Editar `modules/atlasreg_executor.py`:

```python
def _handle_my_custom(self, source_config, run_id):
    """Handler customizado"""
    # Implementação
    pass

# Registrar no __init__
self.handlers['MY_CUSTOM'] = self._handle_my_custom
```

2. Adicionar fonte no `config/news_watchlist_config.json`:

```json
{
  "id": "my_source",
  "handler_id": "MY_CUSTOM",
  "enabled": true
}
```

### Adicionar Nova Mensagem

1. Editar `cursor_main.py`:

```python
def process_message(self, message):
    msg_type = message.get('type')
    
    if msg_type == 'my_new_message':
        self._handle_my_new_message(message)
```

---

## API Reference

### CFQueueConsumer

```python
class CFQueueConsumer:
    def __init__(self, mode, cf_queue_endpoint, cf_api_token, redis_url, queue_name)
    def poll(self, timeout: int) -> Optional[Dict]
    def push_mock_message(self, message: Dict) -> None
    def start_consuming(self, message_handler: Callable, poll_interval: int) -> None
```

### AtlasRegExecutor

```python
class AtlasRegExecutor:
    def __init__(self, airflow_adapter, celery_adapter, scraper_adapter)
    def execute_source(self, source_config: Dict, run_id: str) -> Dict
    def execute_batch(self, sources: List[Dict], run_id: str) -> Dict
    def trigger_processing(self, document_ids: List[str], run_id: str) -> List
    def generate_gold_json(self, run_id: str, date: str) -> AsyncResult
```

### R2Publisher

```python
class R2Publisher:
    def __init__(self, endpoint_url, access_key, secret_key, bucket_name)
    def publish(self, data: Dict, key: str, metadata: Dict) -> Dict
    def get(self, key: str) -> Dict
    def list_objects(self, prefix: str) -> List
    def calculate_sha256(self, data: Dict) -> str
```

### Notifier

```python
class Notifier:
    def __init__(self, hook_endpoint, hmac_secret)
    def notify_ingest_complete(self, run_id, status, file_path, sha256, documents_count, errors_count) -> Dict
    def notify_error(self, run_id, error_type, error_message, context) -> Dict
```

---

## Changelog

### v2.0.0 (2025-10-20)

- ✅ Implementação inicial
- ✅ Suporte modo standalone e cloudflare
- ✅ Adapter pattern para AtlasReg Core
- ✅ HMAC signing para webhooks
- ✅ Structured logging
- ✅ Retry com backoff exponencial
- ✅ Docker integration

---

## Roadmap

### v2.1.0 (Q1 2026)

- [ ] Prometheus metrics
- [ ] Grafana dashboard
- [ ] Health check API
- [ ] Admin CLI

### v2.2.0 (Q2 2026)

- [ ] Parallel source execution
- [ ] Advanced error recovery
- [ ] Rate limiting
- [ ] Circuit breaker pattern

---

## License

Proprietary - ness. 2025

---

## Contact

**Desenvolvido por:** Ricardo Esper  
**Email:** resper@ness.com.br  
**Powered by:** ness. - Montserrat Medium, ponto em #00ADE8

**Documentação:**
- README.md (este arquivo)
- CURSOR_COMPATIBILIDADE.txt
- SISTEMA_ATLASREG_COMPLETO.txt

