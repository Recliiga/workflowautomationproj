
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
          <div className="container py-6 md:py-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <SidebarTrigger className="md:hidden" />
                <RoleSwitcher />
              </div>
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
