
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordResetDialog({ isOpen, onOpenChange }: PasswordResetDialogProps) {
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would send a password reset email
      console.log("Password reset requested for:", passwordResetEmail);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("If an account exists with this email, a password reset link has been sent");
      onOpenChange(false);
      setPasswordResetEmail("");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Failed to request password reset. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={passwordResetEmail}
                onChange={(e) => setPasswordResetEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Send Reset Link
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
