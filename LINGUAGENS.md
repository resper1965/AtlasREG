# 💻 AtlasReg - Linguagens do Projeto

---

## 📋 RESUMO EXECUTIVO

AtlasReg usa **2 linguagens principais:**

1. **TypeScript** → Frontend (Next.js, React, UI)
2. **Python** → Backend (FastAPI, Scraping, IA/ML)

---

## 🎨 FRONTEND: TypeScript

### O Que é TypeScript?

**TypeScript = JavaScript com Types**
- JavaScript moderno + sistema de tipos estático
- Compila para JavaScript puro
- Previne bugs em tempo de desenvolvimento

### Stack Frontend

```typescript
// Next.js 15 + React 19 + TypeScript
// Exemplo de componente:

interface EventCardProps {
  event: {
    id: string;
    title: string;
    type: 'multa' | 'decisao' | 'transacao';
    company: string;
    date: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardTitle>{event.title}</CardTitle>
      <Badge variant={event.type}>{event.type}</Badge>
      <p>{event.company}</p>
    </Card>
  );
}
```

### Por Que TypeScript?

✅ **Type Safety:** Erros detectados antes de rodar  
✅ **Autocomplete:** IntelliSense no VS Code  
✅ **Refactoring Seguro:** Renomear variáveis sem medo  
✅ **Documentação Viva:** Types são documentação  
✅ **Melhor DX:** Developer experience superior  

### Tecnologias Frontend

- **Next.js 15:** Framework React com SSR
- **React 19:** Library de UI
- **Tailwind CSS:** Styling utility-first
- **shadcn/ui:** Components acessíveis (Radix UI)
- **Zustand:** State management
- **TanStack Query:** Server state
- **React Hook Form + Zod:** Forms + validation

**Localização:** `apps/web/`

---

## 🐍 BACKEND: Python 3.11+

### O Que é Python?

**Python = Linguagem versátil e poderosa**
- Sintaxe simples e legível
- Ecosystem rico de IA/ML
- Padrão da indústria para data science

### Stack Backend

```python
# FastAPI + SQLAlchemy + Python
# Exemplo de endpoint:

from fastapi import FastAPI
from pydantic import BaseModel

class Event(BaseModel):
    id: str
    title: str
    event_type: str
    company: str
    
@app.get("/events/{id}", response_model=Event)
async def get_event(id: str):
    event = await db.query(Event).filter_by(id=id).first()
    return event
```

### Por Que Python?

✅ **AI/ML Ecosystem:** BERTimbau, spaCy, PyTorch, FAISS  
✅ **Scraping:** Scrapy + Playwright para coletar sites  
✅ **FastAPI:** Framework moderno, async, rápido  
✅ **Data Processing:** Pandas, NumPy se necessário  
✅ **Simplicidade:** Código legível e manutenível  

### Tecnologias Backend

**API:**
- **FastAPI:** REST API async
- **SQLAlchemy:** ORM para PostgreSQL
- **Pydantic:** Validation
- **JWT + bcrypt:** Authentication

**Scraping:**
- **Scrapy:** Framework de scraping
- **Playwright:** Browser automation (sites JS)
- **Apache Airflow:** Orquestração de DAGs

**AI/ML:**
- **BERTimbau:** Classificação de eventos (HuggingFace)
- **spaCy:** Extração de entidades
- **Sentence-BERT:** Embeddings semânticos
- **FAISS:** Vector search

**Processing:**
- **Celery:** Task queue assíncrona
- **Redis:** Message broker
- **PDFMiner:** Extração de texto de PDFs
- **Tesseract:** OCR fallback

**Localização:** `apps/api/` + `apps/scraper/`

---

## 📊 DIVISÃO DE RESPONSABILIDADES

### TypeScript Faz:

```
┌─────────────────────────────────┐
│  INTERFACE DO USUÁRIO (UI/UX)  │
├─────────────────────────────────┤
│ • Componentes React             │
│ • Dashboard interativo          │
│ • Forms com validação           │
│ • Navegação e routing           │
│ • State management (Zustand)    │
│ • Consumo de API (fetch/axios)  │
│ • Animações e transições        │
│ • Responsive design             │
└─────────────────────────────────┘
```

### Python Faz:

