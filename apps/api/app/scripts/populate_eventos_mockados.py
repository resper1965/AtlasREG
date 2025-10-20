"""
Script para popular o banco com eventos mockados e gerar embeddings

Uso:
    python -m app.scripts.populate_eventos_mockados

O que faz:
1. Cria 300 eventos mockados realistas
2. Gera embeddings para cada evento (BERTimbau)
3. Salva no PostgreSQL com pgvector
"""

import sys
import os
from datetime import datetime, timedelta
import random

# Adicionar path do projeto
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.event import Event, EventoTipo, Severidade, Sentimento
from app.models.company import Company
from app.services.embedding_service import EmbeddingService

# Dados para gerar eventos mockados
EMPRESAS = [
    "Taesa", "ISA CTEEP", "Copel", "Terna", "Eletronorte", "Chesf",
    "Furnas", "Cemig", "CPFL", "Neoenergia", "Equatorial", "Energisa",
    "Enel", "AES", "Engie", "Light", "Celesc", "Coelba", "Cosern",
    "State Grid", "CDPQ", "Jequitinhonha", "Itaipava", "Triângulo Mineiro"
]

TIPOS_EVENTO = [
    EventoTipo.MULTA,
    EventoTipo.DECISAO_REGULATORIA,
    EventoTipo.OUTORGA_CONCEDIDA,
    EventoTipo.OUTORGA_VENCIDA,
    EventoTipo.REAJUSTE_TARIFARIO,
    EventoTipo.MA,
    EventoTipo.OCORRENCIA_ONS,
]

TEMPLATES_EVENTOS = {
    EventoTipo.MULTA: [
        "ANEEL aplica multa de R$ {valor}M à {empresa} por atraso em obra de {linha}",
        "Processo de fiscalização contra {empresa} resulta em multa de R$ {valor}M",
        "{empresa} é multada em R$ {valor}M por indisponibilidade de {linha}",
        "ANEEL penaliza {empresa} em R$ {valor}M por descumprimento de prazo",
        "Multa de R$ {valor}M aplicada à {empresa} por questões ambientais",
    ],
    EventoTipo.DECISAO_REGULATORIA: [
        "ANEEL aprova reajuste tarifário de {percentual}% para {empresa}",
        "Decisão regulatória altera metodologia de cálculo de RAP para {empresa}",
        "ANEEL autoriza {empresa} a iniciar operação de {linha}",
        "Resolução ANEEL estabelece novas regras para transmissão",
        "ANEEL aprova transferência de ativos de transmissão para {empresa}",
    ],
    EventoTipo.OUTORGA_CONCEDIDA: [
        "ANEEL concede outorga de {linha} à {empresa} com RAP de R$ {valor}M/ano",
        "{empresa} vence leilão de transmissão com lance de R$ {valor}M",
        "Outorga de {linha} concedida à {empresa} por 30 anos",
        "ANEEL autoriza {empresa} a construir {linha}",
        "{empresa} conquista outorga de projeto de transmissão de R$ {valor}M",
    ],
    EventoTipo.OUTORGA_VENCIDA: [
        "Outorga de {empresa} para {linha} vence em {data}",
        "ANEEL inicia processo de renovação de outorga da {empresa}",
        "Concessão de {linha} operada por {empresa} expira",
        "{empresa} solicita renovação de outorga de {linha}",
        "Vencimento de outorga da {empresa} gera incerteza no mercado",
    ],
    EventoTipo.REAJUSTE_TARIFARIO: [
        "Reajuste de {percentual}% aprovado para {empresa}",
        "{empresa} terá aumento de {percentual}% em receita anual",
        "IGP-M impacta reajuste da {empresa} em {percentual}%",
        "ANEEL aprova revisão tarifária da {empresa}",
        "Reajuste extraordinário de {percentual}% para {empresa}",
    ],
    EventoTipo.MA: [
        "{empresa} anuncia aquisição de ativos de transmissão por R$ {valor}M",
        "CDPQ adquire {percentual}% da {empresa} por R$ {valor}M",
        "{empresa} e {empresa2} anunciam joint venture de R$ {valor}M",
        "State Grid compra participação na {empresa}",
        "Fusão entre {empresa} e {empresa2} movimenta R$ {valor}M",
    ],
    EventoTipo.OCORRENCIA_ONS: [
        "ONS registra desligamento de {linha} operada por {empresa}",
        "{empresa} enfrenta indisponibilidade de {duracao}h em {linha}",
        "Falha em equipamento da {empresa} causa interrupção",
        "Manutenção emergencial em {linha} da {empresa}",
        "{empresa} reporta ocorrência operacional ao ONS",
    ],
}

