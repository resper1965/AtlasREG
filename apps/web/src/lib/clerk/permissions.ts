/**
 * AtlasReg - Sistema de Permissões RBAC
 * Powered by: ness.
 */

// Definição de todas as permissões do sistema
export const PERMISSIONS = {
  // Eventos
  EVENTS_READ: 'org:events:read',
  EVENTS_CREATE: 'org:events:create',
  EVENTS_UPDATE: 'org:events:update',
  EVENTS_DELETE: 'org:events:delete',
  EVENTS_EXPORT: 'org:events:export',

  // Dashboards
  DASHBOARDS_VIEW_ALL: 'org:dashboards:view_all',
  DASHBOARDS_VIEW_BASIC: 'org:dashboards:view_basic',
  DASHBOARDS_CREATE: 'org:dashboards:create',
  DASHBOARDS_SHARE: 'org:dashboards:share',

  // Watchlists
  WATCHLISTS_READ: 'org:watchlists:read',
  WATCHLISTS_CREATE: 'org:watchlists:create',
  WATCHLISTS_UPDATE: 'org:watchlists:update',
  WATCHLISTS_DELETE: 'org:watchlists:delete',

  // Configurações
  CONFIG_READ: 'org:config:read',
  CONFIG_MANAGE: 'org:config:manage',
  CONFIG_SOURCES: 'org:config:sources',

  // Usuários
  USERS_READ: 'org:users:read',
  USERS_INVITE: 'org:users:invite',
  USERS_MANAGE: 'org:users:manage',
  USERS_REMOVE: 'org:users:remove',

  // Exportações
  EXPORTS_CREATE: 'org:exports:create',
  EXPORTS_UNLIMITED: 'org:exports:unlimited',
  EXPORTS_API_ACCESS: 'org:exports:api_access',

  // Analytics
  ANALYTICS_VIEW: 'org:analytics:view',
  ANALYTICS_ADVANCED: 'org:analytics:advanced',

  // Auditoria
  AUDIT_VIEW: 'org:audit:view',
  AUDIT_EXPORT: 'org:audit:export',
} as const

// Definição de roles e suas permissões
export const ROLES = {
  ADMIN: {
    name: 'org:admin',
    description: 'Administrador com acesso total',
    permissions: [
      PERMISSIONS.EVENTS_READ,
      PERMISSIONS.EVENTS_CREATE,
      PERMISSIONS.EVENTS_UPDATE,
      PERMISSIONS.EVENTS_DELETE,
      PERMISSIONS.EVENTS_EXPORT,
      PERMISSIONS.DASHBOARDS_VIEW_ALL,
      PERMISSIONS.DASHBOARDS_CREATE,
      PERMISSIONS.DASHBOARDS_SHARE,
      PERMISSIONS.WATCHLISTS_READ,
      PERMISSIONS.WATCHLISTS_CREATE,
      PERMISSIONS.WATCHLISTS_UPDATE,
      PERMISSIONS.WATCHLISTS_DELETE,
      PERMISSIONS.CONFIG_READ,
      PERMISSIONS.CONFIG_MANAGE,
      PERMISSIONS.CONFIG_SOURCES,
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_INVITE,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.USERS_REMOVE,
      PERMISSIONS.EXPORTS_CREATE,
      PERMISSIONS.EXPORTS_UNLIMITED,
      PERMISSIONS.EXPORTS_API_ACCESS,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.ANALYTICS_ADVANCED,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.AUDIT_EXPORT,
    ],
  },
  
  ANALYST: {
    name: 'org:analyst',
    description: 'Analista com acesso a dados e dashboards',
    permissions: [
      PERMISSIONS.EVENTS_READ,
      PERMISSIONS.EVENTS_EXPORT,
      PERMISSIONS.DASHBOARDS_VIEW_ALL,
      PERMISSIONS.DASHBOARDS_CREATE,
      PERMISSIONS.WATCHLISTS_READ,
      PERMISSIONS.WATCHLISTS_CREATE,
      PERMISSIONS.WATCHLISTS_UPDATE,
      PERMISSIONS.CONFIG_READ,
      PERMISSIONS.EXPORTS_CREATE,
      PERMISSIONS.ANALYTICS_VIEW,
    ],
  },
  
  MEMBER: {
    name: 'org:member',
    description: 'Membro com acesso básico',
    permissions: [
      PERMISSIONS.EVENTS_READ,
      PERMISSIONS.DASHBOARDS_VIEW_BASIC,
      PERMISSIONS.WATCHLISTS_READ,
      PERMISSIONS.WATCHLISTS_CREATE,
      PERMISSIONS.CONFIG_READ,
      PERMISSIONS.ANALYTICS_VIEW,
    ],
  },
  
  VIEWER: {
    name: 'org:viewer',
    description: 'Visualizador apenas leitura',
    permissions: [
      PERMISSIONS.EVENTS_READ,
      PERMISSIONS.DASHBOARDS_VIEW_BASIC,
      PERMISSIONS.WATCHLISTS_READ,
    ],
  },

  EXTERNAL: {
    name: 'org:external',
    description: 'Usuário externo com acesso limitado',
    permissions: [
      PERMISSIONS.EVENTS_READ,
      PERMISSIONS.DASHBOARDS_VIEW_BASIC,
    ],
  },
} as const

// Helper para verificar permissões
export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required)
}

// Helper para verificar role
export function hasRole(userRole: string, requiredRole: keyof typeof ROLES): boolean {
  return userRole === ROLES[requiredRole].name
}

