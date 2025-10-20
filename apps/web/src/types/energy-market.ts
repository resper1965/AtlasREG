/**
 * Types para Mercado de Energia - AtlasReg by ness.
 * Baseado em análise real do setor de transmissão brasileiro
 */

// ==========================================
// ENUMS
// ==========================================

export enum EventoTipo {
  DECISAO_REGULATORIA = 'decisao_regulatoria',
  MULTA = 'multa',
  OUTORGA_CONCEDIDA = 'outorga_concedida',
  OUTORGA_VENCIDA = 'outorga_vencida',
  REAJUSTE_TARIFARIO = 'reajuste_tarifario',
  TRANSACAO_MA = 'transacao_ma',
  INCIDENTE_OPERACIONAL = 'incidente_operacional',
  NOVO_PROJETO = 'novo_projeto',
  ATRASO_PROJETO = 'atraso_projeto',
  OUTRO = 'outro'
}

export enum Severidade {
  CRITICA = 'critica',
  ALTA = 'alta',
  MEDIA = 'media',
  BAIXA = 'baixa'
}

export enum Sentimento {
  MUITO_POSITIVO = 'muito_positivo',
  POSITIVO = 'positivo',
  NEUTRO = 'neutro',
  NEGATIVO = 'negativo',
  MUITO_NEGATIVO = 'muito_negativo'
}

// ==========================================
// INTERFACES - EVENTOS
// ==========================================

export interface Evento {
  id: number;
  tipo: EventoTipo;
  severidade: Severidade;
  titulo: string;
  descricao?: string;
  data_evento: string;  // ISO date
  data_publicacao: string;
  
  // Entidades
  empresas: string[];  // Nome das empresas envolvidas
  empresas_cnpj?: string[];
  localizacao?: {
    estado?: string;
    cidade?: string;
    subestacao?: string;
  };
  
  // Financeiro
  valor_impacto?: number;  // Em reais (positivo ou negativo)
  moeda: 'BRL' | 'USD';
  
  // Classificação
  tags: string[];
  keywords: string[];
  fonte: string;  // ANEEL, ONS, Canal Energia, etc
  url_original: string;
  
  // Análises
  analise_financeira?: AnaliseFinanceira;
  analise_risco?: AnaliseRisco;
  
  // Meta
  confianca_ia: number;  // 0-100
  verificado: boolean;
  requer_atencao: boolean;
}

// ==========================================
// INTERFACES - ANÁLISES
// ==========================================

export interface AnaliseFinanceira {
  impacto_receita?: number;  // R$
  impacto_ebitda?: number;
  impacto_resultado?: number;
  impacto_roe?: number;  // Percentual
  impacto_wacc?: number;
  
  // Valuation (para M&A)
  enterprise_value?: number;
  ev_rap_multiple?: number;
  ev_ebitda_multiple?: number;
  preco_km?: number;
  
  // Comparação
  comparacao_historica?: 'premium' | 'desconto' | 'na_media';
  percentual_vs_media?: number;
  
  // Sentimento
  sentimento: Sentimento;
  justificativa?: string;
}

export interface AnaliseRisco {
  // Scores 0-100
  risco_regulatorio: number;
  risco_financeiro: number;
  risco_operacional: number;
  risco_reputacional: number;
  risco_mercado: number;
  
  // Score total (média ponderada)
  score_total: number;
  
  // Detalhes
  fatores_risco: string[];
  mitigacoes: string[];
  probabilidade_materialization: number;  // 0-100
  impacto_potencial: number;  // R$
}

// ==========================================
// INTERFACES - EMPRESAS
// ==========================================

export interface Transmissora {
  id: number;
  nome: string;
  nome_legal: string;
  cnpj: string;
  
  // Hierarquia
  grupo_economico?: string;
  controlador?: string;
  
  // Operacional
  linhas_km: number;
  subestacoes: number;
  capacidade_mva: number;
  tensoes_operacao: string[];  // ['765kV', '500kV', '230kV']
  
  // Financeiro
  rap_anual: number;  // R$
  brr: number;  // Base Remuneração Regulatória
  ebitda: number;
  ebitda_margin: number;  // %
  roe: number;  // %
  alavancagem: number;  // Dívida Líquida/EBITDA
  
  // Rating
  rating_credito?: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B';
  rating_agencia?: string;  // S&P, Fitch, Moody's
  
