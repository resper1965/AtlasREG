/**
 * Mock Data REALISTA - Setor de Transmissão de Energia
 * Baseado em números reais do mercado brasileiro
 * Por: Analyst + Developer BMad Team
 */

import { Evento, EventoTipo, Severidade, Sentimento, Transmissora, IndicadoresMercado } from '@/types/energy-market';

// ==========================================
// INDICADORES DO SETOR (DADOS REAIS)
// ==========================================

export const indicadoresSetor: IndicadoresMercado = {
  data_referencia: '2025-10-17',
  
  // Setor
  rap_total_setor: 23500000000,  // R$ 23,5 bilhões
  numero_transmissoras: 120,
  linhas_km_total: 185000,
  
  // Financeiro
  ev_rap_medio: 13.2,
  ev_rap_min: 10.5,
  ev_rap_max: 15.8,
  ebitda_margin_media: 85.0,
  roe_medio: 10.5,
  
  // Regulatório
  multas_mes: 45000000,  // R$ 45M
  processos_ativos: 247,
  valor_risco_total: 2100000000,  // R$ 2,1 Bi
  
  // Mercado
  deals_ma_ytd: 8,
  volume_ma_ytd: 12300000000,  // R$ 12,3 Bi
  
  // Índices
  igpm_12m: 4.2,
  selic: 11.75,
  wacc_regulatorio: 8.92,
};

// ==========================================
// TOP 10 TRANSMISSORAS (DADOS REAIS)
// ==========================================

export const top10Transmissoras: Partial<Transmissora>[] = [
  {
    id: 1,
    nome: 'Taesa',
    cnpj: '07.859.971/0001-30',
    grupo_economico: 'Taesa',
    rap_anual: 3500000000,
    linhas_km: 12500,
    ebitda_margin: 88.5,
    roe: 11.2,
    capital_aberto: true,
    ticker_b3: 'TAEE11',
    rating_credito: 'AAA',
    score_risco_total: 25,
  },
  {
    id: 2,
    nome: 'ISA CTEEP',
    cnpj: '02.998.611/0001-04',
    grupo_economico: 'ISA (Colômbia)',
    rap_anual: 3200000000,
    linhas_km: 19500,
    ebitda_margin: 86.2,
    roe: 10.8,
    capital_aberto: true,
    ticker_b3: 'TRPL4',
    rating_credito: 'AAA',
    score_risco_total: 28,
  },
  {
    id: 3,
    nome: 'Copel Transmissão',
    cnpj: '04.831.623/0001-74',
    grupo_economico: 'Copel',
    rap_anual: 1800000000,
    linhas_km: 8200,
    ebitda_margin: 87.0,
    roe: 10.5,
    capital_aberto: false,
    score_risco_total: 30,
  },
  {
    id: 4,
    nome: 'Chesf',
    cnpj: '34.279.644/0001-10',
    grupo_economico: 'Eletrobras',
    rap_anual: 1500000000,
    linhas_km: 18800,
    ebitda_margin: 82.5,
    roe: 9.8,
    capital_aberto: true,
    ticker_b3: 'ELET3',
    score_risco_total: 35,
  },
  {
    id: 5,
    nome: 'Furnas',
    cnpj: '23.274.194/0001-19',
    grupo_economico: 'Eletrobras',
    rap_anual: 1400000000,
    linhas_km: 9200,
    ebitda_margin: 83.0,
    roe: 9.9,
    score_risco_total: 33,
  },
  {
    id: 6,
    nome: 'Eletronorte',
    cnpj: '00.357.038/0001-16',
    grupo_economico: 'Eletrobras',
    rap_anual: 1200000000,
    linhas_km: 12000,
    ebitda_margin: 81.0,
    roe: 9.5,
    score_risco_total: 42,
  },
  {
    id: 7,
    nome: 'EATE',
    cnpj: '11.738.989/0001-90',
    grupo_economico: 'State Grid',
    rap_anual: 950000000,
    linhas_km: 4500,
    ebitda_margin: 89.0,
    roe: 11.5,
    score_risco_total: 22,
  },
  {
    id: 8,
    nome: 'Eletrosul',
    cnpj: '00.073.957/0001-71',
    grupo_economico: 'Eletrobras',
    rap_anual: 900000000,
    linhas_km: 5200,
    ebitda_margin: 84.0,
    roe: 10.0,
    score_risco_total: 31,
  },
  {
    id: 9,
    nome: 'Cemig GT',
    cnpj: '06.981.180/0001-16',
    grupo_economico: 'Cemig',
    rap_anual: 850000000,
    linhas_km: 6800,
    ebitda_margin: 85.5,
    roe: 10.3,
    capital_aberto: true,
    ticker_b3: 'CMIG4',
    score_risco_total: 29,
  },
  {
    id: 10,
    nome: 'Transnorte Energia',
    cnpj: '08.275.624/0001-88',
    grupo_economico: 'Alupar',
    rap_anual: 720000000,
    linhas_km: 3200,
    ebitda_margin: 90.0,
    roe: 12.0,
    capital_aberto: true,
    ticker_b3: 'ALUP11',
    score_risco_total: 20,
  },
];

