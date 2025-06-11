
import { Calendar, Home, Users, History, MessageSquare, FileText, Youtube, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Mock shared documents - in a real app, this would come from an API
const mockSharedDocuments = [
  {
    id: "1",
    title: "Project Guidelines",
    availableFor: "both" as const,
  },
  {
    id: "2", 
    title: "Brand Standards",
    availableFor: "client" as const,
  },
  {
    id: "3",
    title: "Technical Requirements",
    availableFor: "freelancer" as const,
  },
];

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

  // Filter shared documents based on user role
  const getSharedDocuments = () => {
    if (!user || user.role === "admin") return [];
    
    return mockSharedDocuments.filter(doc => 
      doc.availableFor === "both" || doc.availableFor === user.role
    );
  };

  const sharedDocuments = getSharedDocuments();

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

        {sharedDocuments.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Shared Documents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sharedDocuments.map((doc) => (
                  <SidebarMenuItem key={doc.id}>
                    <SidebarMenuButton asChild isActive={location.pathname === `/shared-docs/${doc.id}`}>
                      <Link to={`/shared-docs/${doc.id}`}>
                        <FileText />
                        <span>{doc.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
