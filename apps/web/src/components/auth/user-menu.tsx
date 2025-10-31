'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { logger } from '@/lib/logger'

/**
 * Menu de usuário com dropdown
 * Exibe avatar, nome e opções de perfil/logout
 *
 * @example
 * <UserMenu />
 */
export function UserMenu() {
  const { user, profile } = useUser()
  const router = useRouter()

  if (!user) return null

  const handleLogout = async () => {
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      logger.info('User logged out', { userId: user.id })
      router.push('/login')
    } catch (error) {
      logger.error('Logout error', { error })
    }
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-8">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user.email || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'Sem nome'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 size-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/configuracoes')}
        >
          <Settings className="mr-2 size-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
