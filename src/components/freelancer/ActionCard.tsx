
import React from "react";
import { Video } from "@/types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ActionCardProps {
  video: Video;
  onViewDetails: (videoId: string) => void;
  onSubmit: (videoId: string, isResubmission: boolean) => void;
}

export function ActionCard({ video, onViewDetails, onSubmit }: ActionCardProps) {
  const isRejected = video.status === "rejected";

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
      
      {isRejected && video.notes && (
        <div className="bg-red-50 border border-red-100 rounded p-1 mb-2">
          <p className="text-xs text-red-700 font-medium">Feedback:</p>
          <p className="text-xs text-red-600 line-clamp-2">{video.notes}</p>
        </div>
      )}
      
      <Button 
        className="w-full text-xs"
        size="sm"
        onClick={() => onSubmit(video.id, isRejected)}
      >
        <Upload className="mr-2 h-3 w-3" />
        {isRejected ? "Resubmit Video" : "Submit Edited Video"}
      </Button>
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
