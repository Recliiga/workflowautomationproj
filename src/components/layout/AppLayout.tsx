
import React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client" | "freelancer" | Array<"admin" | "client" | "freelancer">;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-full">
            <div className="container py-6 md:py-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Breadcrumbs />
                  <RoleSwitcher />
                </div>
                <div className="flex-1">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}
