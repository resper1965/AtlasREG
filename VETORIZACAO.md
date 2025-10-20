# 🧠 Vetorização de Conteúdo - AtlasReg by ness.

**Data:** 18/10/2025  
**Tecnologia:** BERTimbau + pgvector

---

## 🎯 O QUE É VETORIZAÇÃO?

**Vetorização** = Transformar texto em números (vetores) para busca semântica.

**Exemplo:**
```
Texto: "ANEEL aplica multa de R$ 15M à Taesa"

BERTimbau processa →

Vetor (768 dimensões):
[0.23, -0.45, 0.12, ..., 0.67]
```

**Por que fazer isso?**
- ✅ Busca por **significado**, não palavras exatas
- ✅ Entende sinônimos ("multa" = "penalização" = "PV")
- ✅ Encontra conteúdo relacionado
- ✅ Bot Atlas consegue responder perguntas complexas

---

## 🔧 TECNOLOGIAS USADAS

### 1. BERTimbau (Modelo de IA)
- **O que é:** BERT treinado em português brasileiro
- **Dimensões:** 768 (cada vetor tem 768 números)
- **Vantagem:** Entende contexto do português BR
- **Tamanho:** ~500MB (download na primeira execução)

### 2. pgvector (PostgreSQL Extension)
- **O que é:** Extensão do PostgreSQL para vetores
- **Função:** Armazenar e buscar vetores eficientemente
- **Índice:** IVFFlat (otimizado para 10k-1M vetores)
- **Busca:** Similaridade por cosseno

---

## 📦 O QUE SERÁ VETORIZADO?

### Eventos (300 mockados)
```python
Evento {
    titulo: "ANEEL aplica multa de R$ 15M à Taesa"
    descricao: "Por atraso em obra da LT 500kV..."
    analysis: "Impacto de -0.45% no ROE..."
}

↓ BERTimbau combina tudo ↓

embedding: [0.23, -0.45, 0.12, ..., 0.67]  # 768 números
```

### Por que combinar título + descrição + análise?
- Mais contexto = busca mais precisa
- Bot entende melhor o assunto do evento

---

## 🚀 COMO EXECUTAR

### Passo 1: Preparar Ambiente
```bash
cd /home/resper/nSaulo/apps/api

# Ativar venv
source ~/.venvs/agno/bin/activate

# Instalar dependências (se ainda não instalou)
pip install -r requirements.txt
```

### Passo 2: Rodar Migration pgvector
```bash
# Criar colunas de embeddings no banco
alembic upgrade head

# Verifica:
# ✅ Extensão vector habilitada
# ✅ Coluna events.embedding (vector(768)) criada
# ✅ Índices IVFFlat criados
# ✅ Funções SQL de busca criadas
```

### Passo 3: Popular Banco + Gerar Embeddings
```bash
# Executar script
python -m app.scripts.populate_eventos_mockados

# O que acontece:
# 1. Gera 300 eventos mockados realistas
# 2. Salva no PostgreSQL
# 3. Para cada evento:
#    a) Combina título + descrição + análise
#    b) BERTimbau gera vetor (768D)
#    c) Salva no campo embedding
# 4. Mostra estatísticas

# Tempo estimado: 10-15 minutos
# (BERTimbau baixa ~500MB na primeira vez)
```

---

## 📊 RESULTADO ESPERADO

### Console Output:
```
============================================================
🚀 POPULANDO BANCO COM EVENTOS MOCKADOS + EMBEDDINGS
============================================================

📝 Gerando 300 eventos mockados...
✅ 300 eventos gerados!

💾 Salvando eventos no banco...
  → 50/300 eventos salvos...
  → 100/300 eventos salvos...
  → 150/300 eventos salvos...
  → 200/300 eventos salvos...
  → 250/300 eventos salvos...
  → 300/300 eventos salvos...
✅ Todos os eventos salvos no banco!

🧠 Gerando embeddings com BERTimbau...
   (Isso pode demorar alguns minutos...)
  → 10/300 embeddings gerados (3.3%)
  → 20/300 embeddings gerados (6.7%)
  ...
  → 300/300 embeddings gerados (100.0%)
✅ Todos os embeddings gerados e salvos!

============================================================
📊 ESTATÍSTICAS FINAIS
============================================================
Total de eventos: 300
Com embeddings: 300 (100.0%)

Por tipo:
  - multa: 64
  - decisao_regulatoria: 42
  - outorga_concedida: 43
  - outorga_vencida: 38
  - reajuste_tarifario: 41
  - ma: 39
  - ocorrencia_ons: 33

Por severidade:
  - critica: 0
  - alta: 78
  - media: 142
  - baixa: 80

============================================================
✅ BANCO POPULADO COM SUCESSO!
============================================================

🔍 Agora o bot Atlas pode fazer buscas semânticas!
🤖 Teste perguntando: 'Quais as maiores multas da Taesa?'
```

### Banco de Dados:
```sql
SELECT id, titulo, tipo, severidade, embedding 
FROM events 
LIMIT 3;

-- Resultado:
id | titulo                           | tipo  | severidade | embedding
---+----------------------------------+-------+------------+----------------
1  | ANEEL aplica multa de R$ 15M...  | multa | alta       | [0.23,-0.45,...]
2  | ISA CTEEP vence leilão...        | ...   | media      | [0.12,0.89,...]
3  | Outorga concedida à Taesa...     | ...   | media      | [-0.34,0.56,...]
```

