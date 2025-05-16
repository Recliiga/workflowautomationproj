
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileVideo } from "lucide-react";
import { DemoAccountsSection } from "./DemoAccountsSection";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  onForgotPassword: () => void;
}

export function LoginForm({ onSubmit, isLoading, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleDemoAccountSelect = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="w-full p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center space-y-2 md:hidden">
        <div className="flex items-center justify-center">
          <div className="bg-accent p-3 rounded-full">
            <FileVideo className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">VideoFlow</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>

      <h2 className="text-2xl font-bold hidden md:block">Sign in</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
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
      
      <div className="pt-2 text-center">
        <Button variant="link" onClick={onForgotPassword}>
          Forgot password?
        </Button>
      </div>
      
      <DemoAccountsSection onSelectAccount={handleDemoAccountSelect} />
    </div>
  );
}
