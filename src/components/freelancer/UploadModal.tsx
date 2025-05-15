
import React from "react";
import { Video } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: Video | undefined;
  isResubmission: boolean;
  uploadedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  selectedVideo,
  isResubmission,
  uploadedFile,
  onFileChange,
  onSubmit
}: UploadModalProps) {
  const isImage = selectedVideo?.originalUrl.includes("image") || 
                 (selectedVideo?.thumbnailUrl && !selectedVideo.editedUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isResubmission ? "Resubmit" : "Submit Edited"} {isImage ? "Image" : "Video"}
          </DialogTitle>
        </DialogHeader>
        
        {selectedVideo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Original {isImage ? "Image" : "Video"}: {selectedVideo.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedVideo.description}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload {isResubmission ? "Resubmission" : "Edited"} {isImage ? "Image" : "Video"}</Label>
              <Input
                id="file-upload"
                type="file"
                accept={isImage ? "image/*" : "video/*"}
                onChange={onFileChange}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={onSubmit}
                disabled={!uploadedFile}
              >
                {isResubmission ? "Resubmit" : "Submit"} {isImage ? "Image" : "Video"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
