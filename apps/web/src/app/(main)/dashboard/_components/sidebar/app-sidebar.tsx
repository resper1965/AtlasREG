"use client";

import Link from "next/link";

import { Settings, CircleHelp, Search, Database, ClipboardList, File, Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard/default">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#00ADE8]">
                  <span className="text-white font-bold text-sm">n.</span>
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="text-sm font-medium">
                    <span className="text-foreground">ness</span>
                    <span className="text-[#00ADE8]">.</span>
                    <span className="text-muted-foreground ml-1 text-xs">AtlasReg</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">Inteligência de Mercado</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={rootUser} />
        <div className="px-3 py-2 text-center border-t border-border/40 mt-2" suppressHydrationWarning>
          <p className="text-[10px] text-muted-foreground/80">
            Desenvolvido por <span className="text-foreground">resper@ness.com.br</span>
          </p>
          <p className="text-[10px] text-muted-foreground">
            Powered by <span className="font-medium text-foreground">ness<span className="text-[#00ADE8]">.</span></span>
          </p>
          <p className="text-[9px] text-muted-foreground/60">© 2025 - Todos os direitos reservados</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
