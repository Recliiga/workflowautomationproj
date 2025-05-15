
import React from "react";
import { Video, CalendarEvent } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { ProjectModal } from "@/components/client/ProjectModal";

interface VideoDetailSectionProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedVideo: Video | null;
  selectedProject: CalendarEvent | null;
  setSelectedProjectState: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  onApprove: (videoId: string) => void;
  openRejectModal: (videoId: string) => void;
}

export function VideoDetailSection({
  isModalOpen,
  setIsModalOpen,
  selectedVideo,
  selectedProject,
  setSelectedProjectState,
  setSelectedVideoId,
  onApprove,
  openRejectModal
}: VideoDetailSectionProps) {
  const handleVideoClick = (videoId: string) => {
    setSelectedProjectState(null);
    setSelectedVideoId(videoId);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedVideo && !selectedProject && (
          <VideoPreviewCard
            video={selectedVideo}
            role="client"
            onApprove={selectedVideo.status === "submitted" ? onApprove : undefined}
            onReject={selectedVideo.status === "submitted" ? () => openRejectModal(selectedVideo.id) : undefined}
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
