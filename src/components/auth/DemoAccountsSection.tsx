
import { Button } from "@/components/ui/button";

interface DemoAccountsSectionProps {
  onSelectAccount: (email: string, password: string) => void;
}

export function DemoAccountsSection({ onSelectAccount }: DemoAccountsSectionProps) {
  return (
    <div className="mt-4 text-sm text-center text-muted-foreground">
      <p className="mb-2">Demo Accounts:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectAccount("admin@videoflow.com", "password")}
          className="w-full"
          type="button"
        >
          Admin
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectAccount("client@company.com", "password")}
          className="w-full"
          type="button"
        >
          Client
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectAccount("freelancer@creator.com", "password")}
          className="w-full"
          type="button"
        >
          Freelancer
        </Button>
      </div>
    </div>
  );
}
