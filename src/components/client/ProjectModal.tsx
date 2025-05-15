
import React from "react";
import { CalendarEvent, VideoStatus, Video } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarVideoCard } from "@/components/video/CalendarVideoCard";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProjectModalProps {
  project: CalendarEvent;
  onVideoClick: (videoId: string) => void;
}

export function ProjectModal({ project, onVideoClick }: ProjectModalProps) {
  // Helper function to get color for video status
  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500 text-white";
      case "submitted":
        return "bg-amber-500 text-white";
      case "approved":
        return "bg-emerald-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">{project.title}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Scheduled for: {format(new Date(project.date), "MMMM d, yyyy")}
          </p>
          <Badge className={cn(
            "px-2 py-0.5",
            getStatusColor(project.status)
          )}>
            {project.status}
          </Badge>
        </div>
        
        {/* Video list section */}
        <h3 className="text-lg font-medium mt-2">Videos in this project:</h3>
        <div className="grid grid-cols-1 gap-4">
          {project.videos && project.videos.length > 0 ? (
            project.videos.map((video: Video) => (
              <CalendarVideoCard
                key={video.id}
                video={video}
                className="h-auto"
                onClick={() => onVideoClick(video.id)}
                hideStatus={false} 
              />
            ))
          ) : (
            <p className="text-muted-foreground">No videos in this project</p>
          )}
        </div>

        {/* Notes section if any video has notes */}
        {project.videos?.[0]?.notes && (
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Notes for Freelancer</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm whitespace-pre-wrap">{project.videos[0].notes}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Video Context section if any video has description */}
        {project.videos?.[0]?.description && (
          <Card className="border border-muted">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Video Context</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm whitespace-pre-wrap">{project.videos[0].description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
