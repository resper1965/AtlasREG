import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Obter webhook secret do Clerk Dashboard
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET não configurado')
  }

  // Obter headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', {
      status: 400,
    })
  }

  // Obter body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Criar instância Svix
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verificar signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Erro verificando webhook:', err)
    return new Response('Invalid signature', {
      status: 400,
    })
  }

  // Processar eventos
  const eventType = evt.type

  console.log(`Webhook recebido: ${eventType}`)

  try {
    switch (eventType) {
      case 'user.created':
        // Criar usuário no banco de dados AtlasReg
        await handleUserCreated(evt.data)
        break

      case 'user.updated':
        // Atualizar dados do usuário
        await handleUserUpdated(evt.data)
        break

      case 'user.deleted':
        // Soft delete ou remover dados
        await handleUserDeleted(evt.data)
        break

      case 'organization.created':
        // Setup inicial da organização
        await handleOrganizationCreated(evt.data)
        break

      case 'organization.updated':
        // Atualizar organização
        await handleOrganizationUpdated(evt.data)
        break

      case 'organization.deleted':
        // Arquivar ou remover dados da org
        await handleOrganizationDeleted(evt.data)
        break

      case 'organizationMembership.created':
        // Usuário adicionado a org
        await handleMembershipCreated(evt.data)
        break

      case 'organizationMembership.deleted':
        // Usuário removido de org
        await handleMembershipDeleted(evt.data)
        break

      case 'session.created':
        // Log de login para auditoria
        await handleSessionCreated(evt.data)
        break

      default:
        console.log(`Evento não tratado: ${eventType}`)
    }

    return NextResponse.json({ success: true, eventType })
  } catch (error) {
    console.error(`Erro processando webhook ${eventType}:`, error)
    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    )
  }
}

// Handlers para cada tipo de evento
async function handleUserCreated(data: any) {
  console.log('Novo usuário criado:', data.id)
  
  // TODO: Criar usuário no PostgreSQL
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     clerk_id: data.id,
  //     email: data.email_addresses[0]?.email_address,
  //     first_name: data.first_name,
  //     last_name: data.last_name,
  //   }),
  // })
}

async function handleUserUpdated(data: any) {
  console.log('Usuário atualizado:', data.id)
  // TODO: Atualizar no PostgreSQL
}

async function handleUserDeleted(data: any) {
  console.log('Usuário deletado:', data.id)
  // TODO: Soft delete no PostgreSQL
}

async function handleOrganizationCreated(data: any) {
  console.log('Nova organização criada:', data.id)
  
  // TODO: Setup inicial da organização
  // - Criar watchlists padrão
  // - Criar filtros iniciais
  // - Configurar preferências
}

async function handleOrganizationUpdated(data: any) {
  console.log('Organização atualizada:', data.id)
}

async function handleOrganizationDeleted(data: any) {
  console.log('Organização deletada:', data.id)
  // TODO: Arquivar dados
}

async function handleMembershipCreated(data: any) {
  console.log('Membro adicionado:', data)
  // TODO: Dar acesso aos dados da org
}

async function handleMembershipDeleted(data: any) {
  console.log('Membro removido:', data)
  // TODO: Remover acesso
}

async function handleSessionCreated(data: any) {
  console.log('Nova sessão:', data.id)
  
  // TODO: Log de auditoria
  // - IP address
  // - User agent
  // - Timestamp
  // - User ID
  // - Org ID
}

