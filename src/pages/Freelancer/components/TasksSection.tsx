
import React from "react";
import { Video } from "@/types";
import { ActionCard } from "@/components/freelancer/ActionCard";

interface TasksSectionProps {
  urgentVideos: Video[];
  onViewDetails: (videoId: string) => void;
  onSubmit: (videoId: string, isResubmission: boolean) => void;
}

export function TasksSection({
  urgentVideos,
  onViewDetails,
  onSubmit
}: TasksSectionProps) {
  if (urgentVideos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Videos Requiring Action ({urgentVideos.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {urgentVideos.map(video => (
          <ActionCard 
            key={video.id}
            video={video}
            onViewDetails={onViewDetails}
            onSubmit={onSubmit}
          />
        ))}
      </div>
    </div>
  );
}
