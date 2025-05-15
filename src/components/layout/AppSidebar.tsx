
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  User, 
  Users, 
  Settings,
  FileVideo,
  LogOut,
  ChevronRight 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleSwitcher } from "./RoleSwitcher";
import { cn, sidebarStyles } from "@/lib/utils";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Simplified menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { title: "Main", url: "/main", icon: Home },
    ];

    const adminItems = [
      { title: "Users", url: "/users", icon: Users },
      { title: "Settings", url: "/settings", icon: Settings },
    ];

    if (!user) return baseItems;
    return user.role === 'admin' ? [...baseItems, ...adminItems] : baseItems;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar>
      {/* Add the rail with custom blue styling and tab indicator */}
      <div className="relative">
        <SidebarRail className={cn(sidebarStyles.rail, sidebarStyles.railTab)} />
        {/* Add a visible chevron indicator on the rail to indicate expandability */}
        <div className="absolute top-1/3 left-0 z-30 hidden group-data-[collapsible=offcanvas]:flex items-center justify-center">
          <ChevronRight className="h-5 w-5 ml-1 text-white bg-blue-500 rounded-full p-0.5" />
        </div>
      </div>
      
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <FileVideo className="h-6 w-6" />
          <span>VideoFlow</span>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <button onClick={() => navigate(item.url)} className="w-full flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="rounded-full p-1.5 hover:bg-sidebar-accent"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
