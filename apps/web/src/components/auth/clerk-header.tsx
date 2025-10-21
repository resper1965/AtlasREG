"use client"

import { 
  UserButton, 
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useOrganization
} from '@clerk/nextjs'
import Link from 'next/link'

export function ClerkHeader() {
  const { user } = useUser()
  const { organization } = useOrganization()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo e Org Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard/default" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              Atlas<span className="text-[#00ADE8]">REG</span>
            </div>
          </Link>
          
          {/* Organization Switcher - Multitenancy */}
          <SignedIn>
            <OrganizationSwitcher
              hidePersonal={false}
              appearance={{
                elements: {
                  rootBox: "flex items-center",
                  organizationSwitcherTrigger: 
                    "px-3 py-2 border rounded-md hover:bg-accent transition-colors",
                  organizationSwitcherTriggerIcon: "text-[#00ADE8]",
                  organizationPreviewAvatarBox: "w-8 h-8",
                },
              }}
              createOrganizationMode="modal"
              afterCreateOrganizationUrl="/dashboard/default"
              afterSelectOrganizationUrl="/dashboard/default"
            />
          </SignedIn>
        </div>

        {/* User Info e Actions */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-[#00ADE8] hover:bg-[#008ec4] text-white rounded-md font-medium transition-colors">
                Entrar
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Info rápida */}
            <div className="hidden md:flex flex-col items-end text-sm">
              <span className="font-medium">{user?.firstName || user?.username}</span>
              {organization && (
                <span className="text-xs text-muted-foreground">
                  {organization.name}
                </span>
              )}
            </div>

            {/* User Button com menu */}
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 border-2 border-[#00ADE8]",
                  userButtonPopoverCard: "shadow-lg",
                  userButtonPopoverActionButton: "hover:bg-accent",
                },
              }}
              afterSignOutUrl="/"
              showName={false}
            >
              {/* Custom menu items */}
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Dashboard"
                  labelIcon={<span>📊</span>}
                  href="/dashboard/default"
                />
                <UserButton.Link
                  label="Configurações"
                  labelIcon={<span>⚙️</span>}
                  href="/dashboard/configuracoes"
                />
                <UserButton.Action label="Ajuda" labelIcon={<span>❓</span>} />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