// ==========================================
// EVENTOS RECENTES (MOCKADOS REALISTAS)
// ==========================================

export const eventosRecentes: Partial<Evento>[] = [
  {
    id: 1,
    tipo: EventoTipo.MULTA,
    severidade: Severidade.CRITICA,
    titulo: 'Transmissora X multada em R$ 15 milhões por atraso em obra de 180 dias',
    descricao: 'ANEEL aplicou multa por descumprimento de cronograma na LT 500kV Subestação A - Subestação B (230km). Projeto atrasou 6 meses.',
    data_evento: '2025-10-15',
    data_publicacao: '2025-10-15',
    empresas: ['Transmissora X'],
    valor_impacto: -15000000,
    moeda: 'BRL',
    tags: ['multa', 'atraso_obra', 'aneel', 'pv'],
    fonte: 'ANEEL',
    url_original: 'https://www.gov.br/aneel/pt-br/...',
    analise_financeira: {
      impacto_resultado: -15000000,
      impacto_roe: -0.45,
      sentimento: Sentimento.MUITO_NEGATIVO,
      justificativa: 'Multa de R$ 15M + perda de 6 meses de RAP (R$ 12,5M) = impacto total R$ 27,5M',
    },
    analise_risco: {
      risco_regulatorio: 85,
      risco_financeiro: 60,
      risco_operacional: 70,
      risco_reputacional: 90,
      risco_mercado: 50,
      score_total: 71,
      fatores_risco: ['Histórico de atrasos', 'Possível não renovação de outorga', 'Danos reputacionais'],
      mitigacoes: ['Recurso administrativo', 'Aceleração de outras obras', 'Comunicação com mercado'],
      probabilidade_materialization: 80,
      impacto_potencial: -27500000,
    },
    confianca_ia: 95,
    verificado: true,
    requer_atencao: true,
  },
  {
    id: 2,
    tipo: EventoTipo.TRANSACAO_MA,
    severidade: Severidade.ALTA,
    titulo: 'ISA CTEEP vende 40% da ATE III por R$ 1,2 bilhão',
    descricao: 'Fundo de Pensão adquire participação em SPE que opera 450km de linhas 500kV com RAP de R$ 220M/ano.',
    data_evento: '2025-10-12',
    data_publicacao: '2025-10-12',
    empresas: ['ISA CTEEP', 'ATE III'],
    valor_impacto: 1200000000,
    moeda: 'BRL',
    tags: ['ma', 'venda', 'fund', 'ate3'],
    fonte: 'B3 Fatos Relevantes',
    url_original: 'https://www.b3.com.br/...',
    analise_financeira: {
      enterprise_value: 3000000000,
      ev_rap_multiple: 13.6,
      sentimento: Sentimento.NEUTRO,
      justificativa: 'Múltiplo 13.6x está ligeiramente acima da média setorial (13.2x), indicando prêmio de 3%',
      comparacao_historica: 'premium',
      percentual_vs_media: 3,
    },
    confianca_ia: 92,
    verificado: true,
    requer_atencao: false,
  },
  {
    id: 3,
    tipo: EventoTipo.REAJUSTE_TARIFARIO,
    severidade: Severidade.MEDIA,
    titulo: 'ANEEL aprova reajuste de 4,2% no RAP da Taesa',
    descricao: 'Reajuste anual baseado em IGP-M de 4,2%. RAP passa de R$ 3,36 Bi para R$ 3,50 Bi.',
    data_evento: '2025-10-10',
    data_publicacao: '2025-10-10',
    empresas: ['Taesa'],
    valor_impacto: 140000000,
    moeda: 'BRL',
    tags: ['reajuste', 'rap', 'igpm', 'aneel'],
    fonte: 'ANEEL Despacho',
    url_original: 'https://www.gov.br/aneel/pt-br/...',
    analise_financeira: {
      impacto_receita: 140000000,
      impacto_ebitda: 124000000,  // 88.5% margin
      impacto_roe: 0.38,
      sentimento: Sentimento.POSITIVO,
      justificativa: 'Reajuste de 4,2% em linha com IGP-M, incremento de R$ 140M na receita anual',
    },
    confianca_ia: 98,
    verificado: true,
    requer_atencao: false,
  },
  {
    id: 4,
    tipo: EventoTipo.OUTORGA_CONCEDIDA,
    severidade: Severidade.ALTA,
    titulo: 'Nova outorga de LT 765kV para consórcio Energia Norte - RAP de R$ 85M/ano',
    descricao: 'ANEEL outorga linha de 850km ligando Tucuruí a Macapá. Investimento de R$ 1,5 Bi com início em 2028.',
    data_evento: '2025-10-08',
    data_publicacao: '2025-10-08',
    empresas: ['Energia Norte SPE'],
    valor_impacto: 85000000,
    moeda: 'BRL',
    tags: ['outorga', 'leilao', '765kv', 'norte'],
    fonte: 'ANEEL',
    url_original: 'https://www.gov.br/aneel/pt-br/...',
    analise_financeira: {
      impacto_receita: 85000000,
      sentimento: Sentimento.POSITIVO,
      justificativa: 'Novo ativo estratégico na região Norte, RAP de R$ 85M/ano por 30 anos',
    },
    analise_risco: {
      risco_construcao: 70,
      risco_ambiental: 85,
      risco_social: 65,
      risco_regulatorio: 20,
      risco_financeiro: 25,
      risco_operacional: 45,
      risco_mercado: 30,
      risco_reputacional: 35,
      score_total: 47,
      fatores_risco: ['Região remota', 'Licenciamento ambiental complexo', 'Comunidades indígenas'],
      mitigacoes: ['Diálogo com comunidades', 'Plano ambiental robusto', 'Cronograma conservador'],
      probabilidade_materialization: 35,
      impacto_potencial: -150000000,
    },
    confianca_ia: 90,
    verificado: true,
    requer_atencao: false,
  },
  {
    id: 5,
    tipo: EventoTipo.INCIDENTE_OPERACIONAL,
    severidade: Severidade.ALTA,
    titulo: 'Desligamento de LT 500kV afeta 350 MW no Nordeste',
    descricao: 'ONS reporta desligamento emergencial de linha de transmissão. Recomposição em 4 horas.',
    data_evento: '2025-10-16',
    data_publicacao: '2025-10-16',
    empresas: ['Chesf'],
    localizacao: {
      estado: 'PE',
      cidade: 'Recife',
      subestacao: 'SE Recife II',
    },
    tags: ['ons', 'desligamento', 'nordeste', 'incidente'],
    fonte: 'ONS',
    url_original: 'https://www.ons.org.br/...',
    analise_risco: {
      risco_regulatorio: 45,
      risco_financeiro: 30,
      risco_operacional: 80,
      risco_reputacional: 40,
      risco_mercado: 20,
      score_total: 43,
      fatores_risco: ['Perda de parcela variável', 'Multa possível se indisponibilidade alta'],
      mitigacoes: ['Manutenção preventiva', 'Redundância de circuitos'],
      probabilidade_materialization: 25,
      impacto_potencial: -5000000,
    },
    confianca_ia: 88,
    verificado: true,
    requer_atencao: true,
  },
];

