"""
Agente Atlas - Especialista em Transmissão de Energia
Usa LangChain + OpenAI/Claude + pgvector + Redis
"""

import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import redis
from sqlalchemy.orm import Session

from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage, HumanMessage, AIMessage

from app.services.embedding_service import get_embedding_service
from app.services.search_service import SearchService
from app.models.event import EventoTipo, Severidade
from app.models.company import Company
from app.database import SessionLocal


class AtlasAgent:
    """
    Agente conversacional especializado em transmissão de energia
    
    Capacidades:
    - Buscar eventos por query semântica (pgvector)
    - Analisar empresas transmissoras
    - Calcular métricas financeiras
    - Comparar empresas
    - Identificar tendências
    - Memória de conversação (Redis)
    """
    
    def __init__(self, user_id: int, session_id: str = "default"):
        self.user_id = user_id
        self.session_id = session_id
        
        # Redis para memória de conversação
        self.redis_client = redis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6381/1"),
            decode_responses=True
        )
        
        # LLM (OpenAI GPT-4 ou Claude)
        # Para usar Claude: langchain_anthropic.ChatAnthropic
        self.llm = ChatOpenAI(
            model=os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview"),
            temperature=0.2,  # Preciso e factual
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            max_tokens=2000
        )
        
        # Serviço de embeddings
        self.embedding_service = get_embedding_service()
        
        # System prompt (persona do agente)
        self.system_prompt = """
Você é o Atlas, assistente especializado em transmissão de energia elétrica do Brasil.

EXPERTISE:
- Setor de transmissão de energia brasileiro
- Regulação ANEEL/ONS/EPE
- Análise financeira (RAP, EBITDA, ROE, WACC)
- M&A e valuation
- Análise de risco regulatório
- Ocorrências operacionais

DADOS DISPONÍVEIS:
- Eventos regulatórios (decisões ANEEL, multas, outorgas)
- Dados financeiros de 120+ transmissoras
- Transações M&A
- Ocorrências operacionais ONS
- Documentos técnicos e regulatórios

COMPORTAMENTO:
1. Seja PRECISO e baseado em dados
2. Sempre cite números específicos (R$, %, datas)
3. Formate respostas com:
   - 📊 para dados/métricas
   - 💰 para valores financeiros
   - ⚠️ para riscos
   - 💡 para insights
   - ✅ para positivos
   - 🔴 para negativos
4. Use tabelas quando comparar múltiplos items
5. Adicione análise e contexto (não apenas dados crus)
6. Sugira perguntas de follow-up relevantes
7. Mantenha contexto da conversa

NUNCA:
- Invente dados ou números
- Seja vago ou genérico
- Ignore o histórico da conversa
- Faça suposições sem dados

IDIOMA: Português brasileiro (formal, técnico)
"""
        
        # Tools disponíveis para o agente
        self.tools = self._create_tools()
        
        # Criar agente
        self.agent = self._create_agent()
    
    def _create_tools(self) -> List[Tool]:
        """
        Cria ferramentas que o agente pode usar
        """
        return [
            Tool(
                name="buscar_eventos",
                func=self._buscar_eventos,
                description="""
                Busca eventos no banco de dados usando busca semântica (pgvector).
                
                Input: Query em português (ex: "multas da Taesa em 2025" ou "outorgas concedidas em outubro")
                
                Output: Lista de eventos relevantes com:
                - Título, descrição, análise
                - Tipo (multa, outorga, decisão, etc)
                - Severidade (crítica, alta, média, baixa)
                - Data, valor (R$)
                - Empresas envolvidas
                - Fontes (ANEEL, ONS, etc)
                - Score de similaridade
                
                Use sempre que o usuário perguntar sobre eventos, multas, decisões, outorgas, etc.
                """
            ),
            Tool(
                name="dados_empresa",
                func=self._dados_empresa,
                description="""
                Retorna dados completos de uma empresa transmissora.
                
                Input: Nome da empresa (ex: "Taesa", "ISA CTEEP", "Copel")
                
                Output: Dados financeiros e operacionais:
                - RAP anual (R$ milhões)
                - EBITDA margin (%)
                - ROE (%)
                - Score de risco (0-100)
                - Número de projetos
                - Valor de mercado
                
                Use quando o usuário perguntar sobre uma empresa específica.
                """
            ),
            Tool(
                name="comparar_empresas",
                func=self._comparar_empresas,
                description="""
                Compara 2 ou mais empresas transmissoras.
                
                Input: Nomes das empresas separados por vírgula (ex: "Taesa,ISA CTEEP,Copel")
                
                Output: Comparação lado a lado de:
                - RAP, EBITDA, ROE
                - Score de risco
                - Múltiplos de valuation
                - Ranking relativo
                
                Use quando o usuário pedir comparação entre empresas.
                """
            ),
            Tool(
                name="calcular_impacto",
                func=self._calcular_impacto,
                description="""
                Calcula impacto financeiro de eventos ou cenários.
                
                Input: Descrição do cenário (ex: "impacto de R$ 15M de multa no ROE da Taesa")
                
                Output: Análise de impacto:
                - Valor absoluto (R$)
                - % da receita
                - Impacto no ROE
                - Comparação histórica
                
                Use para análises de impacto de multas, investimentos, eventos.
                """
            ),
            Tool(
                name="tendencias_mercado",
                func=self._tendencias_mercado,
                description="""
                Identifica tendências recentes no setor.
                
                Input: Período (ex: "última semana", "outubro 2025", "2025")
                
                Output: Análise de tendências:
                - Volume de eventos por tipo
                - Principais empresas afetadas
                - Valores envolvidos (total, média)
                - Comparação com período anterior
                - Insights sobre o momento do setor
                
                Use quando o usuário perguntar "o que está acontecendo", "novidades", "tendências".
                """
            ),
        ]
    
    def _create_agent(self) -> AgentExecutor:
        """
        Cria o agente LangChain com tools
        """
        # Template do prompt
        template = """
{system_prompt}

FERRAMENTAS DISPONÍVEIS:
{tools}

FORMATO DE RESPOSTA:
Para usar uma ferramenta:
Thought: [seu raciocínio]
Action: [nome da ferramenta]
Action Input: [input para a ferramenta]
Observation: [resultado da ferramenta]

Quando tiver a resposta final:
Thought: Tenho informações suficientes para responder
Final Answer: [sua resposta formatada]

HISTÓRICO DA CONVERSA:
{chat_history}

PERGUNTA DO USUÁRIO:
{input}

{agent_scratchpad}
"""
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["input", "chat_history", "agent_scratchpad"],
            partial_variables={
                "system_prompt": self.system_prompt,
                "tools": "\n".join([f"- {t.name}: {t.description}" for t in self.tools])
            }
        )
        
        # Criar agente ReAct
        agent = create_react_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
        
        # Executor
        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True,  # Debug
            max_iterations=5,
            handle_parsing_errors=True,
            return_intermediate_steps=False
        )
    
    def _buscar_eventos(self, query: str) -> str:
        """
        Tool: Buscar eventos usando pgvector
        """
        db = SessionLocal()
        try:
            search_service = SearchService(db)
            
            # Busca semântica
            events = search_service.search_events(
                query=query,
                match_threshold=0.65,  # Threshold mais baixo = mais resultados
                limit=10
            )
            
            if not events:
                return "Nenhum evento encontrado para esta busca."
            
            # Formatar para o LLM
            result = []
            for i, event in enumerate(events, 1):
                result.append({
                    "numero": i,
                    "titulo": event['title'],
                    "tipo": event['tipo'],
                    "severidade": event['severidade'],
                    "data": event['data'],
                    "valor": f"R$ {event['valor']:,.2f}M" if event['valor'] else "N/A",
                    "empresas": event['companies'] or "N/A",
                    "analise": event['analysis'] or "N/A",
                    "similaridade": f"{event['similarity']*100:.1f}%"
                })
            
            return json.dumps(result, ensure_ascii=False, indent=2)
        
        finally:
            db.close()
    
    def _dados_empresa(self, empresa_nome: str) -> str:
        """
        Tool: Buscar dados de uma empresa
        """
        db = SessionLocal()
        try:
            # Buscar empresa (case-insensitive, partial match)
            company = db.query(Company).filter(
                Company.name.ilike(f'%{empresa_nome}%')
            ).first()
            
            if not company:
                return f"Empresa '{empresa_nome}' não encontrada no banco de dados."
            
            # Formatar dados
            data = {
                "nome": company.name,
                "rap_anual": f"R$ {company.rap_anual:,.1f}M" if hasattr(company, 'rap_anual') and company.rap_anual else "N/A",
                "ebitda_margin": f"{company.ebitda_margin:.1f}%" if hasattr(company, 'ebitda_margin') and company.ebitda_margin else "N/A",
                "roe": f"{company.roe:.2f}%" if hasattr(company, 'roe') and company.roe else "N/A",
                "score_risco": company.score_risco_total if hasattr(company, 'score_risco_total') else "N/A",
            }
            
            return json.dumps(data, ensure_ascii=False, indent=2)
        
        finally:
            db.close()
    
    def _comparar_empresas(self, empresas: str) -> str:
        """
        Tool: Comparar múltiplas empresas
        """
        # Separar nomes
        empresa_names = [e.strip() for e in empresas.split(',')]
        
        db = SessionLocal()
        try:
            results = []
            
            for name in empresa_names:
                company = db.query(Company).filter(
                    Company.name.ilike(f'%{name}%')
                ).first()
                
                if company:
                    results.append({
                        "nome": company.name,
                        "rap": company.rap_anual if hasattr(company, 'rap_anual') else 0,
                        "ebitda": company.ebitda_margin if hasattr(company, 'ebitda_margin') else 0,
                        "roe": company.roe if hasattr(company, 'roe') else 0,
                        "risco": company.score_risco_total if hasattr(company, 'score_risco_total') else 0,
                    })
            
            if not results:
                return "Nenhuma empresa encontrada."
            
            return json.dumps(results, ensure_ascii=False, indent=2)
        
        finally:
            db.close()
    
    def _calcular_impacto(self, cenario: str) -> str:
        """
        Tool: Calcular impacto financeiro
        
        TODO: Implementar lógica de cálculo
        """
        return json.dumps({
            "cenario": cenario,
            "status": "Cálculo em desenvolvimento",
            "sugestao": "Por favor, forneça mais detalhes sobre o cenário"
        }, ensure_ascii=False)
    
    def _tendencias_mercado(self, periodo: str) -> str:
        """
        Tool: Analisar tendências
        
        TODO: Implementar análise temporal
        """
        db = SessionLocal()
        try:
            # Buscar eventos recentes
            from app.models.event import Event
            
            events = db.query(Event).order_by(Event.data.desc()).limit(20).all()
            
            summary = {
                "periodo": periodo,
                "total_eventos": len(events),
                "principais_tipos": {},
                "principais_empresas": {},
            }
            
            # Contar por tipo
            for event in events:
                tipo = event.tipo.value if event.tipo else "desconhecido"
                summary["principais_tipos"][tipo] = summary["principais_tipos"].get(tipo, 0) + 1
            
            return json.dumps(summary, ensure_ascii=False, indent=2)
        
        finally:
            db.close()
    
    def _load_chat_history(self) -> List[Dict[str, str]]:
        """
        Carrega histórico de conversação do Redis
        """
        session_key = f"chat:session:{self.user_id}:{self.session_id}"
        
        history_json = self.redis_client.get(session_key)
        
        if history_json:
            return json.loads(history_json)
        
        return []
    
    def _save_chat_history(self, messages: List[Dict[str, str]]):
        """
        Salva histórico no Redis (TTL 1 hora)
        """
        session_key = f"chat:session:{self.user_id}:{self.session_id}"
        
        # Manter apenas últimas 20 mensagens (10 pares)
        recent_messages = messages[-20:] if len(messages) > 20 else messages
        
        self.redis_client.setex(
            session_key,
            3600,  # 1 hora
            json.dumps(recent_messages, ensure_ascii=False)
        )
    
    async def chat(self, user_message: str) -> str:
        """
        Processar mensagem do usuário
        
        Args:
            user_message: Pergunta do usuário
            
        Returns:
            Resposta do agente
        """
        # Carregar histórico
        history = self._load_chat_history()
        
        # Formatar histórico para o prompt
        chat_history_str = ""
        for msg in history[-6:]:  # Últimas 3 interações
            role = "Usuário" if msg['role'] == 'user' else "Atlas"
            chat_history_str += f"{role}: {msg['content']}\n"
        
        try:
            # Executar agente
            response = await self.agent.ainvoke({
                "input": user_message,
                "chat_history": chat_history_str
            })
            
            agent_response = response.get('output', 'Desculpe, não consegui processar sua pergunta.')
        
        except Exception as e:
            print(f"❌ Erro no agente: {e}")
            agent_response = "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente."
        
        # Adicionar ao histórico
        history.append({"role": "user", "content": user_message, "timestamp": datetime.now().isoformat()})
        history.append({"role": "assistant", "content": agent_response, "timestamp": datetime.now().isoformat()})
        
        # Salvar histórico
        self._save_chat_history(history)
        
        return agent_response
    
    def clear_history(self):
        """
        Limpar histórico de conversação
        """
        session_key = f"chat:session:{self.user_id}:{self.session_id}"
        self.redis_client.delete(session_key)

