
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  
  const roles: UserRole[] = ["admin", "client", "freelancer"];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="capitalize">{user.role}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
