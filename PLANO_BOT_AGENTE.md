# 🤖 Bot com Agente Especializado - AtlasReg by ness.

**Arquiteto BMad Team** - Design do Sistema de Chat

---

## 🎯 VISÃO GERAL

**O que é:**
Agente conversacional especializado em transmissão de energia que responde perguntas usando dados vetorizados (pgvector) e memória (Redis).

**Exemplo de uso:**
```
Usuário: "Quais foram as maiores multas da Taesa em 2025?"

Bot: 📊 Encontrei 3 multas da Taesa em 2025:

1. R$ 15M - Atraso em obra LT 500kV (Out/25)
   Impacto: -0.45% ROE
   
2. R$ 8,5M - Indisponibilidade LT 230kV (Ago/25)
   
3. R$ 3,2M - Questões ambientais (Jun/25)

Total: R$ 26,7M (↑ 45% vs 2024)

💡 Análise: Aumento significativo sugere problemas 
operacionais. Recomendo monitorar projetos em andamento.
```

---

## 🏗️ ARQUITETURA DO BOT

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│  Frontend - Chat Widget                 │
│  - Componente React (sidebar)           │
│  - WebSocket para real-time             │
│  - Markdown rendering                   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Backend - Agente IA                    │
│  - LangChain (orchestration)            │
│  - OpenAI/Claude API (LLM)              │
│  - Custom tools (queries)               │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       ↓               ↓
┌─────────────┐  ┌─────────────┐
│  PostgreSQL │  │    Redis    │
│  + pgvector │  │  (memória)  │
│             │  │             │
│  - Eventos  │  │  - Sessões  │
│  - Empresas │  │  - Context  │
│  - Docs     │  │  - Cache    │
└─────────────┘  └─────────────┘
```

---

## 🧠 AGENTE ESPECIALIZADO

### Persona do Agente

```
Nome: Atlas (assistente AtlasReg)

Expertise:
- Setor de transmissão de energia brasileiro
- Regulação ANEEL/ONS
- Análise financeira (RAP, EBITDA, ROE)
- M&A e valuation
- Análise de risco regulatório

Capacidades:
- Buscar eventos no banco (pgvector)
- Analisar tendências
- Calcular métricas financeiras
- Comparar empresas
- Identificar riscos

Tom:
- Profissional e objetivo
- Data-driven
- Formatação clara (tabelas, bullets)
- Sempre cita fontes
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### 1. PostgreSQL + pgvector (Busca Vetorial)

**Schema:**
```sql
-- Habilitar pgvector
CREATE EXTENSION vector;

-- Adicionar embeddings
ALTER TABLE events 
ADD COLUMN embedding vector(768);

ALTER TABLE documents 
ADD COLUMN embedding vector(768);

ALTER TABLE companies
ADD COLUMN description_embedding vector(768);

-- Índice para busca rápida
CREATE INDEX events_embedding_idx 
ON events USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Função de busca
CREATE OR REPLACE FUNCTION search_similar_events(
    query_embedding vector(768),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id int,
    title text,
    similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    id,
    title,
    1 - (embedding <=> query_embedding) as similarity
  FROM events
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

---

### 2. Redis (Memória de Conversação)

**Estrutura:**
```python
# Sessão de chat
redis_key = f"chat:session:{user_id}:{session_id}"

# Dados armazenados
{
  "messages": [
    {"role": "user", "content": "Quais multas da Taesa?"},
    {"role": "assistant", "content": "Encontrei 3 multas..."},
    {"role": "user", "content": "E da ISA CTEEP?"},
    # Contexto mantido!
  ],
  "context": {
    "empresa_atual": "Taesa",
    "periodo": "2025",
    "filtros_ativos": {"tipo": "multa"}
  },
  "created_at": "2025-10-18T10:30:00",
  "last_interaction": "2025-10-18T10:35:00"
}

# TTL: 1 hora de inatividade
redis.setex(redis_key, 3600, json.dumps(session_data))
```

---

### 3. LangChain + Tools

**Agente com ferramentas customizadas:**

```python
# apps/api/app/agents/atlas_agent.py

from langchain.agents import Tool, AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.embeddings import HuggingFaceEmbeddings

