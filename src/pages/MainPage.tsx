
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UnifiedClientView from "./Client/UnifiedClientView";
import UnifiedFreelancerView from "./Freelancer/UnifiedFreelancerView";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

export default function MainPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-full">
          <header className="border-b p-4 flex justify-end items-center">
            <RoleSwitcher />
          </header>
          <div className="flex-1 p-4">
            {user?.role === "admin" && <AdminDashboard />}
            {user?.role === "client" && <UnifiedClientView />}
            {user?.role === "freelancer" && <UnifiedFreelancerView />}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
