import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  AlertTriangle,
  Activity,
  FileText,
  Zap,
  DollarSign,
  Scale,
  TrendingDown,
  Search,
  Bell,
  Star,
  Filter,
  Settings,
  Building,
  Factory,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Visão Global",
    items: [
      {
        title: "Painel Executivo",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Feed de Eventos",
        url: "/dashboard/eventos",
        icon: Activity,
        isNew: true,
      },
      {
        title: "Busca Avançada",
        url: "/dashboard/busca",
        icon: Search,
      },
    ],
  },
  {
    id: 2,
    label: "Análises por Tema",
    items: [
      {
        title: "Regulatório",
        url: "/dashboard/regulatorio",
        icon: Scale,
        subItems: [
          { title: "Decisões ANEEL", url: "/dashboard/regulatorio/decisoes" },
          { title: "Multas e PVs", url: "/dashboard/regulatorio/multas" },
          { title: "Outorgas", url: "/dashboard/regulatorio/outorgas" },
          { title: "Reajustes Tarifários", url: "/dashboard/regulatorio/reajustes" },
        ],
      },
      {
        title: "Financeiro",
        url: "/dashboard/financeiro",
        icon: DollarSign,
        subItems: [
          { title: "RAP por Empresa", url: "/dashboard/financeiro/rap" },
          { title: "Análise de Valuation", url: "/dashboard/financeiro/valuation" },
          { title: "M&A e Transações", url: "/dashboard/financeiro/ma" },
          { title: "Indicadores Setoriais", url: "/dashboard/financeiro/indicadores" },
        ],
      },
      {
        title: "Contábil",
        url: "/dashboard/contabil",
        icon: FileText,
        subItems: [
          { title: "EBITDA por Empresa", url: "/dashboard/contabil/ebitda" },
          { title: "ROE e Rentabilidade", url: "/dashboard/contabil/roe" },
          { title: "Alavancagem", url: "/dashboard/contabil/alavancagem" },
          { title: "Ratings de Crédito", url: "/dashboard/contabil/rating" },
        ],
      },
      {
        title: "Risco",
        url: "/dashboard/risco",
        icon: AlertTriangle,
        subItems: [
          { title: "Score de Risco", url: "/dashboard/risco/score" },
          { title: "Projetos em Atraso", url: "/dashboard/risco/projetos" },
          { title: "Vencimento Outorgas", url: "/dashboard/risco/vencimentos" },
          { title: "Matriz de Risco", url: "/dashboard/risco/matriz" },
        ],
      },
      {
        title: "Operacional",
        url: "/dashboard/operacional",
        icon: Zap,
        subItems: [
          { title: "Ocorrências ONS", url: "/dashboard/operacional/ocorrencias" },
          { title: "Disponibilidade", url: "/dashboard/operacional/disponibilidade" },
          { title: "Mapa da Rede", url: "/dashboard/operacional/mapa" },
          { title: "Performance", url: "/dashboard/operacional/performance" },
        ],
      },
      {
        title: "Mercado",
        url: "/dashboard/mercado",
        icon: TrendingUp,
        subItems: [
          { title: "Leilões", url: "/dashboard/mercado/leiloes" },
          { title: "Consolidação", url: "/dashboard/mercado/consolidacao" },
          { title: "Índices (IGP-M, WACC)", url: "/dashboard/mercado/indices" },
          { title: "Tendências", url: "/dashboard/mercado/tendencias" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Empresas",
    items: [
      {
        title: "Todas as Transmissoras",
        url: "/dashboard/empresas",
        icon: Building2,
      },
      {
        title: "Top 10 por RAP",
        url: "/dashboard/empresas/top-rap",
        icon: TrendingUp,
      },
      {
        title: "Grupos Econômicos",
        url: "/dashboard/empresas/grupos",
        icon: Building,
      },
      {
        title: "Empresas em Risco",
        url: "/dashboard/empresas/risco",
        icon: TrendingDown,
      },
    ],
  },
  {
    id: 4,
    label: "Ferramentas",
    items: [
      {
        title: "Minhas Watchlists",
        url: "/dashboard/watchlists",
        icon: Star,
      },
      {
        title: "Alertas Configurados",
        url: "/dashboard/alertas",
        icon: Bell,
      },
      {
        title: "Filtros Salvos",
        url: "/dashboard/filtros",
        icon: Filter,
      },
      {
        title: "Configurações",
        url: "/dashboard/configuracoes",
        icon: Settings,
      },
    ],
  },
];
