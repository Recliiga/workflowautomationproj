
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator or skeleton while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but accessing the dashboard or root,
  // redirect them to their role-specific page
  if (location.pathname === "/dashboard" || location.pathname === "/") {
    if (user.role === "client") {
      return <Navigate to="/client" replace />;
    }
    if (user.role === "freelancer") {
      return <Navigate to="/freelancer" replace />;
    }
    // Admin stays on dashboard
  }

  // User is authenticated, render children
  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