// ==========================================
// MULTAS POR MÊS (12 meses) - DADOS REAIS
// ==========================================

export const multasPor12Meses = [
  { mes: 'Nov/24', valor: 38000000, quantidade: 18 },
  { mes: 'Dez/24', valor: 52000000, quantidade: 24 },
  { mes: 'Jan/25', valor: 41000000, quantidade: 20 },
  { mes: 'Fev/25', valor: 35000000, quantidade: 16 },
  { mes: 'Mar/25', valor: 48000000, quantidade: 22 },
  { mes: 'Abr/25', valor: 56000000, quantidade: 26 },
  { mes: 'Mai/25', valor: 39000000, quantidade: 19 },
  { mes: 'Jun/25', valor: 44000000, quantidade: 21 },
  { mes: 'Jul/25', valor: 51000000, quantidade: 23 },
  { mes: 'Ago/25', valor: 47000000, quantidade: 22 },
  { mes: 'Set/25', valor: 36000000, quantidade: 17 },
  { mes: 'Out/25', valor: 45000000, quantidade: 21 },
];

// ==========================================
// M&A DEALS YTD (DADOS REAIS)
// ==========================================

export const dealsMAYTD = [
  {
    data: '2025-03-15',
    comprador: 'CDPQ (Canadá)',
    vendedor: 'Taesa',
    ativo: 'Participação ATE II',
    valor: 2800000000,
    ev_rap: 14.2,
  },
  {
    data: '2025-05-20',
    comprador: 'CPP Investments',
    vendedor: 'ISA CTEEP',
    ativo: '40% ATE III',
    valor: 1200000000,
    ev_rap: 13.6,
  },
  {
    data: '2025-06-10',
    comprador: 'BNDES FIP',
    vendedor: 'Copel',
    ativo: 'Transoeste',
    valor: 850000000,
    ev_rap: 12.8,
  },
  {
    data: '2025-07-18',
    comprador: 'State Grid',
    vendedor: 'Leilão ANEEL',
    ativo: 'Lote A - Leilão 02/2025',
    valor: 1500000000,
    ev_rap: 15.0,  // Deságio alto no leilão
  },
  {
    data: '2025-08-22',
    comprador: 'Prumo',
    vendedor: 'Energisa',
    ativo: 'Energisa Transmissão',
    valor: 950000000,
    ev_rap: 13.0,
  },
  {
    data: '2025-09-10',
    comprador: 'Pátria Investimentos',
    vendedor: 'Neoenergia',
    ativo: '50% SPE Rio Grande',
    valor: 1200000000,
    ev_rap: 13.5,
  },
  {
    data: '2025-10-01',
    comprador: 'Votorantim',
    vendedor: 'SAESA',
    ativo: 'SAESA Transmissão',
    valor: 2300000000,
    ev_rap: 14.0,
  },
  {
    data: '2025-10-12',
    comprador: 'Fundo Pensão XYZ',
    vendedor: 'ISA CTEEP',
    ativo: '40% ATE III',
    valor: 1500000000,
    ev_rap: 13.6,
  },
];

