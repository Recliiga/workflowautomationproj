
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadModule } from "@/components/video/FileUploadModule";
import { toast } from "sonner";
import { Video, AIContent } from "@/types";

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
  const [isProcessing, setIsProcessing] = useState(false);

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
    // Show processing state
    setIsProcessing(true);
    
    // Simulate backend processing with a timeout (this would be replaced by an actual API call)
    setTimeout(() => {
      // Generate mock content (this would come from the backend in a real implementation)
      const mockContent: AIContent = {
        hook: "Looking for a way to boost your productivity? Our latest feature solves that problem.",
        caption: `Check out our new ${submissionData.videoType.toLowerCase()} that helps you achieve more in less time.`,
        cta: "Click the link in bio to start your free trial today!",
        emailCopy: `Dear valued customer,\n\nWe're excited to share our latest ${submissionData.videoType.toLowerCase()} with you. This innovative solution addresses the key challenges you face daily.\n\nTry it today!\n\nBest regards,\nThe Team`
      };
      
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
          aiContent: mockContent
        };
      });
      
      // Reset processing state
      setIsProcessing(false);
      
      // Close modal and return new videos
      onVideosUploaded(newVideos);
      setIsUploadModalOpen(false);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully with content suggestions!`);
    }, 2000); // Simulate 2 second delay for processing
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
          isProcessing={isProcessing}
        />
        {isProcessing && (
          <div className="mt-4 p-4 bg-secondary/30 rounded-md">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <p className="text-sm font-medium">Processing Content...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
