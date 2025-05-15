
import React from "react";
import { Video } from "@/types";
import { ApprovalCard } from "@/components/client/ApprovalCard";

interface ApprovalSectionProps { 
  videos: Video[];
  onViewDetails: (id: string) => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
}

export function ApprovalSection({ 
  videos,
  onViewDetails,
  onReject, 
  onApprove 
}: ApprovalSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Videos Requiring Your Approval ({videos.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {videos.map(video => (
          <ApprovalCard
            key={video.id}
            video={video}
            onViewDetails={onViewDetails}
            onReject={onReject}
            onApprove={onApprove}
          />
        ))}
      </div>
    </div>
  );
}
