
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UnifiedClientView from "./Client/UnifiedClientView";
import UnifiedFreelancerView from "./Freelancer/UnifiedFreelancerView";
import { AppLayout } from "@/components/layout/AppLayout";

export default function MainPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        {user?.role === "admin" && <AdminDashboard />}
        {user?.role === "client" && <UnifiedClientView />}
        {user?.role === "freelancer" && <UnifiedFreelancerView />}
      </div>
    </AppLayout>
  );
}
