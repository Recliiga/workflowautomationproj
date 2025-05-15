
import React from "react";
import { Video } from "@/types";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ApprovalCardProps {
  video: Video;
  onViewDetails: (videoId: string) => void;
  onReject: (videoId: string) => void;
  onApprove: (videoId: string) => void;
}

export function ApprovalCard({ video, onViewDetails, onReject, onApprove }: ApprovalCardProps) {
  return (
    <div className="border rounded-md shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative">
        <AspectRatio ratio={16/9} className="bg-muted">
          {video.thumbnailUrl && (
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          )}
        </AspectRatio>
      </div>
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="font-medium text-xs line-clamp-1 mb-0.5">{video.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
          {video.videoType || "Unclassified"}
        </p>
        <div className="flex gap-1 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReject(video.id)}
            className="text-xs py-0.5 h-7 flex-1 border-red-200 hover:bg-red-50 text-red-600"
          >
            Reject
          </Button>
          <Button 
            size="sm" 
            onClick={() => onApprove(video.id)}
            className="text-xs py-0.5 h-7 flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Approve
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-1 text-xs h-7"
          onClick={() => onViewDetails(video.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
