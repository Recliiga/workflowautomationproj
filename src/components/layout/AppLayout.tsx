
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { User } from "@/types";
import { toast } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client" | "freelancer" | Array<"admin" | "client" | "freelancer">;
}

export function AppLayout({ children, requiredRole }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    // Check authentication and authorization
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to login
        console.log("No user found, redirecting to login");
        navigate("/login", { replace: true, state: { from: location.pathname } });
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
          toast.error("You don't have permission to access this page");
          navigate("/dashboard", { replace: true });
          return;
        }
      }

      setAuthorized(true);
      setLastCheckTimestamp(Date.now());
    }
  }, [user, isLoading, navigate, requiredRole, location.pathname]);

  // Set up a regular check to verify the user session is still valid
  useEffect(() => {
    if (!authorized) return;

    const checkInterval = setInterval(() => {
      // If user disappears unexpectedly, navigate back to login
      if (!isLoading && !user) {
        console.log("User session lost, redirecting to login");
        toast.error("Your session has expired. Please log in again.");
        navigate("/login", { replace: true });
        clearInterval(checkInterval);
      }
      
      setLastCheckTimestamp(Date.now());
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkInterval);
  }, [authorized, user, isLoading, navigate, lastCheckTimestamp]);

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