  // Risco
  score_risco_total: number;  // 0-100
  multas_12m: number;  // R$
  processos_ativos: number;
  
  // Capital
  capital_aberto: boolean;
  ticker_b3?: string;  // TAEE11, TRPL4, etc
  
  // Performance
  disponibilidade_media: number;  // %
  parcela_variavel_recebida: number;  // % da PV máxima
  
  // Meta
  atualizado_em: string;
}

// ==========================================
// INTERFACES - INDICADORES DE MERCADO
// ==========================================

export interface IndicadoresMercado {
  data_referencia: string;
  
  // Setor
  rap_total_setor: number;  // R$
  numero_transmissoras: number;
  linhas_km_total: number;
  
  // Financeiro
  ev_rap_medio: number;  // Múltiplo
  ev_rap_min: number;
  ev_rap_max: number;
  ebitda_margin_media: number;  // %
  roe_medio: number;  // %
  
  // Regulatório
  multas_mes: number;  // R$
  processos_ativos: number;
  valor_risco_total: number;  // R$ em PVs
  
  // Mercado
  deals_ma_ytd: number;
  volume_ma_ytd: number;  // R$
  
  // Índices
  igpm_12m: number;  // %
  selic: number;  // %
  wacc_regulatorio: number;  // %
}

// ==========================================
// INTERFACES - DASHBOARDS
// ==========================================

export interface DashboardVisaoExecutiva {
  kpis: {
    rap_total: number;
    rap_variacao: number;  // %
    novas_outorgas_mes: number;
    novas_outorgas_rap: number;
    multas_mes: number;
    multas_variacao: number;
    eventos_criticos_semana: number;
    ma_volume_ytd: number;
    ma_deals_ytd: number;
    valor_risco_total: number;
  };
  
  eventos_recentes: Evento[];
  top_empresas_rap: Array<{
    empresa: string;
    rap: number;
    percentual_setor: number;
  }>;
  multas_por_tipo: Array<{
    tipo: string;
    valor: number;
    quantidade: number;
  }>;
  timeline_ma: Array<{
    data: string;
    valor: number;
    deal: string;
  }>;
}

export interface DashboardFinanceiro {
  valuation: {
    ev_rap_atual: number;
    ev_rap_historico: number;
    ev_rap_empresas: Array<{
      empresa: string;
      ev_rap: number;
      rap: number;
    }>;
  };
  
  performance: {
    ebitda_margin_ranking: Array<{
      empresa: string;
      margin: number;
    }>;
    roe_ranking: Array<{
      empresa: string;
      roe: number;
    }>;
  };
  
  indices: {
    igpm_12m: number[];  // Array histórico
    wacc_historico: number[];
    selic_historico: number[];
  };
}

export interface DashboardRisco {
  processos: Array<{
    empresa: string;
    processos_ativos: number;
    valor_risco: number;
    score_risco: number;
  }>;
  
  projetos_risco: Array<{
    projeto: string;
    empresa: string;
    atraso_dias: number;
    probabilidade_multa: number;
    impacto_estimado: number;
  }>;
  
  vencimentos_outorga: Array<{
    empresa: string;
    linha: string;
    data_vencimento: string;
    rap_anual: number;
    status_renovacao: 'em_analise' | 'aprovado' | 'risco' | 'perdido';
  }>;
}

// ==========================================
// INTERFACES - WATCHLISTS
// ==========================================

export interface Watchlist {
  id: number;
  usuario_id: number;
  nome: string;
  descricao?: string;
  
  // Filtros
  empresas: string[];
  tipos_evento: EventoTipo[];
  severidade_minima: Severidade;
  keywords: string[];
  
  // Alertas
  alerta_email: boolean;
  alerta_inapp: boolean;
  frequencia_digest: 'realtime' | 'daily' | 'weekly';
  
  // Stats
  eventos_novos_7d: number;
  eventos_total: number;
  criado_em: string;
  atualizado_em: string;
}

// ==========================================
// TIPOS DE RESPOSTA API
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface EventosSearchParams {
  query?: string;
  tipo?: EventoTipo[];
  severidade?: Severidade[];
  empresa?: string[];
  data_inicio?: string;
  data_fim?: string;
  valor_min?: number;
  valor_max?: number;
  page?: number;
  per_page?: number;
  sort_by?: 'data' | 'valor' | 'severidade' | 'relevancia';
  sort_order?: 'asc' | 'desc';
}