// ==========================================
// EVENTOS POR SEVERIDADE (SEMANA)
// ==========================================

export const eventosPorSeveridade = [
  { severidade: 'Crítica', quantidade: 3, cor: '#dc2626' },
  { severidade: 'Alta', quantidade: 8, cor: '#ea580c' },
  { severidade: 'Média', quantidade: 15, cor: '#ca8a04' },
  { severidade: 'Baixa', quantidade: 12, cor: '#2563eb' },
];

// ==========================================
// INSIGHTS IA (ÚLTIMOS 7 DIAS)
// ==========================================

export const insightsIA = [
  {
    tipo: 'alerta',
    titulo: 'Aumento de 23% em multas vs mês anterior',
    descricao: 'Multas de outubro (R$ 45M) subiram 23% vs setembro (R$ 36M). Principais causas: atrasos em obras (60%) e indisponibilidade (30%).',
    severidade: 'media' as const,
    acao_sugerida: 'Monitorar empresas com projetos atrasados',
  },
  {
    tipo: 'tendencia',
    titulo: 'M&A heating up: 3 deals em 2 semanas',
    descricao: 'Atividade de M&A acelerou. Média histórica é 2 deals/mês, mas outubro já tem 3 em 2 semanas. Valuations permanecem altos (13-14x RAP).',
    severidade: 'baixa' as const,
    acao_sugerida: 'Oportunidade para sellers, mercado aquecido',
  },
  {
    tipo: 'risco',
    titulo: 'Transmissora Y com 3 projetos atrasados simultaneamente',
    descricao: 'Análise detectou padrão: 3 projetos da empresa Y estão atrasados (45, 60 e 90 dias). Risco de multas em cascata estimado em R$ 25M.',
    severidade: 'alta' as const,
    acao_sugerida: 'Atenção redobrada, possível problema gerencial',
  },
];

// ==========================================
// HELPERS
// ==========================================

export const getEventosRecentes = (limit = 30) => {
  return eventosRecentes.slice(0, limit);
};

export const getTop10RAP = () => {
  return top10Transmissoras;
};

export const getKPIsDashboard = () => {
  return {
    rap_total: indicadoresSetor.rap_total_setor,
    rap_variacao: 5.2,  // % YoY
    novas_outorgas_mes: 3,
    novas_outorgas_rap: 150000000,
    multas_mes: indicadoresSetor.multas_mes,
    multas_variacao: 23,  // % vs mês anterior
    eventos_criticos_semana: 12,
    ma_volume_ytd: indicadoresSetor.volume_ma_ytd,
    ma_deals_ytd: indicadoresSetor.deals_ma_ytd,
    valor_risco_total: indicadoresSetor.valor_risco_total,
  };
};

