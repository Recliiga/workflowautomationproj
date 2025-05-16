
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
      <div className="w-full max-w-4xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* App branding and info section */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="bg-accent p-4 rounded-full">
              <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">VideoFlow</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Streamline your video production workflow
          </p>
          <p className="text-muted-foreground hidden md:block">
            Manage, collaborate, and deliver high-quality video content with our comprehensive platform.
          </p>
        </div>
        
        {/* Login form section */}
        <div className="w-full md:w-1/2">
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            onForgotPassword={() => setIsPasswordReset(true)} 
          />
        </div>
      </div>
      
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
