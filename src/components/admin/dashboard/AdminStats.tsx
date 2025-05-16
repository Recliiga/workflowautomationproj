
import { DashboardStats } from "@/types";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { FileVideo, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface AdminStatsProps {
  stats: DashboardStats;
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Total Videos" value={stats.totalVideos} icon={FileVideo} />
      <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
      <StatCard title="Approved" value={stats.approved} icon={CheckCircle} />
      <StatCard title="Rejected" value={stats.rejected} icon={AlertCircle} />
    </div>
  );
}
