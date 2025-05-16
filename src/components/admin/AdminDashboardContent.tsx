
import { Client, DashboardStats, Video } from "@/types";
import { RecentVideos } from "@/components/admin/dashboard/RecentVideos";
import { VideosByStatus } from "@/components/admin/dashboard/VideosByStatus";
import { AdminStats } from "@/components/admin/dashboard/AdminStats";

interface AdminDashboardContentProps {
  stats: DashboardStats;
  clients: Client[];
  videos: Video[];
  getClientById: (id: string) => Client | undefined;
}

export function AdminDashboardContent({
  stats,
  clients,
  videos,
  getClientById
}: AdminDashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <AdminStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos */}
        <div className="lg:col-span-2">
          <RecentVideos videos={videos} getClientById={getClientById} />
        </div>
      </div>
      
      {/* Videos by Status */}
      <VideosByStatus videos={videos} role="admin" />
    </div>
  );
}
