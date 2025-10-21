import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

/**
 * Helper para obter usuário autenticado ou redirecionar
 */
export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return userId
}

/**
 * Helper para obter organização ativa ou redirecionar
 */
export async function requireOrganization() {
  const { userId, orgId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  if (!orgId) {
    redirect('/dashboard/organizations')
  }
  
  return orgId
}

/**
 * Helper para verificar permissão ou lançar erro
 */
export async function requirePermission(permission: string) {
  const { has } = await auth()
  
  if (!has({ permission })) {
    redirect('/unauthorized')
  }
}

/**
 * Helper para verificar role ou lançar erro
 */
export async function requireRole(role: string) {
  const { has } = await auth()
  
  if (!has({ role })) {
    redirect('/unauthorized')
  }
}

/**
 * Obter dados completos do usuário com org info
 */
export async function getUserWithOrg() {
  const user = await currentUser()
  const { orgId, orgRole, orgSlug } = await auth()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    orgId,
    orgRole,
    orgSlug,
    metadata: user.publicMetadata,
  }
}

/**
 * Verificar se usuário tem permissão (retorna boolean)
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const { has } = await auth()
  return has({ permission })
}

/**
 * Verificar se usuário tem role (retorna boolean)
 */
export async function checkRole(role: string): Promise<boolean> {
  const { has } = await auth()
  return has({ role })
}

/**
 * Obter lista de permissões do usuário
 */
export async function getUserPermissions() {
  const { orgPermissions } = await auth()
  return orgPermissions || []
}

/**
 * Log de auditoria
 */
export async function logAudit(action: string, details?: any) {
  const user = await getUserWithOrg()
  
  if (!user) return
  
  const auditLog = {
    userId: user.id,
    userEmail: user.email,
    orgId: user.orgId,
    action,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '', // Obter do request
    userAgent: '', // Obter do request
  }
  
  console.log('Audit log:', auditLog)
  
  // TODO: Salvar no banco de dados
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(auditLog),
  // })
}

