# Configuração de Fontes - sources.yaml

## 📋 Como Usar

### Estrutura de uma Source

```yaml
- id: identificador_unico        # Usado em comandos e DAGs
  name: "Nome Legível"           # Exibido em logs
  enabled: true                  # true = ativo, false = desabilitado
  priority: high                 # high, medium, low
  category: regulatorio          # regulatorio, midia, cadastral, etc
  
  urls:
    base: "https://site.com"
    noticias: "https://site.com/noticias"
    busca: "https://site.com/search?q={query}"
  
  scraper_type: scrapy           # scrapy ou playwright
  schedule: "0 6 * * *"          # Cron expression
  
  selectors:
    lista: "article.post"        # Seletor CSS para lista de items
    titulo: "h2::text"           # Seletor para título
    url: "a::attr(href)"         # Seletor para URL
    data: "time::attr(datetime)" # Seletor para data
    resumo: "p.desc::text"       # Seletor para resumo
  
  filters:
    keywords:                    # Filtrar apenas notícias relevantes
      - transmissão
      - energia
  
  rate_limit: 5                  # Segundos entre requests
```

---

## 🔄 Cron Schedule Examples

```
0 6 * * *     = Todo dia às 06:00
30 6 * * *    = Todo dia às 06:30
0 */4 * * *   = A cada 4 horas
0 8 * * 1     = Segundas às 08:00
0 9 1 * *     = Dia 1 de cada mês às 09:00
*/30 * * * *  = A cada 30 minutos
```

---

## 🎯 Fontes Configuradas

### Habilitadas (10)

1. **aneel_noticias** - Notícias ANEEL (diário 06:00)
2. **aneel_despachos** - Despachos regulatórios (diário 07:00)
3. **aneel_pv** - Multas e fiscalizações (semanal 08:00)
4. **ons_ocorrencias** - Incidentes operacionais (diário 06:30)
5. **sigel** - Dados cadastrais (mensal 09:00)
6. **canal_energia** - Notícias mídia (diário 09:00)
7. **megawhat** - Análises técnicas (diário 09:30)
8. **epbr** - Mercado energia (diário 10:00)
9. **mme** - Ministério (diário 13:00)
10. **epe** - Pesquisa energética (semanal 00:00)

### Desabilitadas (6 - Fase 2)

- estadao_economia_energia
- valor_economico_energia
- abrate
- abce
- b3_fatos_relevantes (requer API)
- cvm_avisos

---

## ✏️ Como Adicionar Nova Fonte

### Passo 1: Editar sources.yaml

```bash
cd apps/scraper/config
nano sources.yaml
```

### Passo 2: Adicionar entrada

```yaml
- id: minha_fonte
  name: "Minha Fonte de Notícias"
  enabled: true
  priority: medium
  category: midia
  urls:
    base: "https://minhafonte.com"
    noticias: "https://minhafonte.com/noticias"
  scraper_type: scrapy
  schedule: "0 15 * * *"
  selectors:
    lista: "article"
    titulo: "h2::text"
    url: "a::attr(href)"
  rate_limit: 5
```

### Passo 3: Validar

```bash
# Testar scraper
scrapy crawl minha_fonte

# Ver output
cat /tmp/minha_fonte_*.json
```

### Passo 4: Ativar no Airflow

```bash
# Airflow detecta automaticamente
# DAG "scraper_minha_fonte" criado
```

**Tempo total:** 10-15 minutos! ⚡

---

## 🔍 CSS Selectors - Guia Rápido

### Elementos Comuns

```css
/* Título */
h2::text                    → Texto do h2
h2.titulo::text             → h2 com classe "titulo"
h2 a::text                  → Link dentro de h2

/* Links */
a::attr(href)               → URL do link
a.link-noticia::attr(href)  → Link com classe específica

/* Data */
time::attr(datetime)        → Atributo datetime
span.data::text             → Texto do span.data

/* Containers */
article.post                → Elemento article com classe post
div.item-noticia            → Div com classe item-noticia

/* Múltiplos seletores (OR) */
"h2::text, h3::text"        → h2 OU h3
```

### Como Descobrir Selectors

1. Abrir site no Chrome
2. F12 (Developer Tools)
3. Clicar no ícone "Select element"
4. Clicar no título da notícia
5. Ver HTML no inspector
6. Copiar seletor CSS

**Exemplo:**
```html
<article class="post-item">
  <h2 class="post-title">
    <a href="/noticia/123">Título da Notícia</a>
  </h2>
  <time datetime="2025-10-17">17/10/2025</time>
</article>

Selectors:
lista: "article.post-item"
titulo: "h2.post-title a::text"
url: "h2.post-title a::attr(href)"
data: "time::attr(datetime)"
```

---

## 📊 Estatísticas por Fonte

| Fonte | Docs/dia | Relevância | Tipo |
|-------|----------|------------|------|
| ANEEL Notícias | 5-10 | 90% | HTML |
| ANEEL Despachos | 20-50 | 70% | PDF |
| ANEEL PVs | 2-4 (semanal) | 100% | PDF |
| ONS | 5-15 | 60% | HTML/JS |
| Canal Energia | 10-20 | 50% | HTML/JS |
| MegaWhat | 5-10 | 70% | HTML |
| EPBR | 5-10 | 60% | HTML |
| MME | 5-10 | 40% | HTML |

**Após filtros:** ~30-60 documentos relevantes/dia

---

## ⚙️ Configurações Avançadas

### Rate Limiting por Categoria

```yaml
# Em sources.yaml, override por source:
rate_limit: 5   # Padrão
rate_limit: 10  # Sites governamentais (mais conservador)
rate_limit: 3   # Mídia (mais rápido)
```

### Concurrent Scrapers

```yaml
global_settings:
  concurrent_scrapers: 3  # Máximo rodando simultaneamente
```

**Exemplo:**
- 06:00 - ANEEL News inicia
- 06:30 - ONS inicia (ANEEL ainda rodando)
- 07:00 - ANEEL Despachos espera (já tem 2 rodando)
- 06:05 - ANEEL News termina
- 07:00 - ANEEL Despachos inicia

---

## 🚀 Próxima Implementação

```bash
# 1. Instalar dependencies
cd apps/scraper
pip install -r requirements.txt

# 2. Testar scrapers
scrapy crawl aneel_noticias

# 3. Verificar MinIO
curl http://localhost:19001

# 4. Subir Airflow
docker-compose up airflow-webserver airflow-scheduler

# 5. Monitorar
# http://localhost:8200
```

**Ver documentação completa:** `/BUSCA_NOTICIAS_EXPLICADO.md`


