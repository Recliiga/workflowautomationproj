
import { useState } from "react";
import { CalendarEvent, Video, User } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { ProjectModal } from "@/components/client/ProjectModal";

interface VideoDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVideo: Video | null;
  selectedProject: CalendarEvent | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: User['role'] | undefined;
}

export function VideoDetailDialog({
  isOpen,
  onOpenChange,
  selectedVideo,
  selectedProject,
  setSelectedProject,
  setSelectedVideoId,
  userRole
}: VideoDetailDialogProps) {
  const handleVideoClick = (videoId: string) => {
    setSelectedProject(null);
    setSelectedVideoId(videoId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedVideo && !selectedProject && (
          <VideoPreviewCard
            video={selectedVideo}
            role={userRole || "client"}
            onSchedule={
              userRole === "client" && selectedVideo.status === "approved" && !selectedVideo.publishDate
                ? (videoId) => {
                    setSelectedVideoId(videoId);
                    onOpenChange(false);
                  }
                : undefined
            }
          />
        )}
        
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onVideoClick={handleVideoClick}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
