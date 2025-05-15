
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadModule } from "@/components/video/FileUploadModule";
import { toast } from "sonner";
import { Video } from "@/types";

interface UploadSectionProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (isOpen: boolean) => void;
  videoTypes: string[];
  onVideosUploaded: (newVideos: Video[]) => void;
}

export function UploadSection({
  isUploadModalOpen,
  setIsUploadModalOpen,
  videoTypes,
  onVideosUploaded
}: UploadSectionProps) {
  const handleFileUpload = (
    files: File[], 
    metadata: any,
    submissionData: {
      title: string;
      description: string;
      videoType: string;
      targetDate: Date | undefined;
    }
  ) => {
    // In a real app, this would upload files to a server and get URLs back
    const newVideos: Video[] = files.map((file, index) => {
      const fileId = Object.keys(metadata)[index];
      const { title, description } = metadata[fileId];
      const isVideo = file.type.startsWith('video/');
      
      return {
        id: `new-${Date.now()}-${index}`,
        title: title || submissionData.title, 
        description: description || submissionData.description,
        videoType: submissionData.videoType,
        clientId: "2", // Current user ID would be used here
        originalUrl: URL.createObjectURL(file),
        thumbnailUrl: isVideo ? "" : URL.createObjectURL(file), // Use image as its own thumbnail
        status: "in-progress",
        uploadDate: new Date().toISOString(),
        dueDate: submissionData.targetDate ? submissionData.targetDate.toISOString() : undefined,
        publishDate: submissionData.targetDate ? submissionData.targetDate.toISOString() : undefined,
      };
    });
    
    onVideosUploaded(newVideos);
    setIsUploadModalOpen(false);
    toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully!`);
  };

  return (
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Videos & Photos</DialogTitle>
        </DialogHeader>
        <FileUploadModule 
          onFilesSelected={handleFileUpload} 
          videoTypes={videoTypes}
        />
      </DialogContent>
    </Dialog>
  );
}