LINHAS_TRANSMISSAO = [
    "LT 500kV", "LT 230kV", "LT 138kV", "LT 765kV", "LT 345kV",
    "Subestação 500/230kV", "Subestação 230/138kV", "Interligação Norte-Sul",
    "Linha Belo Monte", "Transmissão Madeira", "Interligação Sudeste-Sul"
]


def gerar_eventos_mockados(n: int = 300) -> list:
    """
    Gera N eventos mockados realistas
    """
    eventos = []
    data_inicio = datetime.now() - timedelta(days=365)  # Último ano
    
    for i in range(n):
        # Escolher tipo aleatório
        tipo = random.choice(TIPOS_EVENTO)
        
        # Gerar data aleatória no último ano
        dias_atras = random.randint(0, 365)
        data = data_inicio + timedelta(days=dias_atras)
        
        # Escolher empresa(s)
        empresa = random.choice(EMPRESAS)
        empresa2 = random.choice([e for e in EMPRESAS if e != empresa])
        
        # Escolher linha
        linha = random.choice(LINHAS_TRANSMISSAO)
        
        # Gerar valores
        if tipo == EventoTipo.MULTA:
            valor = round(random.uniform(0.5, 50), 1)  # R$ 0.5M - 50M
            severidade = Severidade.ALTA if valor > 10 else Severidade.MEDIA
        elif tipo in [EventoTipo.OUTORGA_CONCEDIDA, EventoTipo.MA]:
            valor = round(random.uniform(50, 5000), 0)  # R$ 50M - 5Bi
            severidade = Severidade.MEDIA
        elif tipo == EventoTipo.REAJUSTE_TARIFARIO:
            valor = round(random.uniform(2, 8), 1)  # 2% - 8%
            severidade = Severidade.BAIXA
        else:
            valor = round(random.uniform(1, 100), 1)
            severidade = random.choice([Severidade.BAIXA, Severidade.MEDIA])
        
        # Escolher template
        template = random.choice(TEMPLATES_EVENTOS[tipo])
        
        # Gerar título
        titulo = template.format(
            empresa=empresa,
            empresa2=empresa2,
            valor=valor,
            percentual=valor if tipo == EventoTipo.REAJUSTE_TARIFARIO else random.randint(3, 8),
            linha=linha,
            data=data.strftime("%d/%m/%Y"),
            duracao=random.randint(2, 24)
        )
        
        # Gerar descrição
        descricoes_base = [
            f"A decisão foi publicada no Diário Oficial em {data.strftime('%d/%m/%Y')}.",
            f"O processo teve início em {(data - timedelta(days=random.randint(30, 180))).strftime('%d/%m/%Y')}.",
            f"A empresa tem prazo de 30 dias para recurso.",
            f"Este é o {random.randint(1, 5)}º evento do tipo para a empresa este ano.",
            f"O impacto financeiro é estimado em {random.choice(['alto', 'médio', 'baixo'])}.",
        ]
        descricao = " ".join(random.sample(descricoes_base, k=random.randint(2, 4)))
        
        # Gerar análise
        analises = [
            f"Impacto estimado de {random.uniform(-1, -0.1):.2f}% no ROE.",
            f"Evento classif icado como {severidade.value}.",
            f"Recomenda-se monitoramento contínuo.",
            f"Empresas comparáveis: {', '.join(random.sample(EMPRESAS, k=3))}.",
        ]
        analise = " ".join(random.sample(analises, k=random.randint(2, 3)))
        
        # Sentimento
        if tipo == EventoTipo.MULTA:
            sentimento = Sentimento.NEGATIVO
        elif tipo in [EventoTipo.OUTORGA_CONCEDIDA, EventoTipo.REAJUSTE_TARIFARIO]:
            sentimento = Sentimento.POSITIVO
        else:
            sentimento = Sentimento.NEUTRO
        
        # Fonte
        fontes = ["ANEEL", "ONS", "SIGEL", "Imprensa"]
        fonte = random.choice(fontes)
        
        eventos.append({
            'titulo': titulo,
            'descricao': descricao,
            'tipo': tipo,
            'severidade': severidade,
            'sentimento': sentimento,
            'data': data.date(),
            'valor': valor if tipo != EventoTipo.REAJUSTE_TARIFARIO else None,
            'companies': [empresa] if tipo != EventoTipo.MA else [empresa, empresa2],
            'sources': [fonte],
            'analysis': analise,
        })
    
    return eventos


