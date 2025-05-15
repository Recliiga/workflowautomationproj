
import React from "react";
import { Video } from "@/types";
import { Button } from "@/components/ui/button";

interface ApprovalCardProps {
  video: Video;
  onViewDetails: (videoId: string) => void;
  onReject: (videoId: string) => void;
  onApprove: (videoId: string) => void;
}

export function ApprovalCard({ video, onViewDetails, onReject, onApprove }: ApprovalCardProps) {
  return (
    <div className="border rounded-md p-2 shadow-sm">
      <div className="aspect-video bg-muted relative overflow-hidden rounded-sm mb-2">
        {video.thumbnailUrl && (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-medium text-sm line-clamp-1 mb-1">{video.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
        {video.videoType || "Unclassified"}
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onReject(video.id)}
          className="text-xs flex-1 border-red-200 hover:bg-red-50 text-red-600"
        >
          Reject
        </Button>
        <Button 
          size="sm" 
          onClick={() => onApprove(video.id)}
          className="text-xs flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          Approve
        </Button>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-1 text-xs"
        onClick={() => onViewDetails(video.id)}
      >
        View Details
      </Button>
    </div>
  );
}
