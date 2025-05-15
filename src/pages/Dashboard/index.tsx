
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ClientDashboard from "./ClientDashboard";
import FreelancerDashboard from "./FreelancerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "client" && <ClientDashboard />}
      {user?.role === "freelancer" && <FreelancerDashboard />}
    </AppLayout>
  );
}
