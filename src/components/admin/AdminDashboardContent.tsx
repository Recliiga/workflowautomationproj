
import { useState } from "react";
import { Client, DashboardStats, Video } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentVideos } from "@/components/admin/dashboard/RecentVideos";
import { VideosByStatus } from "@/components/admin/dashboard/VideosByStatus";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Videos" value={stats.totalVideos} icon={FileVideo} />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} />
        <StatCard title="Rejected" value={stats.rejected} icon={AlertCircle} />
      </div>
      
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
