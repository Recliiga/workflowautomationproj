
import { Calendar, Home, Users, History, MessageSquare, FileText, Youtube, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      roles: ["admin", "client", "freelancer"],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      roles: ["admin", "client", "freelancer"],
    },
    {
      title: "Ad Tracking",
      url: "/ad-tracking",
      icon: TrendingUp,
      roles: ["client"],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Task History",
      url: "/history",
      icon: History,
      roles: ["admin", "client", "freelancer"],
    },
    {
      title: "Instagram DM",
      url: "/instagram-dm",
      icon: MessageSquare,
      roles: ["admin", "freelancer"],
    },
    {
      title: "Newsletter Template",
      url: "/newsletter-template",
      icon: FileText,
      roles: ["admin", "client", "freelancer"],
    },
    {
      title: "YouTube Repurposing",
      url: "/youtube-repurposing",
      icon: Youtube,
      roles: ["admin", "client", "freelancer"],
    },
  ];

  const filteredItems = navigationItems.filter(item =>
    item.roles.includes(user?.role || "")
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
