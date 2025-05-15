
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  
  const roles: UserRole[] = ["admin", "client", "freelancer"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <User className="h-4 w-4 mr-2" />
          <span className="capitalize">{user.role}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => switchRole(role)}
            className={user.role === role ? "bg-secondary" : ""}
          >
            <span className="capitalize">{role}</span>
            {user.role === role && <span className="ml-2">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
