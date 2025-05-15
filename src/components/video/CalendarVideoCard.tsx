
import React from "react";
import { Video, VideoStatus } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarVideoCardProps {
  video: Video;
  onClick?: () => void;
  className?: string;
}

export function CalendarVideoCard({ video, onClick, className }: CalendarVideoCardProps) {
  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500";
      case "submitted":
        return "bg-amber-500";
      case "approved":
        return "bg-emerald-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div 
      className={cn(
        "rounded-md overflow-hidden border cursor-pointer hover:border-accent transition-colors flex",
        className
      )}
      onClick={onClick}
    >
      <div className="w-16 h-16 relative flex-shrink-0">
        <img
          src={video.thumbnailUrl || "https://via.placeholder.com/640x360?text=Video"}
          alt={video.title}
          className="object-cover w-full h-full"
        />
        <Badge 
          variant="outline" 
          className={cn(
            "absolute bottom-0.5 left-0.5 z-20 text-white border-none text-[0.65rem] py-0 px-1",
            getStatusColor(video.status)
          )}
        >
          {video.status}
        </Badge>
      </div>
      <div className="p-1.5 flex-grow overflow-hidden">
        <h3 className="font-medium text-xs truncate">{video.title}</h3>
        <div className="text-[0.65rem] text-muted-foreground truncate">
          {video.videoType || "Unclassified"}
        </div>
      </div>
    </div>
  );
}
