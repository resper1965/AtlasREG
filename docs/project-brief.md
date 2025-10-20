# Project Brief: AtlasReg

**Powered by:** ness. (Montserrat Medium, ponto em #00ADE8)  
**Versão:** 1.0  
**Data:** 17 de Outubro de 2025  
**Preparado por:** Business Analyst (BMad Method)

---

## Executive Summary

**AtlasReg** é uma plataforma de inteligência de mercado que utiliza IA para automatizar o monitoramento contínuo e análise do setor de transmissão de energia elétrica no Brasil. O sistema identifica automaticamente eventos críticos—multas regulatórias, incidentes operacionais, decisões da ANEEL/ONS, e transações de M&A—transformando dados dispersos em informações estratégicas acionáveis.

**Problema Principal:** Empresas do setor dependem de informações públicas fragmentadas (ANEEL, ONS, CMSE, B3) sem padronização, realizando inteligência de mercado manual e reativa que resulta em atrasos na tomada de decisão e perda de oportunidades estratégicas.

**Mercado-Alvo:** Transmissoras de energia elétrica, grupos econômicos do setor, fundos de infraestrutura, consultorias especializadas, e equipes de M&A que necessitam de visão competitiva e regulatória em tempo real.

**Proposta de Valor:** Automatizar 90% da leitura de documentos regulatórios, reduzir drasticamente o tempo de resposta a eventos relevantes, fornecer mapeamento completo do cenário competitivo e regulatório, gerando insights para decisões de M&A, CAPEX, compliance e relacionamento institucional.

---

## Problem Statement

### Estado Atual e Pain Points

O setor de transmissão de energia elétrica brasileiro opera sob intensa regulação da ANEEL, ONS e CMSE, com decisões críticas de negócio dependendo de informações públicas dispersas em múltiplas fontes:

- **Fragmentação de Fontes**: Notícias da ANEEL, processos de fiscalização (PVs), despachos regulatórios, atas de reuniões, dados do SIGEL, ocorrências operacionais do ONS, publicações no DOU, comunicados da B3/CVM, e mídia especializada (Canal Energia, MegaWhat, EPBR)
- **Ausência de Padronização**: Cada fonte possui formato próprio (HTML, PDF, portais JavaScript, documentos escaneados), dificultando consolidação sistemática
- **Processo Manual e Reativo**: Equipes de inteligência de mercado dedicam horas diárias lendo documentos manualmente, frequentemente descobrindo eventos críticos com atraso
- **Baixa Escalabilidade**: Impossível cobrir todas as fontes relevantes continuamente com recursos humanos limitados

### Impacto Quantificado

- **Tempo de Resposta**: Eventos críticos (multas a concorrentes, quedas de torre, mudanças regulatórias) levam dias para serem identificados e analisados
- **Perda de Oportunidades**: Transações de M&A e mudanças de controle societário podem passar despercebidas até aparecerem em relatórios financeiros trimestrais
- **Custos de Compliance**: Falta de visibilidade sobre decisões da ANEEL aumenta risco de não-conformidade e multas
- **Desvantagem Competitiva**: Empresas sem inteligência estruturada tomam decisões com informação incompleta sobre o mercado

### Por Que Soluções Existentes Falham

- **Agregadores Genéricos**: Ferramentas como Google Alerts capturam notícias, mas não processam documentos regulatórios complexos nem extraem entidades estruturadas
- **Clipping Manual**: Serviços de clipping tradicionais apenas consolidam fontes, sem análise semântica ou classificação automática de eventos
- **Sistemas Legados**: ERPs e ferramentas de BI existentes não foram projetados para ingestão e processamento de documentos não-estruturados em tempo real

### Urgência e Importância

O ambiente regulatório está em constante evolução, com a transição energética acelerando mudanças no setor. Empresas que estabelecerem vantagem informacional agora estarão melhor posicionadas para:
- Antecipar movimentos competitivos e regulatórios
- Identificar ativos para aquisição antes de concorrentes
- Mitigar riscos operacionais e regulatórios proativamente
- Construir relacionamento estratégico com órgãos reguladores baseado em dados

---

## Proposed Solution

### Conceito Central

**AtlasReg** é uma plataforma de inteligência artificial que automatiza o ciclo completo de **coleta → processamento → análise → alerta** de informações do setor de transmissão de energia elétrica brasileiro.

### Arquitetura da Solução

#### 1. Ingestão Automatizada de Dados
- **Scrapers inteligentes** (Python/Scrapy/Playwright) coletam dados de fontes heterogêneas (HTML, JavaScript dinâmico, PDFs)
- **Orquestração via Airflow** com agendamento contínuo e detecção de mudanças
- **Armazenamento em MinIO** (S3-compatible) para documentos brutos e arquivos processados

#### 2. Processamento Inteligente com IA
- **Conversão de documentos**: PDFs técnicos transformados em texto estruturado (pdfminer.six, PyMuPDF)
- **Classificação automática**: Modelos baseados em BERTimbau treinados para contexto regulatório brasileiro identificam tipo de evento (multa, decisão, transação, incidente operacional)
- **Extração de entidades**: spaCy com regras customizadas extrai empresas, CNPJs, valores monetários, ativos (linhas, subestações), datas, órgãos reguladores
- **Indexação semântica**: Sentence-BERT (SBERT) + FAISS para busca por similaridade conceitual
- **Busca estruturada**: Elasticsearch para queries por palavras-chave, valores, empresas, CNPJs

#### 3. Estruturação e Persistência
- **PostgreSQL** como banco central com schema otimizado:
  - Tabela de **Empresas** e grupos econômicos
  - Tabela de **Ativos** (linhas de transmissão, subestações)
  - Tabela de **Eventos** classificados por tipo, severidade, impacto
  - Tabela de **Documentos** processados com rastreabilidade

#### 4. Visualização e Alertas
- **Dashboards interativos** (Metabase ou Grafana):
  - Visão temporal de eventos por tipo e frequência
  - Filtros por empresa, estado, grupo econômico, ativo
  - Mapa georreferenciado de ocorrências operacionais
  - Timeline de decisões regulatórias
- **Sistema de alertas configuráveis**:
  - Notificações por email automatizadas
  - Bots para Telegram/Microsoft Teams
  - Painel de "watchlist" com eventos de alto impacto

### Diferenciais Competitivos

1. **Especialização Setorial**: Modelos de IA treinados especificamente para o contexto regulatório de transmissão de energia no Brasil
2. **Cobertura Completa**: Integração de fontes regulatórias, operacionais, financeiras e midiáticas em plataforma única
3. **Inteligência Acionável**: Não apenas coleta, mas classificação, extração de entidades e geração de insights estruturados
4. **Proatividade**: Sistema de alertas em tempo real vs. relatórios periódicos manuais
5. **Escalabilidade**: Arquitetura dockerizada permite crescimento horizontal conforme novas fontes são adicionadas

### Visão de Alto Nível

Transformar **AtlasReg** na "central nervosa" de inteligência de mercado para o setor de transmissão, onde qualquer evento relevante—desde uma multa da ANEEL até uma aquisição na B3—seja capturado, processado e alertado automaticamente em minutos, não dias.

---

## Target Users

### Primary User Segment: Equipes de Inteligência de Mercado e Regulatória

**Perfil Demográfico/Firmográfico:**
- Analistas de mercado, gerentes de inteligência competitiva, e diretores de relações institucionais em transmissoras de energia elétrica
- Empresas de médio a grande porte (receita anual > R$ 100M)
- Localizados principalmente em São Paulo, Rio de Janeiro, Brasília

**Comportamentos e Workflows Atuais:**
- Consultam diariamente sites da ANEEL, ONS, CMSE manualmente
- Assinam clipping de notícias genérico do setor
- Mantêm planilhas Excel com tracking de eventos relevantes
- Participam de comitês internos semanais para reportar inteligência de mercado

**Necessidades e Pain Points Específicos:**
- Reduzir tempo gasto em coleta manual de informações (atualmente 3-5h/dia)
- Não perder eventos críticos relacionados a concorrentes ou regulação
- Estruturar informações de forma consumível para executivos C-level
- Rastrear histórico de decisões regulatórias por empresa/ativo

**Goals:**
- Tomar decisões estratégicas baseadas em informações completas e tempestivas
- Antecipar movimentos de mercado e regulatórios
- Demonstrar valor da área de inteligência através de insights acionáveis

---

### Secondary User Segment: Equipes de M&A e Desenvolvimento de Negócios

**Perfil Demográfico/Firmográfico:**
- Vice-presidentes, diretores de M&A, e analistas de investimento em fundos de infraestrutura, private equity, e grupos econômicos do setor
- Consultores de boutiques especializadas em energia

**Comportamentos e Workflows Atuais:**
- Realizam due diligence em potenciais alvos de aquisição
- Monitoram comunicados da B3/CVM sobre transações societárias
- Analisam histórico de multas e desempenho operacional de concorrentes

**Necessidades e Pain Points Específicos:**
- Identificar oportunidades de M&A antes que se tornem públicas
- Avaliar riscos regulatórios e operacionais de ativos-alvo
- Mapear grupos econômicos e suas participações no setor

**Goals:**
- Descobrir alvos de aquisição atraentes precocemente
- Reduzir riscos em processos de M&A através de inteligência aprofundada
- Construir tese de investimento fundamentada em dados históricos

---

## Goals & Success Metrics

### Business Objectives

- **Automatizar 90% da coleta e processamento** de documentos regulatórios do setor de transmissão até 6 meses pós-lançamento
- **Reduzir tempo de identificação de eventos críticos** de dias para minutos (target: <30min da publicação oficial)
- **Capturar 100% das fontes oficiais prioritárias** (ANEEL, ONS, CMSE, SIGEL, DOU, B3) no MVP
- **Gerar ROI de 3x** nos primeiros 12 meses através de economia de tempo e identificação de oportunidades

### User Success Metrics

- **Redução de 70% no tempo** gasto por analistas em coleta manual de informações
- **Taxa de recall de 95%+** para eventos críticos (multas, transações, decisões regulatórias)
- **Tempo médio de resposta a alertas <24h** pelos usuários (indicando relevância dos alertas)
- **Net Promoter Score (NPS) >50** nos primeiros 6 meses

### Key Performance Indicators (KPIs)

- **Volume de Documentos Processados:** >5,000 documentos/mês após 3 meses de operação
- **Precisão de Classificação de Eventos:** >85% accuracy em ambiente de produção
- **Taxa de Extração de Entidades:** >80% de F1-score para empresas, CNPJs, valores monetários
- **Uptime do Sistema:** >99.5% de disponibilidade
- **Usuários Ativos Mensais (MAU):** 50+ usuários de 10+ organizações no primeiro ano
- **Alertas Enviados vs. Acionados:** >40% dos alertas resultam em ação do usuário (indicando relevância)

---

## MVP Scope

### Core Features (Must Have)

- **Scraping Automatizado das Fontes Prioritárias:**
  - ANEEL (notícias, despachos, processos de fiscalização)
  - ONS (ocorrências operacionais, boletins)
  - SIGEL (dados cadastrais de agentes)
  - Sites especializados: Canal Energia, MegaWhat, EPBR
  - **Rationale:** Cobrir 80% das informações críticas com 20% das fontes

- **Pipeline de Processamento de IA:**
  - Conversão de PDFs para texto estruturado
  - Classificação automática de eventos (multa, decisão, transação, incidente, notícia genérica)
  - Extração de entidades: empresas, CNPJs, valores, datas, ativos
  - **Rationale:** Transformar dados brutos em informação estruturada acionável

- **Banco de Dados Estruturado (PostgreSQL):**
  - Schema normalizado para empresas, ativos, eventos, documentos
  - Indexação para queries rápidas
  - **Rationale:** Fundação para análises históricas e tendências

- **Dashboard Básico de Visualização:**
  - Feed temporal de eventos classificados
  - Filtros por tipo de evento, empresa, data
  - Busca por palavra-chave
  - **Rationale:** Interface mínima para consumo das informações processadas

- **Sistema de Alertas por Email:**
  - Configuração de watchlist de empresas/tópicos
  - Emails diários com eventos relevantes
  - **Rationale:** Notificação proativa, canal de comunicação universal

### Out of Scope for MVP

- Integração com DOU (complexidade de parsing)
- Integração com B3/CVM (APIs requerem credenciais especiais)
- Bot de Telegram/Teams (nice-to-have, não crítico)
- Dashboard avançado com mapas georreferenciados
- Análise preditiva e forecasting
- APIs públicas para integração com sistemas de terceiros
- Mobile app
- Autenticação SSO corporativa (OAuth)

### MVP Success Criteria

O MVP será considerado bem-sucedido se:

1. **Cobertura de Fontes:** Sistema coleta e processa automaticamente ≥4 das 5 fontes prioritárias diariamente
2. **Qualidade de Dados:** ≥80% dos eventos classificados corretamente (validação manual em amostra)
3. **Usabilidade:** ≥5 usuários piloto conseguem usar dashboard e configurar alertas sem treinamento extensivo
4. **Performance:** Pipeline processa backlog diário (<500 documentos) em <4 horas
5. **Valor Percebido:** ≥70% dos usuários piloto reportam que o sistema economiza ≥2h/semana de trabalho manual

---

## Post-MVP Vision

### Phase 2 Features (3-6 meses pós-MVP)

- **Expansão de Fontes:**
  - Integração completa com DOU (portarias, nomeações, contratos)
  - Integração com B3/CVM (fatos relevantes, transações societárias)
  - Inclusão de fontes secundárias (blogs, podcasts, vídeos do YouTube)

- **Alertas Multicanal:**
  - Bots para Telegram e Microsoft Teams
  - Webhooks para integração com ferramentas corporativas (Slack, sistemas internos)

- **Dashboard Avançado:**
  - Mapas georreferenciados de eventos operacionais
  - Análise de tendências temporais e comparativas
  - Drill-down interativo por grupo econômico

- **Busca Semântica Avançada:**
  - Interface de perguntas em linguagem natural (Q&A sobre documentos)
  - Recomendação de documentos relacionados

### Long-term Vision (1-2 anos)

Evoluir **AtlasReg** de plataforma de monitoramento para **sistema preditivo de inteligência de mercado**:

- **Análise Preditiva:** Modelos de ML preveem probabilidade de eventos futuros (renovações de outorga, mudanças regulatórias)
- **Graph Database:** Modelagem de relacionamentos complexos entre empresas, grupos econômicos, ativos, reguladores
- **Cobertura Pan-Americana:** Expansão para mercados regulados de transmissão na América Latina (Argentina, Chile, Colômbia)
- **Marketplace de Insights:** Venda de relatórios estruturados e APIs de dados para clientes premium
- **Integração com GenAI:** Geração automática de sumários executivos e briefings personalizados

### Expansion Opportunities

- **Vertical:** Expandir para outros segmentos do setor elétrico (geração, distribuição, comercialização)
- **Horizontal:** Aplicar mesma tecnologia a outros setores regulados (saneamento, telecomunicações, óleo & gás)
- **Serviços Profissionais:** Consultoria especializada em inteligência de mercado usando AtlasReg como ferramenta
- **White-label:** Licenciar plataforma para grandes consultorias e associações setoriais

---

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Aplicação web responsiva acessível via navegadores modernos (Chrome, Firefox, Edge, Safari)
- **Browser/OS Support:** Desktop (Windows, macOS, Linux) e tablets; mobile apenas para visualização (não otimizado para configuração)
- **Performance Requirements:**
  - Dashboard carrega em <3s com conexão de banda larga
  - Busca retorna resultados em <2s para queries típicas
  - Pipeline de scraping processa 500 documentos em <4h

### Technology Preferences

**Frontend:**
- **Framework:** Next.js 14+ (React) com TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (design system ness)
- **State Management:** Zustand ou React Query
- **Visualização:** Recharts ou Victory para gráficos; Mapbox para mapas georreferenciados (Phase 2)

**Backend:**
- **Language:** Python 3.11+
- **Scraping:** Scrapy + Playwright (para sites JavaScript-heavy)
- **API Framework:** FastAPI (async, performance, documentação automática)
- **ML/NLP:** HuggingFace Transformers (BERTimbau), spaCy 3.x, Sentence-Transformers
- **Task Queue:** Celery + Redis (para processamento assíncrono)

**Database:**
- **Primary:** PostgreSQL 15+ (estruturado, online via Neon)
- **Vector Store:** FAISS (embeddings semânticos)
- **Search Engine:** Elasticsearch 8.x (busca full-text)
- **Object Storage:** MinIO (S3-compatible, PDFs e arquivos brutos)
- **Cache:** Redis (sessions, queries frequentes)

**Hosting/Infrastructure:**
- **Container Runtime:** Docker + Docker Compose
- **Orchestration:** Portainer (gerenciamento visual)
- **Reverse Proxy:** Traefik (gerenciado via Portainer, SSL automático)
- **Database:** Neon PostgreSQL (online, usado em todos os ambientes)
- **VPS:** Cloud provider ou VPS dedicado (DigitalOcean, AWS, Hetzner)

### Architecture Considerations

**Repository Structure:**
- **Monorepo recomendado** (usando Turborepo ou Nx) para simplificar desenvolvimento fullstack
  - `/apps/web` - Frontend Next.js
  - `/apps/api` - Backend FastAPI
  - `/apps/scraper` - Sistema de scraping com Airflow
  - `/packages/shared` - Types, utils compartilhados

**Service Architecture:**
- **Microserviços leves:**
  1. **Scraper Service:** Coleta e armazenamento bruto (Airflow + workers)
  2. **Processor Service:** Pipeline de IA (classificação, extração)
  3. **API Service:** FastAPI servindo frontend e alertas
  4. **Alert Service:** Sistema de notificações (email, futuros canais)

**Integration Requirements:**
- APIs REST internas entre serviços
- Webhooks para alertas externos (Phase 2)
- Consideração futura para GraphQL se complexidade de queries aumentar

**Security/Compliance:**
- **Autenticação:** JWT-based auth no MVP; SSO corporativo (SAML/OAuth) no Phase 2
- **Autorização:** RBAC (Role-Based Access Control) - admin, analyst, viewer
- **Data Privacy:** Dados públicos apenas no MVP; LGPD-compliance obrigatório para expansão
- **Audit Logs:** Rastreamento de acessos a informações sensíveis
- **Backups:** PostgreSQL backups diários automáticos via Neon; MinIO replicado

---

## Constraints & Assumptions

### Constraints

**Budget:**
- Desenvolvimento: Budget alocado para 6 semanas de desenvolvimento inicial (MVP)
- Infraestrutura: ~$200-500/mês para hosting, databases, APIs de terceiros no MVP
- Escalabilidade: Considerar custos crescentes com volume de dados e usuários

**Timeline:**
- **MVP Development:** 6 semanas conforme cronograma proposto
  - Semana 1-2: Ingestão de dados
  - Semana 3-4: Processamento IA
  - Semana 4: Banco de dados
  - Semana 5: Visualização e alertas
  - Semana 6: Testes e ajustes finais
- **Go-live Piloto:** Semana 7 com 5-10 usuários internos ou beta testers

**Resources:**
- Time de desenvolvimento: Assumindo 1-2 desenvolvedores fullstack + 1 especialista ML/NLP (pode ser consultoria)
- Suporte de produto: 1 pessoa para definição de requisitos e validação com usuários

**Technical:**
- Dependência de disponibilidade e estabilidade dos sites-fonte (ANEEL, ONS podem ter downtime)
- Limitação de rate limiting em alguns sites pode requerer ajustes nos scrapers
- Modelos de IA pré-treinados (BERTimbau) podem requerer fine-tuning com dados rotulados

### Key Assumptions

- **Acesso a Dados:** Todas as fontes prioritárias (ANEEL, ONS, CMSE, SIGEL) são públicas e acessíveis via scraping ético
- **Qualidade dos Dados:** Documentos publicados têm qualidade mínima para processamento (PDFs não são imagens escaneadas de baixa qualidade)
- **Volume de Dados:** Estimativa de 500-1000 documentos/semana no MVP é realista baseada em observação do setor
- **User Adoption:** Usuários-alvo têm motivação clara e estão dispostos a adotar nova ferramenta se valor for demonstrado
- **Disponibilidade de Dados de Treinamento:** É possível rotular manualmente 500-1000 documentos para treinar/validar modelos de classificação
- **Infraestrutura:** Neon PostgreSQL e MinIO suportam volume de dados e queries do MVP sem necessidade de otimização prematura
- **Regulamentação:** Scraping de dados públicos para fins de inteligência de mercado é legal e eticamente aceitável (não viola ToS dos sites)

---

## Risks & Open Questions

### Key Risks

- **Bloqueio de Scrapers:** Sites-fonte podem implementar CAPTCHAs, rate limiting agressivo, ou bloquear IPs, inviabilizando coleta automatizada.
  - **Mitigação:** Usar rotating proxies, user-agent randomization, respeitar robots.txt, implementar retry logic com backoff exponencial

- **Baixa Acurácia dos Modelos de IA:** Classificação e extração de entidades podem ter precisão <80%, gerando ruído nos alertas.
  - **Mitigação:** Começar com regra-based extraction como fallback, investir em rotulação de dados de qualidade, permitir feedback de usuários para retreinamento

- **Mudança de Estrutura dos Sites-Fonte:** Sites governamentais frequentemente mudam layout, quebrando scrapers.
  - **Mitigação:** Arquitetura modular com scrapers independentes por fonte, sistema de monitoramento para detectar falhas rapidamente, documentação clara para manutenção

- **Falta de Adoção por Usuários:** Plataforma pode ser percebida como complexa ou não entregar valor suficiente comparado a processos manuais.
  - **Mitigação:** Envolver usuários-chave desde o início (co-criação), priorizar usabilidade no design, oferecer onboarding guiado, medir e comunicar tempo economizado

- **Custos de Infraestrutura Crescentes:** Volume de dados pode crescer mais rápido que previsto, estourando budget de cloud.
  - **Mitigação:** Implementar políticas de retenção de dados (arquivar documentos >2 anos), otimizar queries de database, monitorar custos proativamente

- **Questões Legais/Éticas:** Scraping pode ser contestado legalmente ou reputacionalmente.
  - **Mitigação:** Consultar jurídico antes do go-live, garantir que apenas dados públicos são coletados, ter política de remoção sob solicitação

### Open Questions

- **Modelo de Negócio:** AtlasReg será produto interno de uma empresa, SaaS vendido a múltiplos clientes, ou misto? Isso impacta decisões de arquitetura (multitenancy) e segurança.
- **Jurisdição de Dados:** Onde os dados serão hospedados (Brasil vs. exterior)? Impacta escolha de cloud provider e compliance.
- **Frequência de Scraping:** Coleta deve ser contínua (a cada hora), diária, ou sob demanda? Impacta arquitetura de orquestração e custos.
- **Estratégia de Rotulação:** Quem irá rotular dados para treinar modelos de IA? Empresa contratará serviço terceirizado ou usará conhecimento interno?
- **Nível de Customização:** Usuários poderão configurar suas próprias regras de classificação/alertas, ou será standardizado?
- **Integrações Futuras:** Há sistemas corporativos específicos (CRM, ERP) que o AtlasReg precisará integrar no curto prazo?

### Areas Needing Further Research

- **Benchmark de Ferramentas de Scraping:** Validar que Scrapy + Playwright são suficientes para todos os tipos de site-fonte, ou considerar alternativas (Selenium, Apify)
- **Fine-tuning de BERTimbau:** Investigar datasets públicos do setor elétrico brasileiro para fine-tuning, ou necessidade de criar dataset proprietário
- **Elasticsearch vs. Alternativas:** Confirmar que Elasticsearch é ideal para o caso de uso, ou considerar Meilisearch, Typesense (mais leves)
- **Análise de Concorrentes:** Existem soluções similares no mercado brasileiro ou internacional? Como se posicionar?
- **User Research:** Entrevistas com 5-10 usuários-alvo para validar pain points, workflows, e willingness to pay

---

## Appendices

### A. Research Summary

**Fontes de Dados Mapeadas:**

| Fonte | Tipo de Informação | Formato | Frequência de Atualização |
|-------|-------------------|---------|---------------------------|
| ANEEL - Notícias | Decisões regulatórias, consultas públicas | HTML | Diária |
| ANEEL - Processos de Fiscalização (PV) | Multas, autuações | PDF | Semanal |
| ANEEL - Despachos | Autorizações, decisões administrativas | PDF | Diária |
| SIGEL | Dados cadastrais de agentes, outorgas | HTML/Tabelas | Mensal |
| ONS - Ocorrências | Incidentes operacionais, desligamentos | HTML/PDF | Diária |
| ONS - Boletins | Relatórios operacionais semanais | PDF | Semanal |
| CMSE | Atas de reuniões, decisões de emergência | PDF | Mensal |
| DOU | Portarias, nomeações, contratos | PDF/HTML | Diária |
| Canal Energia | Notícias do setor | HTML | Diária |
| MegaWhat | Análises e notícias | HTML | Diária |
| EPBR | Notícias, análises de mercado | HTML (paywall parcial) | Diária |
| B3/CVM | Fatos relevantes, aquisições | HTML/API | Tempo real |

**Technical Feasibility:**
- Scraping de sites governamentais brasileiros é tecnicamente viável (validado em projetos similares)
- BERTimbau demonstrou resultados superiores a modelos genéricos em tarefas de NLP em português brasileiro (fonte: papers acadêmicos)
- FAISS suporta milhões de vetores com latência de busca <50ms em hardware commodity

### B. Stakeholder Input

**Inputs Recebidos:**
- Cronograma executivo de 6 semanas com entregas semanais é preferido para demonstrar valor incremental
- Dashboard deve priorizar simplicidade sobre features avançadas no MVP
- Sistema de alertas por email é o canal prioritário (Telegram/Teams podem esperar Phase 2)

### C. References

- **ANEEL:** https://www.gov.br/aneel/
- **ONS:** https://www.ons.org.br/
- **SIGEL:** https://sigel.aneel.gov.br/
- **BERTimbau:** https://huggingface.co/neuralmind/bert-base-portuguese-cased
- **spaCy:** https://spacy.io/
- **Sentence-BERT:** https://www.sbert.net/
- **FAISS:** https://github.com/facebookresearch/faiss
- **Elasticsearch:** https://www.elastic.co/

---

## Next Steps

### Immediate Actions

1. **Validar escopo técnico** com stakeholders e ajustar se necessário
2. **Confirmar budget de infraestrutura** ($200-500/mês) e aprovar
3. **Definir KPIs prioritários** para tracking no dashboard MVP
4. **Iniciar rotulação de dados** (sample de 500 documentos) para treinamento de modelos
5. **Configurar ambientes de desenvolvimento** (repos, Docker, Neon database)
6. **Agendar kickoff técnico** com time de desenvolvimento para Semana 1

### PM Handoff

Este Project Brief fornece o contexto completo para o **AtlasReg - Plataforma de Inteligência de Mercado para Transmissão de Energia**.

**Próximos passos do workflow BMad:**

O **Product Manager** deve agora criar o **PRD (Product Requirements Document)** estruturado, que irá:
- Transformar este brief em requisitos funcionais detalhados
- Definir user stories e casos de uso específicos
- Especificar critérios de aceite para cada feature
- Priorizar backlog para as 6 semanas de desenvolvimento

Por favor, revise o brief completamente e solicite esclarecimentos antes de iniciar o PRD.

---

**Documento preparado por:** Mary (Business Analyst - BMad Method)  
**Para workflow:** Greenfield Fullstack Development  
**Próximo agente:** Product Manager (PM)