class AtlasAgent:
    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client
        
        # LLM (OpenAI ou Claude)
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.2  # Preciso e factual
        )
        
        # Embeddings (BERTimbau)
        self.embeddings = HuggingFaceEmbeddings(
            model_name="neuralmind/bert-base-portuguese-cased"
        )
        
        # Tools disponíveis
        self.tools = [
            Tool(
                name="buscar_eventos",
                func=self.search_events,
                description="Busca eventos por query semântica ou filtros"
            ),
            Tool(
                name="analisar_empresa",
                func=self.analyze_company,
                description="Retorna dados financeiros de uma empresa"
            ),
            Tool(
                name="calcular_metricas",
                func=self.calculate_metrics,
                description="Calcula métricas (EBITDA, ROE, etc)"
            ),
            Tool(
                name="comparar_empresas",
                func=self.compare_companies,
                description="Compara 2 ou mais empresas"
            ),
            Tool(
                name="tendencias",
                func=self.get_trends,
                description="Identifica tendências em período"
            ),
        ]
        
        # Memória (Redis)
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Executor
        self.agent = AgentExecutor.from_agent_and_tools(
            agent=self.llm,
            tools=self.tools,
            memory=self.memory
        )
    
    def search_events(self, query: str):
        """Busca vetorial + filtros"""
        # Gerar embedding
        query_vec = self.embeddings.embed_query(query)
        
        # Buscar similares
        results = self.db.execute(
            "SELECT * FROM search_similar_events(%s, 0.7, 10)",
            (query_vec,)
        )
        
        return results
    
    def analyze_company(self, company_name: str):
        """Análise completa de empresa"""
        company = self.db.query(Company).filter(
            Company.name.ilike(f"%{company_name}%")
        ).first()
        
        return {
            "nome": company.name,
            "rap_anual": company.rap_anual,
            "ebitda_margin": company.ebitda_margin,
            "roe": company.roe,
            "score_risco": company.score_risco_total,
            # ...
        }
    
    async def chat(self, user_id: int, message: str):
        """Processar mensagem do usuário"""
        
        # Carregar contexto do Redis
        session_key = f"chat:session:{user_id}"
        context = self.redis.get(session_key)
        
        # Processar com agente
        response = await self.agent.arun(
            input=message,
            chat_history=context.get("messages", [])
        )
        
        # Salvar contexto no Redis
        context["messages"].append({"role": "user", "content": message})
        context["messages"].append({"role": "assistant", "content": response})
        self.redis.setex(session_key, 3600, json.dumps(context))
        
        return response
```

---

### 4. WebSocket (Real-time)

**Backend:**
```python
# apps/api/app/main.py

from fastapi import WebSocket

@app.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: int):
    await websocket.accept()
    
    agent = AtlasAgent(db, redis)
    
    while True:
        # Receber mensagem
        message = await websocket.receive_text()
        
        # Processar com agente
        response = await agent.chat(user_id, message)
        
        # Enviar resposta
        await websocket.send_json({
            "type": "message",
            "content": response,
            "timestamp": datetime.now().isoformat()
        })
```

**Frontend:**
```typescript
// components/chat/chat-widget.tsx

const socket = new WebSocket('ws://localhost:8200/ws/chat/1');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setMessages(prev => [...prev, data]);
};

const sendMessage = (text: string) => {
  socket.send(text);
};
```

---

## 🎨 UI DO BOT (Frontend)

### Componente Chat Widget

```tsx
// Floating button no canto inferior direito
<ChatWidget>
  <FloatingButton>
    💬 Pergunte ao Atlas
  </FloatingButton>
  
  <ChatPanel> // Abre ao clicar
    <Header>
      🤖 Atlas - Especialista em Energia
      Powered by ness.
    </Header>
    
    <Messages>
      {messages.map(msg => (
        <MessageBubble 
          role={msg.role}
          content={msg.content}
          markdown={true}  // Suporta tabelas, bullets
        />
      ))}
    </Messages>
    
    <InputArea>
      <Input placeholder="Ex: Quais as maiores multas de outubro?" />
      <SendButton />
    </InputArea>
    
    <SuggestedQuestions>
      "Qual o RAP da Taesa?"
      "Últimas decisões da ANEEL"
      "Empresas em risco alto"
    </SuggestedQuestions>
  </ChatPanel>
