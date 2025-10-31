'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserMenu } from '@/components/auth/user-menu'
import { useUser } from '@/hooks/use-user'
import { useOrganization } from '@/hooks/use-organization'

/**
 * Header do dashboard com logo, organization switcher e user menu
 * Substituição do ClerkHeader para Supabase
 *
 * @example
 * <DashboardHeader />
 */
export function DashboardHeader() {
  const { user, profile } = useUser()
  const { organizations, currentOrganization, switchOrganization } =
    useOrganization()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Organization Switcher */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/default"
            className="flex items-center gap-2"
          >
            <div className="text-2xl font-bold">
              Atlas<span className="text-[#00ADE8]">REG</span>
            </div>
          </Link>

          {/* Organization Switcher - Multitenancy */}
          {organizations.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <span className="text-sm font-medium">
                    {currentOrganization?.name || 'Selecione uma organização'}
                  </span>
                  <ChevronDown className="size-4 text-[#00ADE8]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Organizações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => switchOrganization(org.id)}
                    className={
                      currentOrganization?.id === org.id
                        ? 'bg-accent'
                        : ''
                    }
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{org.name}</span>
                      {org.slug && (
                        <span className="text-xs text-muted-foreground">
                          {org.slug}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* User Info e Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Info rápida - desktop only */}
              <div className="hidden md:flex flex-col items-end text-sm">
                <span className="font-medium">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                {currentOrganization && (
                  <span className="text-xs text-muted-foreground">
                    {currentOrganization.name}
                  </span>
                )}
              </div>

              {/* User Menu com dropdown */}
              <UserMenu />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
