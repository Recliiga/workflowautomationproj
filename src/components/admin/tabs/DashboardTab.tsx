
import { Client, DashboardStats, Video } from "@/types";
import { UserManagement } from "../dashboard/UserManagement";
import { AdminDashboardContent } from "../AdminDashboardContent";

interface DashboardTabProps {
  stats: DashboardStats;
  clients: Client[];
  videos: Video[];
  getClientById: (id: string) => Client | undefined;
  getFreelancerById: (id: string) => any | undefined;
  viewAssignments: (userId: string) => void;
  impersonateUser: (role: 'client' | 'freelancer', userId: string) => void;
}

export function DashboardTab({
  stats,
  clients,
  videos,
  getClientById,
  getFreelancerById,
  viewAssignments,
  impersonateUser
}: DashboardTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <AdminDashboardContent 
          stats={stats}
          clients={clients}
          videos={videos}
          getClientById={getClientById}
        />
      </div>
      
      {/* User Management */}
      <div>
        <UserManagement 
          clients={clients}
          freelancers={[]}  // Pass the actual freelancers here
          onViewAssignments={viewAssignments}
          onImpersonate={impersonateUser}
        />
      </div>
    </div>
  );
}
