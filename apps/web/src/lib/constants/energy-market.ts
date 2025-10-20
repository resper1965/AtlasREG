/**
 * Constantes do Mercado de Energia - AtlasReg by ness.
 * Dados reais do setor de transmissão brasileiro
 */

import { EventoTipo, Severidade, Sentimento } from '@/types/energy-market';

// ==========================================
// PRINCIPAIS TRANSMISSORAS (Top 20)
// ==========================================

export const TOP_TRANSMISSORAS = [
  { id: 'taesa', nome: 'Taesa', rapAnual: 3500, roe: 11.2, ebitdaMargin: 88.5, grupo: 'Taesa', ticker: 'TAEE11', participacao_setor: 14.9 },
  { id: 'isa-cteep', nome: 'ISA CTEEP', rapAnual: 3200, roe: 10.8, ebitdaMargin: 87.2, grupo: 'ISA (Colômbia)', ticker: 'TRPL4', participacao_setor: 13.6 },
  { id: 'copel', nome: 'Copel Transmissão', rapAnual: 1800, roe: 9.5, ebitdaMargin: 85.3, grupo: 'Copel', ticker: null, participacao_setor: 7.7 },
  { id: 'chesf', nome: 'Chesf', rapAnual: 1500, roe: 8.9, ebitdaMargin: 83.1, grupo: 'Eletrobras', ticker: 'ELET3', participacao_setor: 6.4 },
  { id: 'furnas', nome: 'Furnas', rapAnual: 1400, roe: 9.2, ebitdaMargin: 84.5, grupo: 'Eletrobras', ticker: 'ELET3', participacao_setor: 6.0 },
  { id: 'eletronorte', nome: 'Eletronorte', rapAnual: 1200, roe: 8.1, ebitdaMargin: 82.3, grupo: 'Eletrobras', ticker: 'ELET3', participacao_setor: 5.1 },
  { id: 'eate', nome: 'EATE', rapAnual: 950, roe: 10.5, ebitdaMargin: 86.8, grupo: 'State Grid', ticker: null, participacao_setor: 4.0 },
  { id: 'eletrosul', nome: 'Eletrosul', rapAnual: 900, roe: 8.7, ebitdaMargin: 83.9, grupo: 'Eletrobras', ticker: 'ELET3', participacao_setor: 3.8 },
  { id: 'cemig', nome: 'Cemig GT', rapAnual: 850, roe: 9.8, ebitdaMargin: 85.7, grupo: 'Cemig', ticker: 'CMIG4', participacao_setor: 3.6 },
  { id: 'transnorte', nome: 'Transnorte Energia', rapAnual: 720, roe: 11.5, ebitdaMargin: 89.2, grupo: 'Alupar', ticker: 'ALUP11', participacao_setor: 3.1 },
  { id: 'terna', nome: 'Terna', rapAnual: 680, roe: 10.2, ebitdaMargin: 86.1, grupo: 'Terna', ticker: null, participacao_setor: 2.9 },
  { id: 'alupar', nome: 'Alupar', rapAnual: 650, roe: 10.9, ebitdaMargin: 87.8, grupo: 'Alupar', ticker: 'ALUP11', participacao_setor: 2.8 },
] as const;

// ==========================================
// MÉTRICAS DO SETOR
// ==========================================

export const METRICAS_SETOR = {
  rap_total: 23500000000,  // R$ 23,5 bilhões/ano
  linhas_km_total: 185000,  // 185 mil km
  subestacoes_total: 3500,
  capacidade_mva_total: 400000,  // 400 mil MVA
  numero_transmissoras: 120,
  
  // Crescimento
  crescimento_rap_anual: 5.2,  // %
  expansao_km_anual: 2800,  // km/ano
  
  // Performance
  disponibilidade_media: 98.5,  // %
  perdas_tecnicas_media: 2.1,  // %
  
  // Financeiro
  ebitda_margin_media: 85,  // %
  roe_medio: 10.5,  // %
  ev_rap_medio: 13.2,  // Múltiplo M&A
} as const;

// ==========================================
// TIPOS DE INFRAÇÃO (Multas)
// ==========================================

