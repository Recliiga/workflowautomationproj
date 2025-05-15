
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UnifiedClientView from "./Client/UnifiedClientView";
import UnifiedFreelancerView from "./Freelancer/UnifiedFreelancerView";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function MainPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        {user?.role === "admin" && <AdminDashboard />}
        {user?.role === "client" && <UnifiedClientView />}
        {user?.role === "freelancer" && <UnifiedFreelancerView />}
      </SidebarInset>
    </div>
  );
}
