
import { useState, useMemo } from "react";
import { Video, VideoStatus, CalendarEvent } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { FileUploadModule } from "@/components/video/FileUploadModule";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { toast } from "sonner";
import { format } from "date-fns";
import { ApprovalCard } from "@/components/client/ApprovalCard";
import { RejectModal } from "@/components/client/RejectModal";
import { ProjectModal } from "@/components/client/ProjectModal";
import { MOCK_VIDEOS, VIDEO_TYPES } from "@/data/mockData";
import { useCalendarEvents, updateVideoSchedule } from "@/hooks/useCalendarEvents";

// Extract approval section into a separate file
import { ApprovalSection } from "./components/ApprovalSection";

export default function UnifiedClientView() {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProjectState, setSelectedProjectState] = useState<CalendarEvent | null>(null);
  
  // Filter videos for approval section
  const videosForApproval = useMemo(() => 
    videos.filter(v => v.status === "submitted"), 
    [videos]
  );
  
  // Use the custom hook to generate calendar events
  const calendarEvents = useCalendarEvents(videos);
  
  const selectedVideo = useMemo(() => {
    return videos.find(v => v.id === selectedVideoId);
  }, [selectedVideoId, videos]);
  
  // Use renamed variable to avoid conflicts
  const selectedProjectFromId = useMemo(() => {
    if (!selectedVideoId) return null;
    return calendarEvents.find(event => event.id === selectedVideoId);
  }, [selectedVideoId, calendarEvents]);

  // Use either the state-based selectedProject or the memo-based one
  const selectedProject = selectedProjectState || selectedProjectFromId;

  const handleFileUpload = (
    files: File[], 
    metadata: any,
    submissionData: {
      title: string;
      description: string;
      notes: string;
      videoType: string;
      targetDate: Date | undefined;
    }
  ) => {
    // In a real app, this would upload files to a server and get URLs back
    const newVideos: Video[] = files.map((file, index) => {
      const fileId = Object.keys(metadata)[index];
      const { title, description, notes } = metadata[fileId];
      
      return {
        id: `new-${Date.now()}-${index}`,
        title: title || submissionData.title, 
        description: description || submissionData.description,
        notes: notes || submissionData.notes, 
        videoType: submissionData.videoType,
        clientId: "2", // Current user ID would be used here
        originalUrl: URL.createObjectURL(file),
        thumbnailUrl: "", // In real app, this would be generated
        status: "in-progress",
        uploadDate: new Date().toISOString(),
        dueDate: submissionData.targetDate ? submissionData.targetDate.toISOString() : undefined,
        publishDate: submissionData.targetDate ? submissionData.targetDate.toISOString() : undefined,
      };
    });
    
    setVideos(prev => [...newVideos, ...prev]);
    setIsUploadModalOpen(false);
    toast.success(`${files.length} video${files.length > 1 ? 's' : ''} uploaded successfully!`);
  };

  const handleApprove = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, status: 'approved' as VideoStatus } : video
      )
    );
    toast.success("Video approved successfully!");
  };
  
  const handleReject = () => {
    if (selectedVideoId && rejectionReason.trim()) {
      setVideos(prev => 
        prev.map(video => 
          video.id === selectedVideoId 
            ? { ...video, status: 'rejected' as VideoStatus, notes: rejectionReason } 
            : video
        )
      );
      setIsRejectModalOpen(false);
      setRejectionReason("");
      toast.error("Video rejected and sent back for amendments.");
    }
  };
  
  const openRejectModal = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsRejectModalOpen(true);
  };
  
  const handleEventClick = (eventId: string) => {
    // Check if this is a project or individual video
    const event = calendarEvents.find(e => e.id === eventId);
    
    if (event && event.videos) {
      // It's a project, set the selected project
      setSelectedProjectState(event);
      setSelectedVideoId(null);
    } else {
      // It's a single video
      setSelectedVideoId(eventId);
      setSelectedProjectState(null);
    }
    
    setIsModalOpen(true);
  };
  
  const handleEventDrop = (eventId: string, newDate: Date) => {
    // Use the utility function to update video schedules
    setVideos(prev => updateVideoSchedule(prev, eventId, newDate, calendarEvents));
    toast.success("Content rescheduled successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">Manage your videos and content schedule</p>
        </div>
        
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Video
        </Button>
      </div>

      {/* Videos requiring approval section */}
      {videosForApproval.length > 0 && (
        <ApprovalSection 
          videos={videosForApproval}
          onViewDetails={(id) => { setSelectedVideoId(id); setIsModalOpen(true); }}
          onReject={openRejectModal}
          onApprove={handleApprove}
        />
      )}

      {/* Content Calendar section */}
      <CalendarContainer
        events={calendarEvents}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
        readOnly={false}
      />

      {/* Video Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedVideo && !selectedProject && (
            <VideoPreviewCard
              video={selectedVideo}
              role="client"
              onApprove={selectedVideo.status === "submitted" ? handleApprove : undefined}
              onReject={selectedVideo.status === "submitted" ? () => openRejectModal(selectedVideo.id) : undefined}
            />
          )}
          
          {selectedProject && (
            <ProjectModal 
              project={selectedProject}
              onVideoClick={(videoId) => {
                setSelectedProjectState(null);
                setSelectedVideoId(videoId);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Modal with Required Reasoning */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
      
      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Videos</DialogTitle>
          </DialogHeader>
          <FileUploadModule 
            onFilesSelected={handleFileUpload} 
            videoTypes={VIDEO_TYPES}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
