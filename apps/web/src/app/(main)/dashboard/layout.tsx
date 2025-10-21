import { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ClerkHeader } from "@/components/auth/clerk-header";
import { Sidebar } from "@/components/sidebar/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Verificar autenticação
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Obter dados do usuário para logging/audit
  const user = await currentUser();

  return (
    <div className="flex h-screen flex-col">
      {/* Header com Clerk */}
      <ClerkHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
