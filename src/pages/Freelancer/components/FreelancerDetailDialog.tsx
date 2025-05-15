
import React from "react";
import { Video, CalendarEvent } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { format } from "date-fns";

interface FreelancerDetailDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedVideo: Video | null;
  selectedProject: CalendarEvent | null;
}

export function FreelancerDetailDialog({
  isModalOpen,
  setIsModalOpen,
  selectedVideo,
  selectedProject
}: FreelancerDetailDialogProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl">
        {selectedVideo && (
          <VideoPreviewCard
            video={selectedVideo}
            role="freelancer"
          />
        )}
        
        {selectedProject && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{selectedProject.title}</h2>
            <p>Scheduled for: {format(new Date(selectedProject.date), "MMMM d, yyyy")}</p>
            
            <h3 className="text-lg font-medium mt-4 mb-2">Videos in this project:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProject.videos?.map((video: Video) => (
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="freelancer"
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
