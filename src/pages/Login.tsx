
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileVideo } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 to-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="bg-accent p-3 rounded-full">
              <FileVideo className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">VideoFlow</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        
        <div className="mt-6 text-sm text-center text-muted-foreground">
          <p>Demo Accounts:</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEmail("admin@videoflow.com");
                setPassword("password");
              }}
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEmail("client@company.com");
                setPassword("password");
              }}
            >
              Client
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEmail("freelancer@creator.com");
                setPassword("password");
              }}
            >
              Freelancer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