```
┌─────────────────────────────────┐
│  BACKEND + IA + DATA            │
├─────────────────────────────────┤
│ • REST API (FastAPI)            │
│ • Scraping de sites (Scrapy)    │
│ • Conversão de PDFs              │
│ • IA: Classificação (BERTimbau) │
│ • IA: Extração entidades (spaCy)│
│ • IA: Busca semântica (FAISS)   │
│ • Database operations (SQL)     │
│ • Email sending (SMTP)          │
│ • Task scheduling (Airflow)     │
│ • Background processing (Celery)│
└─────────────────────────────────┘
```

---

## 🔄 Comunicação Entre Linguagens

```
┌──────────────┐           ┌──────────────┐
│  TypeScript  │  ◄─────►  │    Python    │
│  (Frontend)  │   REST    │   (Backend)  │
│  Next.js     │   JSON    │   FastAPI    │
└──────────────┘           └──────────────┘
       │                          │
       │                          │
       ▼                          ▼
   Browser                   PostgreSQL
  (Usuário)              MinIO, Redis, ES
```

**Comunicação:**
- Frontend chama API via HTTP/REST
- Formato: JSON
- Auth: JWT tokens
- CORS habilitado

---

## 📚 Aprender as Linguagens

### TypeScript

**Recursos:**
- Tutorial oficial: https://www.typescriptlang.org/docs/
- React docs: https://react.dev
- Next.js Learn: https://nextjs.org/learn

**Curva de Aprendizado:**
- Se sabe JavaScript: 1-2 semanas
- Se é iniciante: 1-2 meses

### Python

**Recursos:**
- Tutorial oficial: https://docs.python.org/3/tutorial/
- FastAPI docs: https://fastapi.tiangolo.com
- Real Python: https://realpython.com

**Curva de Aprendizado:**
- Básico: 2-4 semanas
- Avançado (AI/ML): 2-3 meses

---

## 🎯 Habilidades Necessárias

### Para Frontend (TypeScript)

**Essencial:**
- HTML/CSS básico
- JavaScript ES6+
- React basics (components, hooks, state)

**Desejável:**
- TypeScript fundamentals
- Next.js (App Router, SSR)
- Tailwind CSS

**Aprende no projeto:**
- shadcn/ui components
- Zustand (state)
- TanStack Query

### Para Backend (Python)

**Essencial:**
- Python basics (functions, classes, modules)
- HTTP/REST concepts
- SQL basics

**Desejável:**
- FastAPI ou Flask
- SQLAlchemy (ORM)
- Async/await em Python

**Aprende no projeto:**
- Scraping (Scrapy)
- IA/ML (BERTimbau, spaCy)
- Airflow, Celery

---

## 🏗️ Arquivos por Linguagem

### TypeScript (30+ arquivos)

```
apps/web/src/
├── **/*.tsx          # React components
├── **/*.ts           # TypeScript modules
├── package.json      # Dependencies
└── tsconfig.json     # TS config
```

### Python (25+ arquivos)

```
apps/api/
├── app/**/*.py       # FastAPI modules
├── requirements.txt  # Dependencies
└── alembic/          # Migrations

apps/scraper/
├── dags/**/*.py      # Airflow DAGs
├── scrapers/**/*.py  # Scrapy spiders
├── processors/**/*.py # AI/ML pipeline
└── requirements.txt
```

### Config/Data (10+ arquivos)

```
*.json, *.yaml, *.yml    # Configs
*.md                     # Documentation
*.env                    # Environment vars
*.sql                    # Database schemas
```

---

## 💡 RESUMO FINAL

**Frontend:**
- 🟦 **TypeScript** (Next.js 15 + React 19)
- 📁 Localização: `apps/web/`
- 🎨 UI: shadcn/ui + Tailwind CSS
- ⏱️ 30+ components prontos

**Backend:**
- 🟨 **Python 3.11+** (FastAPI + IA/ML)
- 📁 Localização: `apps/api/` + `apps/scraper/`
- 🤖 IA: BERTimbau + spaCy + FAISS
- 🔧 Tools: Scrapy, Airflow, Celery

**Arquitetura:**
- ✅ 2 linguagens complementares
- ✅ Comunicação via REST API
- ✅ Type-safe em ambos os lados
- ✅ Modern, scalable, production-ready

---

**Documentado em:** 17/10/2025  
**Status:** ✅ Linguagens definidas e configuradas  
**Ready:** Frontend TypeScript base instalado

