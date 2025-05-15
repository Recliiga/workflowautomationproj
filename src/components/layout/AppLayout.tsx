
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { User } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client" | "freelancer" | Array<"admin" | "client" | "freelancer">;
}

export function AppLayout({ children, requiredRole }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Check authentication and authorization
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login
        console.log("No user found, redirecting to login");
        navigate("/login");
        return;
      }

      if (requiredRole) {
        // Check if user has required role
        const hasRequiredRole = Array.isArray(requiredRole)
          ? requiredRole.includes(user.role)
          : user.role === requiredRole;

        if (!hasRequiredRole) {
          console.log(`User role ${user.role} doesn't have permission for this page`);
          // Not authorized, redirect to dashboard
          navigate("/dashboard");
          return;
        }
      }

      setAuthorized(true);
    }
  }, [user, isLoading, navigate, requiredRole]);

  // Add an additional check to detect if user gets cleared unexpectedly
  useEffect(() => {
    // Only run this effect if we were previously authorized
    if (authorized && !user && !isLoading) {
      console.log("User session lost, redirecting to login");
      navigate("/login");
    }
  }, [user, authorized, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="container py-6 md:py-8">
            <div className="mb-6">
              <SidebarTrigger className="md:hidden mb-4" />
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
