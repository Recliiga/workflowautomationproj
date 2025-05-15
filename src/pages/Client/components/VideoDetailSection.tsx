
import React, { useState } from "react";
import { Video, CalendarEvent } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { ProjectModal } from "@/components/client/ProjectModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface VideoDetailSectionProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedVideo: Video | undefined;
  selectedProject: CalendarEvent | null;
  setSelectedProjectState: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  onApprove: (videoId: string) => void;
  openRejectModal: (videoId: string) => void;
  onDelete?: (videoId: string) => void;
}

export function VideoDetailSection({
  isModalOpen,
  setIsModalOpen,
  selectedVideo,
  selectedProject,
  setSelectedProjectState,
  setSelectedVideoId,
  onApprove,
  openRejectModal,
  onDelete
}: VideoDetailSectionProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleVideoClick = (videoId: string) => {
    setSelectedProjectState(null);
    setSelectedVideoId(videoId);
  };

  const handleDelete = () => {
    if (selectedVideo && onDelete) {
      onDelete(selectedVideo.id);
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedVideo && !selectedProject && (
            <>
              <VideoPreviewCard
                video={selectedVideo}
                role="client"
                onApprove={selectedVideo.status === "submitted" ? onApprove : undefined}
                onReject={selectedVideo.status === "submitted" ? () => openRejectModal(selectedVideo.id) : undefined}
              />
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Content
                </Button>
              </div>
            </>
          )}
          
          {selectedProject && (
            <ProjectModal 
              project={selectedProject}
              onVideoClick={handleVideoClick}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content
              and remove it from the content calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
