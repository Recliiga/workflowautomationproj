
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
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
  
  // We don't need to track the last check timestamp here - that's handled in AuthContext

  // Check authentication and authorization when user or page changes
  useEffect(() => {
    // Don't make decisions until we know if there's a user or not
    if (isLoading) {
      return;
    }

    // User is not logged in
    if (!user) {
      console.log("AppLayout: No authenticated user, redirecting to login");
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }
    
    // Check role-based access if needed
    if (requiredRole) {
      const hasRequiredRole = Array.isArray(requiredRole)
        ? requiredRole.includes(user.role)
        : user.role === requiredRole;

      if (!hasRequiredRole) {
        console.log(`AppLayout: User role ${user.role} doesn't have permission for this page`);
        toast.error("You don't have permission to access this page");
        navigate("/dashboard", { replace: true });
        return;
      }
    }
    
    // User is authenticated and has the right role
    console.log("AppLayout: User is authorized to view this page");
    setAuthorized(true);
  }, [user, isLoading, navigate, requiredRole, location.pathname]);

  // Separate effect to monitor for unexpected auth state changes
  // This is separate from the first check to prevent race conditions
  useEffect(() => {
    if (!authorized) return;
    
    // Only check for sudden user loss, not session expiration
    // Session expiration is handled in the AuthContext
    const checkInterval = setInterval(() => {
      if (!isLoading && !user && authorized) {
        // User was previously authorized but is now gone
        console.log("AppLayout: User session unexpectedly lost");
        toast.error("Your session has been lost. Please log in again.");
        navigate("/login", { replace: true });
        clearInterval(checkInterval);
      }
    }, 30000); // Check less frequently (30 seconds) to reduce overhead
    
    return () => clearInterval(checkInterval);
  }, [authorized, user, isLoading, navigate]);

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