export const TIPOS_INFRACAO = [
  { id: 'indisponibilidade', nome: 'Indisponibilidade de Ativos', frequencia_alta: true },
  { id: 'atraso_obra', nome: 'Atraso em Cronograma de Obra', frequencia_alta: true },
  { id: 'ambiental', nome: 'Questões Ambientais', frequencia_media: true },
  { id: 'trabalhista', nome: 'Questões Trabalhistas', frequencia_media: true },
  { id: 'medicao', nome: 'Erro em Medição/Faturamento', frequencia_baixa: true },
  { id: 'seguranca', nome: 'Segurança Operacional', frequencia_baixa: true },
  { id: 'qualidade', nome: 'Qualidade do Serviço', frequencia_media: true },
] as const;

// ==========================================
// NÍVEIS DE TENSÃO
// ==========================================

export const NIVEIS_TENSAO = [
  { tensao: '765kV', descricao: 'Extra Alta Tensão', uso: 'Interligação regional', percentual_rede: 5 },
  { tensao: '500kV', descricao: 'Extra Alta Tensão', uso: 'Transmissão longa distância', percentual_rede: 25 },
  { tensao: '345kV', descricao: 'Alta Tensão', uso: 'Transmissão regional', percentual_rede: 15 },
  { tensao: '230kV', descricao: 'Alta Tensão', uso: 'Transmissão/subtransmissão', percentual_rede: 35 },
  { tensao: '138kV', descricao: 'Subtransmissão', uso: 'Interligação distribuidoras', percentual_rede: 20 },
] as const;

// ==========================================
// INDICADORES FINANCEIROS
// ==========================================

export const INDICADORES_REFERENCIA = {
  // Valuation
  ev_rap: {
    minimo_historico: 10.0,
    maximo_historico: 16.0,
    media_5anos: 12.8,
    atual: 13.2,
  },
  
  // Performance
  ebitda_margin: {
    minimo_setor: 75,
    media_setor: 85,
    maximo_setor: 92,
    benchmark_internacional: 80,
  },
  
  roe: {
    wacc_regulatorio: 8.92,  // Piso
    media_setor: 10.5,
    top_quartil: 12.0,
  },
  
  // Endividamento
  alavancagem: {
    conservador: 2.5,  // Dívida/EBITDA
    moderado: 3.5,
    agressivo: 5.0,
    media_setor: 3.8,
  },
} as const;

// ==========================================
// CORES POR SEVERIDADE/SENTIMENTO
// ==========================================

export const CORES_SEVERIDADE = {
  critica: 'text-red-600 dark:text-red-400',
  alta: 'text-orange-600 dark:text-orange-400',
  media: 'text-yellow-600 dark:text-yellow-400',
  baixa: 'text-blue-600 dark:text-blue-400',
} as const;

export const CORES_SENTIMENTO = {
  muito_positivo: 'text-green-700 dark:text-green-400',
  positivo: 'text-green-600 dark:text-green-500',
  neutro: 'text-gray-600 dark:text-gray-400',
  negativo: 'text-orange-600 dark:text-orange-400',
  muito_negativo: 'text-red-600 dark:text-red-400',
} as const;

// ==========================================
// LABELS EM PORTUGUÊS
// ==========================================

export const LABELS_TIPO_EVENTO: Record<EventoTipo, string> = {
  [EventoTipo.DECISAO_REGULATORIA]: 'Decisão Regulatória',
  [EventoTipo.MULTA]: 'Multa/PV',
  [EventoTipo.OUTORGA_CONCEDIDA]: 'Outorga Concedida',
  [EventoTipo.OUTORGA_VENCIDA]: 'Outorga Vencida',
  [EventoTipo.REAJUSTE_TARIFARIO]: 'Reajuste Tarifário',
  [EventoTipo.TRANSACAO_MA]: 'Transação M&A',
  [EventoTipo.INCIDENTE_OPERACIONAL]: 'Incidente Operacional',
  [EventoTipo.NOVO_PROJETO]: 'Novo Projeto',
  [EventoTipo.ATRASO_PROJETO]: 'Atraso de Projeto',
  [EventoTipo.OUTRO]: 'Outro',
};

export const LABELS_SEVERIDADE: Record<Severidade, string> = {
  [Severidade.CRITICA]: 'Crítica',
  [Severidade.ALTA]: 'Alta',
  [Severidade.MEDIA]: 'Média',
  [Severidade.BAIXA]: 'Baixa',
};

