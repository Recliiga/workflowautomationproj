
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
        "rounded-md overflow-hidden border cursor-pointer hover:border-accent transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <img
            src={video.thumbnailUrl || "https://via.placeholder.com/640x360?text=Video"}
            alt={video.title}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <Badge 
          variant="outline" 
          className={cn(
            "absolute bottom-2 left-2 z-20 text-white border-none",
            getStatusColor(video.status)
          )}
        >
          {video.status}
        </Badge>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm truncate">{video.title}</h3>
        <div className="text-xs text-muted-foreground truncate">
          {video.videoType || "Unclassified"}
        </div>
      </div>
    </div>
  );
}
