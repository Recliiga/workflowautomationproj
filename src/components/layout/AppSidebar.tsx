
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  User, 
  Users, 
  Settings,
  FileVideo,
  LogOut,
  ChevronRight,
  UserCog
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

  const handleProfileSettings = () => {
    navigate('/profile');
  };

  return (
    <Sidebar
      className="w-52" // Make the sidebar skinnier
      style={{ "--sidebar-width": "13rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties} // Define custom widths
    >
      {/* Add the rail with custom blue styling and tab indicator */}
      <div className="relative">
        <SidebarRail className={cn(sidebarStyles.rail, sidebarStyles.railTab)} />
        {/* Add a visible chevron indicator on the rail to indicate expandability */}
        <div className="absolute top-1/3 left-0 z-30 hidden group-data-[collapsible=offcanvas]:flex items-center justify-center">
          <ChevronRight className="h-5 w-5 ml-1 text-white bg-sidebar-primary rounded-full p-0.5" />
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
          <div className="space-y-2">
            <div className="flex items-center pb-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleProfileSettings}
                className="flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground"
              >
                <UserCog className="h-3 w-3" />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-sidebar-foreground"
              >
                <LogOut className="h-3 w-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