export const LABELS_SENTIMENTO: Record<Sentimento, string> = {
  [Sentimento.MUITO_POSITIVO]: 'Muito Positivo',
  [Sentimento.POSITIVO]: 'Positivo',
  [Sentimento.NEUTRO]: 'Neutro',
  [Sentimento.NEGATIVO]: 'Negativo',
  [Sentimento.MUITO_NEGATIVO]: 'Muito Negativo',
};

// ==========================================
// FORMATADORES
// ==========================================

export const formatarReal = (valor: number): string => {
  if (valor >= 1000000000) {
    return `R$ ${(valor / 1000000000).toFixed(2)} Bi`;
  }
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000).toFixed(1)} Mi`;
  }
  if (valor >= 1000) {
    return `R$ ${(valor / 1000).toFixed(0)} mil`;
  }
  return `R$ ${valor.toFixed(2)}`;
};

export const formatarPercentual = (valor: number, decimals = 1): string => {
  return `${valor.toFixed(decimals)}%`;
};

export const formatarMultiplo = (valor: number): string => {
  return `${valor.toFixed(1)}x`;
};

// ==========================================
// EVENTOS MOCKADOS (para popular frontend)
// ==========================================

export const EVENTOS_MOCK = [
  {
    id: 1,
    titulo: 'ANEEL aplica multa de R$ 15M à Taesa por atraso em obra',
    descricao: 'Processo de fiscalização resultou em penalização por atraso na LT 500kV. Prazo para recurso: 30 dias.',
    tipo: EventoTipo.MULTA,
    severidade: Severidade.ALTA,
    sentimento: Sentimento.NEGATIVO,
    data: '2025-10-15',
    valor: 15,
    empresas: ['Taesa'],
    fonte: 'ANEEL',
    analysis: 'Impacto estimado de -0.45% no ROE da companhia.',
  },
  {
    id: 2,
    titulo: 'ISA CTEEP vence leilão de transmissão com lance de R$ 95M',
    descricao: 'Outorga concedida pela ANEEL para construção de LT 230kV com RAP de R$ 95M/ano.',
    tipo: EventoTipo.OUTORGA_CONCEDIDA,
    severidade: Severidade.MEDIA,
    sentimento: Sentimento.POSITIVO,
    data: '2025-10-10',
    valor: 95,
    empresas: ['ISA CTEEP'],
    fonte: 'ANEEL',
    analysis: 'Expansão da base de ativos. Múltiplo RAP adequado.',
  },
  {
    id: 3,
    titulo: 'ANEEL aprova reajuste tarifário de 4.1% para Copel',
    descricao: 'Reajuste aprovado com base no IGP-M acumulado. Vigência a partir de novembro/2025.',
    tipo: EventoTipo.REAJUSTE_TARIFARIO,
    severidade: Severidade.BAIXA,
    sentimento: Sentimento.POSITIVO,
    data: '2025-10-08',
    valor: null,
    empresas: ['Copel'],
    fonte: 'ANEEL',
    analysis: 'Incremento de receita de ~R$ 74M/ano.',
  },
  {
    id: 4,
    titulo: 'CDPQ anuncia aquisição de 25% da Transmissora CO por R$ 2,7 Bi',
    descricao: 'Transação movimenta R$ 2,7 bilhões. Múltiplo de 14.2x EBITDA.',
    tipo: EventoTipo.TRANSACAO_MA,
    severidade: Severidade.MEDIA,
    sentimento: Sentimento.NEUTRO,
    data: '2025-10-05',
    valor: 2700,
    empresas: ['CDPQ', 'Transmissora Centro-Oeste'],
    fonte: 'Imprensa',
    analysis: 'Múltiplo acima da média do setor (13.2x).',
  },
  {
    id: 5,
    titulo: 'ONS registra indisponibilidade de 12h em LT operada por Terna',
    descricao: 'Falha em equipamento causou desligamento temporário. Manutenção emergencial realizada.',
    tipo: EventoTipo.INCIDENTE_OPERACIONAL,
    severidade: Severidade.MEDIA,
    sentimento: Sentimento.NEGATIVO,
    data: '2025-10-03',
    valor: null,
    empresas: ['Terna'],
    fonte: 'ONS',
    analysis: 'Pode impactar índice de disponibilidade mensal.',
  },
] as const;