</ChatWidget>
```

**Posição:** Canto inferior direito (floating)  
**Cor:** #00ADE8 (ness. accent)  
**Dark mode:** Background #111317

---

## 📊 EXEMPLOS DE QUERIES

### Query 1: Busca Simples
```
👤 User: "Multas da Taesa em 2025"

🤖 Atlas: Encontrei 3 multas aplicadas à Taesa em 2025:

| Data | Valor | Motivo | Status |
|------|-------|--------|--------|
| Out/25 | R$ 15M | Atraso obra | Ativo |
| Ago/25 | R$ 8,5M | Indisponibilidade | Recurso |
| Jun/25 | R$ 3,2M | Ambiental | Condenado |

**Total:** R$ 26,7M (↑ 45% vs 2024)

💡 **Análise:** Volume elevado sugere problemas 
operacionais. A multa de outubro (R$ 15M) é a 
maior do ano para a empresa.

📊 **Impacto financeiro:** -0.76% no ROE estimado.

Quer ver detalhes de alguma multa específica?
```

### Query 2: Análise Comparativa
```
👤 User: "Compare o ROE da Taesa vs ISA CTEEP"

🤖 Atlas: Comparação ROE - Taesa vs ISA CTEEP:

**Taesa:**
- ROE: 11.2%
- WACC: 8.92%
- Spread: +2.28 p.p. ✅
- Rating: AAA

**ISA CTEEP:**
- ROE: 10.8%
- WACC: 8.92%
- Spread: +1.88 p.p. ✅
- Rating: AAA

**Conclusão:** Ambas superam o WACC regulatório, 
mas Taesa tem spread superior (+0.4 p.p.), indicando 
melhor geração de valor para acionistas.

📈 **Tendência 5 anos:** Taesa crescente, CTEEP estável.

Quer ver a evolução gráfica?
```

### Query 3: Tendências
```
👤 User: "O que está acontecendo no setor essa semana?"

🤖 Atlas: 📊 Principais movimentos (Out 14-18):

**🔴 Regulatório (Alta atividade):**
- 5 novas multas aplicadas (R$ 12M total)
- 2 outorgas concedidas (R$ 95M RAP/ano)
- 1 reajuste aprovado (Copel +4.1%)

**💰 M&A (Aquecido):**
- 2 deals anunciados (R$ 2,7 Bi)
- Múltiplos: 13.5x e 14.2x (acima média)
- Players: CDPQ, State Grid

**⚠️ Riscos:**
- Transmissora Y com 3 projetos atrasados
- ↑ 23% em multas vs mês anterior

**💡 Insight:** Consolidação acelerando. M&A em 
ritmo 2x acima da média histórica.

Quer detalhes sobre algum evento específico?
```

### Query 4: Cálculos
```
👤 User: "Se o IGP-M subir para 6%, qual o impacto no RAP da Taesa?"

🤖 Atlas: 📊 Simulação de Impacto - IGP-M 6%:

**Taesa:**
- RAP atual: R$ 3,50 Bi
- Reajuste esperado: 4.2% (IGP-M atual)
- Reajuste com IGP-M 6%: 6.0%

**Impacto incremental:**
- Adicional: 1.8 p.p.
- Receita extra: R$ 63M/ano
- EBITDA extra: R$ 56M (margin 88.5%)
- Impacto ROE: +0.17%

**Conclusão:** Incremento de R$ 63M é material. 
IGP-M mais alto beneficia transmissoras (receita 
indexada, custos relativamente fixos).

⚠️ **Risco:** IGP-M volátil. Histórico: -1% a +12%.

Quer simular outros cenários?
```

---

## 🔧 IMPLEMENTAÇÃO (3 Fases)

### FASE 1: pgvector + Dados (1-2 dias)

**1.1 Configurar pgvector**
```bash
# Neon PostgreSQL (criar database)
# Habilitar extensão

CREATE EXTENSION vector;
```

**1.2 Migrar schema**
```python
# apps/api/alembic/versions/xxx_add_embeddings.py

