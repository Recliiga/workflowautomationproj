
import { useState } from "react";
import { Video } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { AIContentDisplay } from "@/components/video/AIContentDisplay";

interface VideoPreviewCardProps {
  video: Video;
  role: 'admin' | 'client' | 'freelancer';
  onApprove?: (videoId: string) => void;
  onReject?: (videoId: string) => void;
  onSchedule?: (videoId: string) => void;
  showAIContent?: boolean;
  onUpdateAIContent?: (videoId: string, updatedContent: any) => void;
}

export function VideoPreviewCard({ 
  video, 
  role,
  onApprove,
  onReject,
  onSchedule,
  showAIContent = true,
  onUpdateAIContent
}: VideoPreviewCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
  };

  const renderActionButtons = () => {
    if (role === 'client' && video.status === 'submitted') {
      return (
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onReject?.(video.id)}
            className="border-red-200 hover:bg-red-50 text-red-600"
          >
            Reject
          </Button>
          <Button 
            onClick={() => onApprove?.(video.id)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Approve
          </Button>
        </div>
      );
    }
    
    if (role === 'client' && video.status === 'approved' && !video.publishDate) {
      return (
        <Button 
          className="mt-4 w-full"
          onClick={() => onSchedule?.(video.id)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Video thumbnail */}
        <div 
          className="relative h-40 bg-gray-100 cursor-pointer"
          onClick={handleOpenModal}
        >
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No thumbnail</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="h-12 w-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1"></div>
            </div>
          </div>
        </div>
        
        {/* Video info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg line-clamp-1">{video.title}</h3>
            <StatusBadge status={video.status} />
          </div>
          
          {video.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {video.description}
            </p>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Uploaded: {format(new Date(video.uploadDate), 'MMM d, yyyy')}</p>
            {video.dueDate && (
              <p>Due: {format(new Date(video.dueDate), 'MMM d, yyyy')}</p>
            )}
            {video.publishDate && (
              <p>Scheduled: {format(new Date(video.publishDate), 'MMM d, yyyy')}</p>
            )}
          </div>
          
          {/* Display a preview of AI content if available */}
          {video.aiContent && (
            <div className="mt-3 p-2 bg-secondary/20 rounded-md">
              <p className="text-xs font-medium">Content Suggestions Available</p>
            </div>
          )}
          
          {renderActionButtons()}
        </div>
      </div>

      {/* Video modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4">
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>
          
          <div>
            <video
              src={video.editedUrl || video.originalUrl}
              controls
              autoPlay={isPlaying}
              className="w-full h-auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
          
          <div className="p-4 space-y-4">
            {video.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {video.description}
                </p>
              </div>
            )}
            
            {/* Show AI content if available and requested */}
            {showAIContent && video.aiContent && (
              <div className="mt-6">
                <AIContentDisplay 
                  content={video.aiContent} 
                  videoId={video.id}
                  editable={role === 'freelancer'} 
                  role={role}
                  onUpdate={onUpdateAIContent}
                />
              </div>
            )}
            
            {renderActionButtons()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
