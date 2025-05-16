
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/LoginForm";
import { FirstLoginDialog } from "@/components/auth/FirstLoginDialog";
import { PasswordResetDialog } from "@/components/auth/PasswordResetDialog";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setCurrentEmail(email);

    try {
      await login(email, password);
      
      // Check if this is the user's first login (in a real app, this would come from the backend)
      const isFirstTimeUser = email.includes("new") || password === "changeme";
      
      if (isFirstTimeUser) {
        setFirstLogin(true);
      } else {
        // Redirect to the page the user was trying to access, or dashboard if none
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    try {
      // In a real app, this would send the password change request to an API
      console.log("Changing password for user:", currentEmail);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Password changed successfully");
      setFirstLogin(false);
      
      // Redirect to the page the user was trying to access, or dashboard if none
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      throw error; // Let the FirstLoginDialog component handle the error
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-background">
      <LoginForm 
        onSubmit={handleLogin} 
        isLoading={isLoading} 
        onForgotPassword={() => setIsPasswordReset(true)} 
      />
      
      <FirstLoginDialog 
        isOpen={firstLogin} 
        onPasswordChange={handlePasswordChange} 
        email={currentEmail} 
      />
      
      <PasswordResetDialog 
        isOpen={isPasswordReset} 
        onOpenChange={setIsPasswordReset} 
      />
    </div>
  );
}