def upgrade():
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    
    op.add_column('events',
        sa.Column('embedding', Vector(768), nullable=True)
    )
    
    op.execute('''
        CREATE INDEX events_embedding_idx 
        ON events USING ivfflat (embedding vector_cosine_ops)
    ''')
```

**1.3 Gerar embeddings**
```python
# apps/api/app/services/embedding_service.py

from sentence_transformers import SentenceTransformer

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer(
            'neuralmind/bert-base-portuguese-cased'
        )
    
    def generate_event_embedding(self, event):
        # Combinar título + descrição
        text = f"{event.title} {event.description}"
        
        # Gerar vetor
        embedding = self.model.encode(text)
        
        return embedding.tolist()
    
    def populate_embeddings(self):
        """Gerar embeddings para todos eventos"""
        events = db.query(Event).all()
        
        for event in events:
            embedding = self.generate_event_embedding(event)
            event.embedding = embedding
            db.commit()
```

**1.4 Popular banco com dados mockados**
```python
# Criar 300 eventos mockados
# Gerar embeddings
# Salvar no PostgreSQL
```

---

### FASE 2: Agente IA (2-3 dias)

**2.1 Instalar dependências**
```bash
cd apps/api
pip install langchain openai redis sentence-transformers
```

**2.2 Criar agente**
```python
# apps/api/app/agents/atlas_agent.py

from langchain.agents import initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
import redis

class AtlasAgent:
    def __init__(self):
        # LLM
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.2,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Redis para memória
        self.redis = redis.from_url("redis://localhost:6381/1")
        
        # Tools
        tools = [
            Tool(
                name="buscar_eventos",
                func=self.search_events_tool,
                description="""
                Busca eventos no banco de dados usando busca semântica.
                Input: query em português (ex: "multas taesa")
                Output: Lista de eventos relevantes com análises
                """
            ),
            Tool(
                name="dados_empresa",
                func=self.get_company_data,
                description="""
                Retorna dados completos de uma empresa transmissora.
                Input: nome da empresa
                Output: RAP, EBITDA, ROE, score risco, etc
                """
            ),
            Tool(
                name="calcular_impacto",
                func=self.calculate_impact,
                description="""
                Calcula impacto financeiro de eventos ou cenários.
                Input: descrição do cenário
                Output: Impacto em R$, %, ROE
                """
            ),
        ]
        
        # Agent
        self.agent = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
            verbose=True,
            memory=self.memory
        )
        
        # System prompt
        self.system_prompt = """
        Você é o Atlas, assistente especializado em transmissão 
        de energia elétrica do Brasil. Você tem acesso a dados 
        em tempo real de:
        
        - Decisões regulatórias (ANEEL, ONS)
        - Multas e processos de fiscalização
        - Transações M&A
        - Dados financeiros de 120 transmissoras
        - Ocorrências operacionais
        
        Sempre:
        - Seja preciso e baseado em dados
        - Cite números específicos (R$, %, datas)
        - Formate respostas com tabelas quando possível
        - Adicione insights e análises
        - Sugira próximas perguntas
        
        Nunca:
        - Invente dados
        - Seja vago
        - Ignore contexto da conversa
        """
    
    def search_events_tool(self, query: str):
        """Wrapper para busca vetorial"""
        # Gerar embedding
        query_embedding = self.embeddings.embed_query(query)
        
        # Buscar no pgvector
        results = db.execute(
            "SELECT * FROM search_similar_events(%s, 0.7, 10)",
            (query_embedding,)
        ).fetchall()
        
        # Formatar para o LLM
        formatted = []
        for event in results:
            formatted.append({
                "titulo": event.title,
                "data": event.date,
                "empresa": event.companies,
                "valor": event.value,
                "tipo": event.type,
                "analise": event.analysis
            })
        
        return json.dumps(formatted, ensure_ascii=False)
    
    async def chat(self, user_id: int, message: str):
        """Processar mensagem"""
        
        # Carregar histórico do Redis
        session_key = f"chat:{user_id}"
        history = self.redis.get(session_key)
        
        if history:
            self.memory.load_memory_variables(json.loads(history))
        
        # Executar agente
        response = await self.agent.arun(message)
        
        # Salvar no Redis
        self.redis.setex(
            session_key, 
            3600,  # 1 hora TTL
            self.memory.save_context(message, response)
        )
        
        return response
