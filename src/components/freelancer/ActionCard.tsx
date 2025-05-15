
import React from "react";
import { Video } from "@/types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ActionCardProps {
  video: Video;
  onViewDetails: (videoId: string) => void;
  onSubmit: (videoId: string, isResubmission: boolean) => void;
}

export function ActionCard({ video, onViewDetails, onSubmit }: ActionCardProps) {
  const isRejected = video.status === "rejected";

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
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
          {video.videoType || "Unclassified"}
        </p>
        
        {isRejected && video.notes && (
          <div className="bg-red-50 border border-red-100 rounded p-1 mb-1">
            <p className="text-xs text-red-700 font-medium">Feedback:</p>
            <p className="text-xs text-red-600 line-clamp-2">{video.notes}</p>
          </div>
        )}
        
        <div className="mt-auto">
          <Button 
            className="w-full text-xs h-7"
            size="sm"
            onClick={() => onSubmit(video.id, isRejected)}
          >
            <Upload className="mr-1 h-3 w-3" />
            {isRejected ? "Resubmit Video" : "Submit Edited Video"}
          </Button>
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
    </div>
  );
}
