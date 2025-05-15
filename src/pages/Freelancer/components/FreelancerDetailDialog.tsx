
import React from "react";
import { Video, CalendarEvent } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { ProjectModal } from "@/components/client/ProjectModal";

interface FreelancerDetailDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedVideo: Video | undefined;
  selectedProject: CalendarEvent | null;
}

export function FreelancerDetailDialog({
  isModalOpen,
  setIsModalOpen,
  selectedVideo,
  selectedProject,
}: FreelancerDetailDialogProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedVideo && !selectedProject && (
          <VideoPreviewCard
            video={selectedVideo}
            role="freelancer"
          />
        )}
        
        {selectedProject && (
          <ProjectModal 
            project={selectedProject}
            onVideoClick={() => {}}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
