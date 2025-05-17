
import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client" | "freelancer" | Array<"admin" | "client" | "freelancer">;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <AppHeader />
      <main className="flex-1">
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
  );
}
