
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isResubmission ? "Resubmit Video" : "Submit Edited Video"}
          </DialogTitle>
        </DialogHeader>
        
        {selectedVideo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Original Video: {selectedVideo.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedVideo.description}</p>
              
              {selectedVideo.notes && (
                <div className="mt-3 p-3 bg-secondary/30 rounded-md">
                  <h4 className="text-sm font-medium">Client Notes:</h4>
                  <p className="text-sm mt-1">{selectedVideo.notes}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video-file">Upload {isResubmission ? "Resubmission" : "Edited Video"}</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={onFileChange}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={onSubmit}
                disabled={!uploadedFile}
              >
                {isResubmission ? "Resubmit" : "Submit"} Video
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