def popular_banco_com_embeddings():
    """
    Popular banco com eventos mockados e gerar embeddings
    """
    print("=" * 60)
    print("🚀 POPULANDO BANCO COM EVENTOS MOCKADOS + EMBEDDINGS")
    print("=" * 60)
    print()
    
    # Criar sessão
    db = SessionLocal()
    
    try:
        # Verificar se já existem eventos
        count_existente = db.query(Event).count()
        if count_existente > 0:
            print(f"⚠️  Já existem {count_existente} eventos no banco.")
            resposta = input("Deseja limpar e recriar? (s/N): ")
            if resposta.lower() == 's':
                print("🗑️  Limpando eventos existentes...")
                db.query(Event).delete()
                db.commit()
                print("✅ Eventos antigos removidos.")
            else:
                print("❌ Operação cancelada.")
                return
        
        # Gerar eventos mockados
        print("\n📝 Gerando 300 eventos mockados...")
        eventos_data = gerar_eventos_mockados(300)
        print(f"✅ {len(eventos_data)} eventos gerados!")
        
        # Criar objetos Event
        print("\n💾 Salvando eventos no banco...")
        eventos_obj = []
        for i, data in enumerate(eventos_data, 1):
            evento = Event(**data)
            db.add(evento)
            eventos_obj.append(evento)
            
            if i % 50 == 0:
                print(f"  → {i}/300 eventos salvos...")
        
        db.commit()
        print("✅ Todos os eventos salvos no banco!")
        
        # Gerar embeddings
        print("\n🧠 Gerando embeddings com BERTimbau...")
        print("   (Isso pode demorar alguns minutos...)")
        
        embedding_service = EmbeddingService()
        
        for i, evento in enumerate(eventos_obj, 1):
            # Gerar embedding
            embedding = embedding_service.generate_event_embedding(evento)
            
            # Atualizar evento
            evento.embedding = embedding
            
            if i % 10 == 0:
                db.commit()
                print(f"  → {i}/300 embeddings gerados ({(i/300*100):.1f}%)")
        
        db.commit()
        print("✅ Todos os embeddings gerados e salvos!")
        
        # Estatísticas finais
        print("\n" + "=" * 60)
        print("📊 ESTATÍSTICAS FINAIS")
        print("=" * 60)
        
        total = db.query(Event).count()
        com_embedding = db.query(Event).filter(Event.embedding.isnot(None)).count()
        
        print(f"Total de eventos: {total}")
        print(f"Com embeddings: {com_embedding} ({com_embedding/total*100:.1f}%)")
        print()
        
        # Por tipo
        print("Por tipo:")
        for tipo in TIPOS_EVENTO:
            count = db.query(Event).filter(Event.tipo == tipo).count()
            print(f"  - {tipo.value}: {count}")
        print()
        
        # Por severidade
        print("Por severidade:")
        for sev in [Severidade.CRITICA, Severidade.ALTA, Severidade.MEDIA, Severidade.BAIXA]:
            count = db.query(Event).filter(Event.severidade == sev).count()
            print(f"  - {sev.value}: {count}")
        
        print("\n" + "=" * 60)
        print("✅ BANCO POPULADO COM SUCESSO!")
        print("=" * 60)
        print()
        print("🔍 Agora o bot Atlas pode fazer buscas semânticas!")
        print("🤖 Teste perguntando: 'Quais as maiores multas da Taesa?'")
        print()
        
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        db.rollback()
        raise
    
    finally:
        db.close()


if __name__ == "__main__":
    popular_banco_com_embeddings()

