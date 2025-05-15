
import React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client" | "freelancer" | Array<"admin" | "client" | "freelancer">;
}

export function AppLayout({ children }: AppLayoutProps) {
  // No auth checks - simply render the layout
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="border-b sticky top-0 bg-background z-10">
            <div className="container py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="font-semibold text-xl">Video Production</h1>
              </div>
              <RoleSwitcher />
            </div>
          </header>
          <div className="container py-6 md:py-8">
            <div className="mb-6">
              <Breadcrumbs className="mb-2" />
              <div className="flex-1">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