```

**2.3 Criar endpoint**
```python
# apps/api/app/routers/chat.py

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    agent = AtlasAgent()
    response = await agent.chat(current_user.id, request.message)
    
    return {"response": response}
```

---

### FASE 3: Frontend Widget (1 dia)

**3.1 Criar componente**
```tsx
// apps/web/src/components/chat/chat-widget.tsx

'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const sendMessage = async () => {
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }]);
    
    // Chamar API
    const response = await fetch('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input })
    });
    
    const data = await response.json();
    
    // Adicionar resposta do bot
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.response
    }]);
    
    setInput('');
  };
  
  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#00ADE8] hover:bg-[#00ADE8]/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col border-[#00ADE8]/30 bg-card/95 backdrop-blur-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#00ADE8] flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Atlas</p>
                <p className="text-xs text-muted-foreground">Especialista em Energia</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-[#00ADE8] text-white'
                      : 'bg-muted/50 text-foreground'
                  }`}
                >
                  <ReactMarkdown className="text-sm prose prose-invert max-w-none">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-border/40">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Pergunte sobre eventos, empresas..."
                className="bg-muted/50"
              />
              <Button
                onClick={sendMessage}
                className="bg-[#00ADE8] hover:bg-[#00ADE8]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sugestões */}
            <div className="mt-2 flex flex-wrap gap-1">
              {['Maiores multas', 'RAP Taesa', 'Últimos M&A'].map(q => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setInput(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 text-center border-t border-border/40">
            <p className="text-[9px] text-muted-foreground">
              Powered by <span className="text-[#00ADE8]">ness.</span> • IA com dados reais
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
```

---

## 📦 DEPENDENCIES NECESSÁRIAS

### Backend
```bash
# apps/api/requirements.txt
langchain==0.1.0
openai==1.0.0
redis==5.0.1
sentence-transformers==2.2.2
pgvector==0.2.3
websockets==12.0
```

### Frontend
```bash
# apps/web/package.json
react-markdown
remark-gfm
```

---

## 🎯 CRONOGRAMA DE IMPLEMENTAÇÃO

### Dia 1: pgvector + Schema
- [ ] Criar database Neon
- [ ] Habilitar pgvector
- [ ] Migration com embeddings
- [ ] Popular 300 eventos mockados
- [ ] Gerar embeddings

### Dia 2: Backend Agente
- [ ] Instalar LangChain
- [ ] Criar AtlasAgent
- [ ] Implementar tools (buscar, analisar, calcular)
- [ ] Endpoint /chat
- [ ] WebSocket (opcional)

### Dia 3: Frontend Widget
- [ ] Componente ChatWidget
- [ ] UI dark mode ness.
- [ ] Integração API
- [ ] Markdown rendering
- [ ] Sugestões de queries

### Dia 4: Testes e Polish
- [ ] Testar queries complexas
- [ ] Refinar prompts do agente
- [ ] Otimizar busca vetorial
- [ ] Mobile responsivo

**TOTAL: 3-4 dias** ⚡

---

## 💡 FEATURES DO BOT

### Core
- ✅ Busca semântica (entende contexto)
- ✅ Memória de conversa (Redis)
- ✅ Multi-turn (contexto mantido)
- ✅ Formatação rica (tabelas, bullets)
- ✅ Cálculos automáticos
- ✅ Comparações

### Avançadas
- ✅ Sugestões de perguntas
- ✅ Highlights de termos
- ✅ Links para páginas
- ✅ Export conversa
- ✅ Feedback (👍👎)

---

## 🚀 QUER QUE EU IMPLEMENTE AGORA?

**Posso criar:**

1. **pgvector setup** (4h)
2. **Agente IA com LangChain** (6h)
3. **Chat Widget frontend** (4h)
4. **Integração completa** (2h)

**Total: 1-2 dias**

**Começar?**

**Powered by:** BMad Team All + ness. 💙

