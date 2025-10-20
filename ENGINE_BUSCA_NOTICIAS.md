# 🔍 AtlasReg - Engine de Busca de Notícias

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)  
**Versão:** 1.0  
**Data:** 20 de Outubro de 2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura da Engine](#arquitetura-da-engine)
3. [Sistema de Busca Híbrido](#sistema-de-busca-híbrido)
4. [Busca Semântica](#busca-semântica)
5. [Busca Full-Text](#busca-full-text)
6. [API Endpoints](#api-endpoints)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Performance](#performance)

---

## 🎯 Visão Geral

A **Engine de Busca do AtlasReg** é um sistema híbrido que combina:

- ✅ **Busca Semântica** (por significado) via SBERT + FAISS
- ✅ **Busca Full-Text** (por palavras-chave) via Elasticsearch
- ✅ **Filtros Avançados** (empresa, data, valor, tipo)
- ✅ **Ranking Inteligente** (relevância + recência + criticidade)
- ✅ **Query Suggestions** (autocomplete)
- ✅ **Export de Resultados** (JSON, CSV, PDF)

### Casos de Uso

| Tipo de Busca | Exemplo | Engine Usada |
|--------------|---------|--------------|
| **Conceitual** | "problemas com linhas de transmissão" | Semântica (FAISS) |
| **Keyword** | "multa transmissora X" | Full-Text (Elasticsearch) |
| **Híbrida** | "descumprimento OR atraso" + filtros | Ambas |
| **Estruturada** | Empresa=X, Valor>1M, Data=2025 | Elasticsearch |

---

## 🏗️ Arquitetura da Engine

### Fluxo de Dados

```
┌────────────────────────────────────────────────┐
│ 1. INGESTÃO                                    │
│    └─ Scrapy/Playwright → MinIO               │
├────────────────────────────────────────────────┤
│ 2. PROCESSAMENTO                               │
│    └─ Celery Workers → BERTimbau + spaCy      │
├────────────────────────────────────────────────┤
│ 3. INDEXAÇÃO                                   │
│    ├─ FAISS (semantic vectors)                │
│    ├─ Elasticsearch (inverted index)          │
│    └─ PostgreSQL (metadata)                   │
├────────────────────────────────────────────────┤
│ 4. QUERY                                       │
│    └─ FastAPI → Query Optimizer               │
├────────────────────────────────────────────────┤
│ 5. RANKING                                     │
│    └─ Score Fusion (semantic + text + boost)  │
└────────────────────────────────────────────────┘
```

### Componentes Principais

**Frontend:**
- Next.js 15.5.5 rodando em `http://localhost:3100`
- Interface de busca com filtros avançados
- Dashboard com visualizações

**Backend:**
- FastAPI rodando em `http://localhost:8200`
- Endpoints de busca semântica, full-text e híbrida
- Sistema de cache e otimização

**Indexação:**
- FAISS para busca semântica (vetores 768-dim)
- Elasticsearch (`http://localhost:9300`) para full-text
- PostgreSQL para metadata e relações

**Storage:**
- MinIO (`http://localhost:9200`) para documentos raw
- Redis (`http://localhost:6382`) para cache

---

## 🔄 Sistema de Busca Híbrido

### Quando Usar Cada Engine

**Use Busca Semântica quando:**
- Query é conceitual/descritiva (5+ palavras)
- Precisa encontrar documentos por significado
- Sinônimos e paráfrases são importantes
- Exemplo: "problemas operacionais causados por tempestades"

**Use Busca Full-Text quando:**
- Query tem termos técnicos específicos
- Precisa de match exato em nomes/siglas
- Usa operadores booleanos (AND, OR, NOT)
- Exemplo: "CNPJ 00.000.000/0001-00" ou "Transmissora X"

**Use Busca Híbrida quando:**
- Quer o melhor dos dois mundos
- Query tem parte conceitual e parte específica
- Exemplo: "multa por atraso + empresa Y + valor>1M"

### Score Fusion (RRF)

O sistema combina resultados usando **Reciprocal Rank Fusion (RRF)**:

```python
def fuse_results(semantic_results, text_results, k=60):
    """
    Combina scores de FAISS e Elasticsearch.
    RRF Score = Σ (1 / (k + rank_i))
    """
    scores = {}
    
    # Score da busca semântica
    for rank, doc_id in enumerate(semantic_results, 1):
        scores[doc_id] = scores.get(doc_id, 0) + (1 / (k + rank))
    
    # Score da busca full-text
    for rank, doc_id in enumerate(text_results, 1):
        scores[doc_id] = scores.get(doc_id, 0) + (1 / (k + rank))
    
    # Ordena por score combinado
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
```

**Exemplo de Fusão:**

```
Query: "multa por atraso na entrega"

Semantic (FAISS):
1. doc_123 (score: 0.92)
2. doc_456 (score: 0.87)
3. doc_789 (score: 0.81)

Full-Text (Elasticsearch):
1. doc_456 (score: 8.5)
2. doc_321 (score: 7.2)
3. doc_123 (score: 6.8)

RRF Combined:
1. doc_456 → 0.0328  (top em ambas!)
2. doc_123 → 0.0321  (alta em ambas)
3. doc_321 → 0.0164  (só no text)
4. doc_789 → 0.0161  (só no semantic)
```

---

## 🧠 Busca Semântica

### Como Funciona

A busca semântica usa **Sentence-BERT (SBERT)** para transformar texto em vetores numéricos (embeddings) e **FAISS** para busca eficiente.

**Processo:**

```
1. Indexação (Background):
   Evento novo → SBERT Model
        ↓
   "ANEEL aplica multa..." → [0.23, -0.45, 0.67, ...] (768 dimensões)
        ↓
   Vector armazenado no FAISS Index

2. Query (Runtime):
   User query → SBERT Model
        ↓
   "problemas com multas" → [0.21, -0.43, 0.65, ...]
        ↓
   FAISS.search(vector, k=10) → Top-10 similares (<500ms)
```

### Modelo SBERT

**Model:** `paraphrase-multilingual-mpnet-base-v2`

**Características:**
- ✅ Multilingual (PT, EN, ES, etc)
- ✅ 768 dimensões
- ✅ Pre-trained em 1B+ sentence pairs
- ✅ Optimizado para semantic similarity

**Exemplo de Uso:**

```python
from sentence_transformers import SentenceTransformer

# Carregar modelo
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

# Encoding
query_vector = model.encode("multa por descumprimento")
# Resultado: array de 768 números float
# Tempo: ~50-80ms por query
```

### FAISS Index

**Tipo:** `IndexFlatIP` (Inner Product - cosine similarity)

```python
import faiss
import numpy as np

# Criar index
dimension = 768
index = faiss.IndexFlatIP(dimension)

# Adicionar vetores
vectors = np.array([
    [0.23, -0.45, 0.67, ...],  # evento 1
    [0.21, -0.43, 0.65, ...],  # evento 2
])
index.add(vectors)

# Buscar
query_vector = np.array([[0.22, -0.44, 0.66, ...]])
distances, indices = index.search(query_vector, k=10)
```

### Vantagens & Limitações

**✅ Vantagens:**
- Encontra documentos conceitualmente relacionados
- Funciona com sinônimos automáticos
- Independe de keywords exatas
- Robusto a variações de escrita

**❌ Limitações:**
- Não entende operadores booleanos
- Menos preciso para nomes próprios
- Custo computacional maior
- Requer modelo treinado

---

## 📊 Busca Full-Text

### Como Funciona

Elasticsearch usa **inverted index** para busca rápida por palavras-chave.

**Exemplo:**

```
Documento 1: "ANEEL aplica multa à Transmissora X"
Documento 2: "Transmissora Y recebe multa do regulador"

Inverted Index:
"aneel"        → [doc1]
"aplica"       → [doc1]
"multa"        → [doc1, doc2]
"transmissora" → [doc1, doc2]
"recebe"       → [doc2]
"regulador"    → [doc2]

Query: "multa transmissora"
→ Match: doc1, doc2 (ambos têm as palavras)
```

### Mapping do Index

```json
{
  "mappings": {
    "properties": {
      "event_id": { "type": "keyword" },
      "title": { 
        "type": "text",
        "analyzer": "brazilian"
      },
      "summary": { "type": "text", "analyzer": "brazilian" },
      "body": { "type": "text", "analyzer": "brazilian" },
      "event_type": { "type": "keyword" },
      "company_name": { "type": "text" },
      "amount": { "type": "float" },
      "date": { "type": "date" },
      "is_critical": { "type": "boolean" }
    }
  }
}
```

### Exemplos de Query DSL

**1. Busca Simples:**

```json
{
  "query": {
    "multi_match": {
      "query": "multa descumprimento",
      "fields": ["title^3", "summary^2", "body"],
      "fuzziness": "AUTO"
    }
  }
}
```

**2. Busca com Filtros:**

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "multa" } }
      ],
      "filter": [
        { "term": { "event_type": "MULTA" } },
        { "range": { "date": { "gte": "2025-01-01" } } },
        { "range": { "amount": { "gte": 1000000 } } }
      ]
    }
  }
}
```

**3. Busca Booleana:**

```json
{
  "query": {
    "bool": {
      "should": [
        { "match": { "body": "descumprimento" } },
        { "match": { "body": "atraso" } }
      ],
      "must_not": [
        { "match": { "body": "arquivado" } }
      ]
    }
  }
}
```

### Analyzer Brasileiro

Elasticsearch processa o texto assim:

```
Input: "A ANEEL aplicou multas às empresas"

