/**
 * Usuário Padrão - AtlasReg by ness.
 */

export const usuarioPadrao = {
  id: 1,
  nome: 'Ricardo Esper',
  email: 'resper@ness.com.br',
  role: 'admin',
  empresa: 'ness.',
  cargo: 'CEO',
  avatar: '/avatars/ricardo-esper.jpg',
  preferencias: {
    tema: 'dark',
    idioma: 'pt-BR',
    notificacoes_email: true,
    notificacoes_inapp: true,
    digest_frequencia: 'daily',
  },
  watchlists: [
    {
      id: 1,
      nome: 'Principais Transmissoras',
      empresas: ['Taesa', 'ISA CTEEP', 'Copel'],
    },
    {
      id: 2,
      nome: 'M&A em Andamento',
      keywords: ['fusão', 'aquisição', 'venda'],
    },
  ],
  criado_em: '2025-01-15',
};

