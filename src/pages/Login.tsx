
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/LoginForm";
import { PasswordResetDialog } from "@/components/auth/PasswordResetDialog";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      // Redirect based on user role
      let destination = "/dashboard"; // default for admin
      
      if (user.role === "client") {
        destination = "/client";
      } else if (user.role === "freelancer") {
        destination = "/freelancer";
      }
      
      console.log(`User authenticated as ${user.role}, redirecting to:`, destination);
      navigate(destination, { replace: true });
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      // No specific cleanup needed, but including for completeness
    };
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string) => {
    if (isLoading || authLoading) return; // Prevent multiple login attempts
    
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Check if this is the user's first login (generic password)
      const isFirstTimeUser = password === "password" || password === "changeme" || password === "temp123";
      
      if (isFirstTimeUser) {
        console.log("First time user detected, redirecting to password change");
        navigate("/change-password", { replace: true });
      } else {
        // The redirect will happen in the useEffect when user state updates
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, return null (will be redirected by useEffect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/10 to-background p-4">
      <div className="w-full max-w-md mx-auto">
        <LoginForm 
          onSubmit={handleLogin} 
          isLoading={isLoading || authLoading} 
          onForgotPassword={() => setIsPasswordReset(true)} 
        />
      </div>
      
      <PasswordResetDialog 
        isOpen={isPasswordReset} 
        onOpenChange={setIsPasswordReset} 
      />
    </div>
  );
}
