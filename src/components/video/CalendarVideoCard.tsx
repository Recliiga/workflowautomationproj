
import React from "react";
import { Video, VideoStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalendarVideoCardProps {
  video: Video;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export function CalendarVideoCard({ 
  video, 
  onClick, 
  className,
  compact = false
}: CalendarVideoCardProps) {
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
        compact ? "h-14" : "h-auto",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("relative flex-shrink-0", compact ? "w-14 h-14" : "w-16 h-16")}>
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
        <h3 className={cn("font-medium truncate", compact ? "text-xs" : "text-sm")}>{video.title}</h3>
        <div className="text-[0.65rem] text-muted-foreground truncate">
          {video.videoType || "Unclassified"}
        </div>
      </div>
    </div>
  );
}