---

## 🔍 TESTANDO A BUSCA SEMÂNTICA

### Via SQL Direto:
```sql
-- Buscar eventos similares a "processos de fiscalização"
-- (precisa gerar embedding da query primeiro)

SELECT 
    id,
    titulo,
    1 - (embedding <=> '[0.23,-0.45,...]') as similarity
FROM events
WHERE 1 - (embedding <=> '[0.23,-0.45,...]') > 0.7
ORDER BY embedding <=> '[0.23,-0.45,...]'
LIMIT 10;
```

### Via Backend (SearchService):
```python
from app.services.search_service import SearchService
from app.database import SessionLocal

db = SessionLocal()
search = SearchService(db)

# Busca semântica!
results = search.search_events(
    query="processos de fiscalização com alto valor",
    match_threshold=0.7,
    limit=10
)

# Retorna eventos similares mesmo sem palavras exatas
# "fiscalização" → encontra "multa", "PV", "penalização"
```

### Via Bot Atlas (Chat):
```
Usuário: "Quais foram os processos de fiscalização caros?"

Bot: 📊 Encontrei 8 eventos relacionados:

1. ANEEL aplica multa de R$ 15M à Taesa (Similaridade: 92%)
2. Processo contra ISA CTEEP resulta em R$ 8,5M (Similaridade: 89%)
3. Penalização de R$ 12M à Copel (Similaridade: 87%)
...

💡 Total: R$ 78M em multas nos últimos 12 meses.
```

---

## 🎯 VANTAGENS DA BUSCA SEMÂNTICA

### Busca Tradicional (Keywords):
```
Query: "multas caras"

Busca SQL:
WHERE titulo LIKE '%multa%' AND valor > 10

Encontra:
❌ Não encontra "penalização"
❌ Não encontra "PV"
❌ Não entende "caras" = "alto valor"
```

### Busca Semântica (Embeddings):
```
Query: "multas caras"

BERTimbau entende:
✅ "multas" ≈ "penalização" ≈ "PV" ≈ "processos"
✅ "caras" ≈ "alto valor" ≈ "elevadas" ≈ "> R$ 10M"
✅ Contexto: "fiscalização" + "ANEEL"

Encontra:
✅ Todos os processos de fiscalização
✅ Mesmo com palavras diferentes
✅ Ordenado por relevância (similaridade)
```

---

## 📈 PERFORMANCE

### Tempo de Busca:
- **SQL tradicional:** ~5ms
- **Busca vetorial (pgvector):** ~20ms
- **Aceitável:** Sim! (< 100ms)

### Memória:
- **Evento médio:** ~3KB (768 floats × 4 bytes)
- **300 eventos:** ~900KB
- **10.000 eventos:** ~30MB
- **100.000 eventos:** ~300MB

### Escalabilidade:
- **Índice IVFFlat:** Otimizado até 1M vetores
- **Precisão:** 95-98% (vs busca exata)
- **Custo-benefício:** Excelente para < 100k documentos

---

## 🔧 ARQUIVOS CRIADOS

```
apps/api/
├── app/
│   ├── scripts/
│   │   ├── __init__.py
│   │   └── populate_eventos_mockados.py  ← NOVO SCRIPT
│   ├── services/
│   │   ├── embedding_service.py          ← Gera embeddings
│   │   └── search_service.py             ← Busca semântica
│   └── alembic/versions/
│       └── 003_add_pgvector_embeddings.py ← Migration
```

---

## ✅ CHECKLIST DE VETORIZAÇÃO

- [ ] 1. Instalar dependências (`pip install -r requirements.txt`)
- [ ] 2. Rodar migration (`alembic upgrade head`)
- [ ] 3. Executar script (`python -m app.scripts.populate_eventos_mockados`)
- [ ] 4. Verificar banco (300 eventos com embeddings)
- [ ] 5. Iniciar backend (`uvicorn app.main:app --reload --port 8200`)
- [ ] 6. Testar bot (http://localhost:3004/dashboard/default)

---

## 🐛 TROUBLESHOOTING

### Erro: "ModuleNotFoundError: sentence_transformers"
```bash
pip install sentence-transformers torch transformers
```

### Erro: "pgvector extension not found"
```bash
# No PostgreSQL (Neon):
CREATE EXTENSION vector;

# Ou rodar migration:
alembic upgrade head
```

### Download BERTimbau demora
- **Normal:** Modelo tem ~500MB
- **Primeira vez:** ~5-10 minutos
- **Próximas:** Rápido (modelo em cache)

### Embeddings muito lentos
- **Normal:** ~2-3 segundos por evento
- **300 eventos:** ~10-15 minutos total
- **Otimização:** Processar em batch (já implementado)

---

## 💡 PRÓXIMOS PASSOS

### Após Vetorização:
1. ✅ Banco populado (300 eventos + embeddings)
2. 🤖 **Testar bot Atlas** (perguntas semânticas)
3. 📊 **Analisar qualidade** (respostas fazem sentido?)
4. 🔧 **Refinar prompts** (se necessário)
5. 📈 **Adicionar mais eventos** (expandir para 1000+)

### Melhorias Futuras:
- Cache de embeddings em Redis
- Re-ranking com filtros
- Embeddings multilíngues
- Fine-tuning BERTimbau no domínio de energia

---

**Powered by:** ness. 💙  
**Tecnologia:** BERTimbau + pgvector  
**Status:** ⏳ Pronto para executar!

