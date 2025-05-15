
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Users, 
  Settings,
  FileVideo,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const menuItems = getMenuItems();

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileVideo className="h-6 w-6" />
            <h1 className="font-semibold text-xl hidden md:block">VideoFlow</h1>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-6 w-6" />
                  <span className="font-semibold text-lg">VideoFlow</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.title}
                      variant="ghost"
                      className="justify-start gap-2"
                      onClick={() => {
                        navigate(item.url);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={() => navigate(item.url)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Role switcher */}
        <RoleSwitcher />
      </div>
    </header>
  );
}