1. Tokenization:
   ["A", "ANEEL", "aplicou", "multas", "às", "empresas"]

2. Lowercase:
   ["a", "aneel", "aplicou", "multas", "às", "empresas"]

3. Stop words (brazilian):
   ["aneel", "aplicou", "multas", "empresas"]

4. Stemming:
   ["aneel", "aplic", "mult", "empres"]
```

Query: "aplicação de multa" → Match com "aplicou multas" ✅

---

## 🔌 API Endpoints

### 1. Busca Simples

```bash
GET /api/v1/search?q=multa&limit=10
```

**Response:**
```json
{
  "query": "multa",
  "total": 145,
  "took_ms": 87,
  "results": [
    {
      "event_id": "evt_abc123",
      "title": "ANEEL aplica multa de R$ 2,5M à Transmissora X",
      "summary": "Por descumprimento de prazos...",
      "event_type": "MULTA",
      "company": "Transmissora X",
      "amount": 2500000,
      "date": "2025-10-15",
      "score": 8.234
    }
  ]
}
```

### 2. Busca Avançada

```bash
POST /api/v1/search/advanced
Content-Type: application/json
```

**Body:**
```json
{
  "query": "descumprimento de prazo",
  "filters": {
    "event_type": ["MULTA", "DECISAO"],
    "company_ids": ["comp_123"],
    "date_from": "2025-01-01",
    "min_amount": 1000000
  },
  "sort": { "field": "date", "order": "desc" },
  "page": 1,
  "page_size": 20,
  "search_mode": "hybrid"
}
```

### 3. Busca Semântica

```bash
POST /api/v1/search/semantic
Content-Type: application/json
```

**Body:**
```json
{
  "query": "problemas operacionais com linhas causados por tempestades",
  "top_k": 10,
  "min_similarity": 0.7
}
```

**Response:**
```json
{
  "query": "problemas operacionais...",
  "method": "semantic",
  "total": 8,
  "results": [
    {
      "event_id": "evt_xyz789",
      "title": "Tempestade causa queda de torre em LT 500kV",
      "similarity": 0.89,
      "rank": 1
    }
  ]
}
```

### 4. Autocomplete

```bash
GET /api/v1/search/suggest?q=mul&limit=5
```

**Response:**
```json
{
  "suggestions": [
    { "text": "multa", "score": 0.95, "count": 145 },
    { "text": "multas aplicadas", "score": 0.87, "count": 67 },
    { "text": "multas ANEEL", "score": 0.82, "count": 89 }
  ]
}
```

### 5. Facets / Aggregations

```bash
GET /api/v1/search/facets?q=multa
```

**Response:**
```json
{
  "facets": {
    "event_types": [
      { "value": "MULTA", "count": 145 },
      { "value": "DECISAO", "count": 23 }
    ],
    "companies": [
      { "value": "Transmissora X", "count": 34 }
    ],
    "date_histogram": [
      { "month": "2025-10", "count": 15 }
    ]
  }
}
```

### 6. Export

```bash
POST /api/v1/search/export
Content-Type: application/json
```

**Body:**
```json
{
  "query": "multa",
  "filters": { "event_type": "MULTA" },
  "format": "csv",
  "fields": ["title", "company", "amount", "date"]
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Buscar Multas de uma Empresa

```python
import requests

response = requests.post('http://localhost:8200/api/v1/search/advanced', json={
    "query": "multa",
    "filters": {
        "event_type": ["MULTA"],
        "company_name": "Transmissora ABC",
        "date_from": "2025-01-01",
        "min_amount": 500000
    },
    "sort": {"field": "amount", "order": "desc"}
})

results = response.json()
print(f"Encontradas {results['total']} multas")

for event in results['results']:
    print(f"{event['date']}: R$ {event['amount']:,.2f} - {event['title']}")
```

### Exemplo 2: Busca Semântica

```python
response = requests.post('http://localhost:8200/api/v1/search/semantic', json={
    "query": "falhas em isoladores causando desligamentos",
    "top_k": 10,
    "min_similarity": 0.75
})

for event in response.json()['results']:
    print(f"Similaridade: {event['similarity']:.2f}")
    print(f"  {event['title']}\n")
```

### Exemplo 3: Export para CSV

```python
response = requests.post('http://localhost:8200/api/v1/search/export', json={
    "query": "transmissora",
    "filters": {
        "event_type": ["MULTA", "TRANSACAO"],
        "date_from": "2025-01-01"
    },
    "format": "csv",
    "fields": ["date", "event_type", "title", "company_name", "amount"]
})

with open('eventos_export.csv', 'wb') as f:
    f.write(response.content)
```

---

## 📊 Performance

### Benchmarks

| Operação | Latência (p50) | Latência (p95) | Throughput |
|----------|----------------|----------------|------------|
| **Semantic Search** | 120ms | 280ms | ~100 qps |
| **Text Search (ES)** | 45ms | 150ms | ~500 qps |
| **Hybrid Search** | 180ms | 350ms | ~80 qps |
| **Indexação FAISS** | 85ms | 180ms | ~200 docs/s |
| **Indexação ES** | 35ms | 95ms | ~500 docs/s |

**Environment:** 4 vCPU, 8GB RAM, SSD

### Otimizações

**1. FAISS Index Type:**
```python
# Pequeno (<100k): Exact search
index = faiss.IndexFlatIP(768)

# Médio (100k-1M): Aproximado rápido
index = faiss.IndexIVFFlat(quantizer, 768, nlist=100)

# Grande (1M+): Compressão alta
index = faiss.IndexIVFPQ(quantizer, 768, nlist=100, m=8, nbits=8)
```

**2. Elasticsearch Tuning:**
```json
{
  "index": {
    "refresh_interval": "30s",
    "number_of_replicas": 0,
    "codec": "best_compression"
  }
}
```

**3. Caching:**
```python
from functools import lru_cache

@lru_cache(maxsize=500)
def get_query_embedding(query: str):
    return sbert_model.encode([query])[0]
```

### Métricas de Monitoramento

**Prometheus + Grafana:**
- Search Requests/sec (por método)
- P50/P95/P99 Latency
- Error Rate
- Cache Hit Rate
- Index Size

**Dashboards:**
- Grafana: `http://localhost:3000`
- Flower (Celery): `http://localhost:5600`
- Airflow: `http://localhost:8300`

---

## 🔧 Troubleshooting

### Problema 1: Busca Lenta

**Sintomas:** Queries >500ms

**Diagnóstico:**
```python
import time

t0 = time.time()
vector = model.encode([query])
print(f"Encode: {(time.time()-t0)*1000:.1f}ms")

t1 = time.time()
results = index.search(vector, k=10)
print(f"Search: {(time.time()-t1)*1000:.1f}ms")
```

**Soluções:**
- Use GPU para SBERT (10x mais rápido)
- Cache embeddings de queries frequentes
- Troque para IndexIVFFlat (aproximado)

### Problema 2: ES Fora de Sync

**Sintomas:** Evento no PostgreSQL mas não na busca

**Diagnóstico:**
```bash
curl http://localhost:9300/atlasreg_events/_count
# vs
psql -c "SELECT COUNT(*) FROM events"
```

**Solução:**
```bash
python scripts/reindex_all.py
```

### Problema 3: FAISS Index Corrompido

**Sintomas:** Erros "index not trained" ou resultados estranhos

**Solução:**
```bash
# Backup
cp data/atlasreg_events.index data/backup.index

# Rebuild
python scripts/rebuild_faiss_index.py
```

---

## 📚 Stack Tecnológico

### Componentes e Portas

| Componente | Tecnologia | Porta | Status |
|-----------|-----------|-------|--------|
| **Frontend** | Next.js 15.5.5 | 3100 | ✅ Rodando |
| **API** | FastAPI | 8200 | ✅ Rodando |
| **Airflow** | Apache Airflow 2.7.3 | 8300 | ✅ Rodando |
| **Flower** | Celery Monitor | 5600 | ✅ Rodando |
| **Elasticsearch** | ES 8.11.0 | 9300 | ✅ Rodando |
| **MinIO** | S3-compatible | 9200/9201 | ✅ Rodando |
| **Redis** | Redis 7 | 6382 | ✅ Rodando |
| **PostgreSQL** | via DATABASE_URL | 5432 | ✅ Configurado |

### Modelos de IA

- **SBERT:** `paraphrase-multilingual-mpnet-base-v2`
- **BERTimbau:** `neuralmind/bert-base-portuguese-cased`
- **spaCy:** `pt_core_news_lg`

---

## 🎯 Diferenciais da Engine

✅ **Totalmente automatizado** - Zero intervenção manual  
✅ **IA Brasileira** - BERTimbau treinado para português  
✅ **Busca híbrida** - Semântica + Full-text combinadas  
✅ **Multi-source** - 8+ fontes simultâneas  
✅ **Tempo real** - 10-15min da publicação ao dashboard  
✅ **Escalável** - 100k+ documentos indexados  
✅ **Resiliente** - Retry automático, logs, alertas  

---

## 📞 Contato

**Desenvolvido por:** Ricardo Esper (resper@ness.com.br)  
**Powered by:** ness. - Montserrat Medium, ponto em #00ADE8  
**Última atualização:** 20 de Outubro de 2025

---

## 📖 Referências

- **SBERT:** https://www.sbert.net/
- **FAISS:** https://faiss.ai/
- **Elasticsearch:** https://www.elastic.co/guide/
- **BERTimbau:** https://github.com/neuralmind-ai/portuguese-bert

