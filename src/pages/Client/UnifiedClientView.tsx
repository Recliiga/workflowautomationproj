
import { useState, useMemo } from "react";
import { Video, VideoStatus, CalendarEvent, AIContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { RejectModal } from "@/components/client/RejectModal";
import { MOCK_VIDEOS, VIDEO_TYPES } from "@/data/mockData";
import { useCalendarEvents, updateVideoSchedule } from "@/hooks/useCalendarEvents";
import { toast } from "sonner";
import { AdTracking } from "@/components/client/AdTracking";

// Import refactored components
import { ApprovalSection } from "./components/ApprovalSection";
import { CalendarSection } from "./components/CalendarSection";
import { VideoDetailSection } from "./components/VideoDetailSection";
import { UploadSection } from "./components/UploadSection";

interface UnifiedClientViewProps {
  adminView?: boolean;
  clientId?: string;
}

export default function UnifiedClientView({ adminView = false, clientId }: UnifiedClientViewProps) {
  const [videos, setVideos] = useState<Video[]>(
    // If in admin view with clientId, filter videos by that client
    clientId 
      ? MOCK_VIDEOS.filter(v => v.clientId === clientId)
      : MOCK_VIDEOS
  );
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
  
  // Use the custom hook to generate calendar events from all videos
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

  const handleApprove = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, status: 'approved' as VideoStatus } : video
      )
    );
    setIsModalOpen(false);
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
  
  const updateVideoSchedules = (eventId: string, newDate: Date) => {
    // Use the utility function to update video schedules
    setVideos(prev => updateVideoSchedule(prev, eventId, newDate, calendarEvents));
  };

  const handleVideosUploaded = (newVideos: Video[]) => {
    // If in admin view and clientId provided, assign the clientId to new videos
    const videosWithClientId = clientId ? 
      newVideos.map(video => ({ ...video, clientId })) : 
      newVideos;
    
    setVideos(prev => [...videosWithClientId, ...prev]);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
    toast.success("Content successfully deleted");
  };

  const handleUpdateAIContent = (videoId: string, updatedContent: AIContent) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, aiContent: updatedContent } : video
      )
    );
  };

  const viewTitle = adminView ? "Client Content Management" : "Client Dashboard";
  const viewDescription = adminView ? 
    "Manage client videos and content schedule" : 
    "Manage your videos and content schedule";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{viewTitle}</h1>
          <p className="text-muted-foreground">{viewDescription}</p>
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
      <CalendarSection
        calendarEvents={calendarEvents}
        onEventClick={handleEventClick}
        updateVideoSchedules={updateVideoSchedules}
      />

      {/* Ad Tracking section */}
      <AdTracking />

      {/* Video Detail Modal */}
      <VideoDetailSection 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedVideo={selectedVideo}
        selectedProject={selectedProject}
        setSelectedProjectState={setSelectedProjectState}
        setSelectedVideoId={setSelectedVideoId}
        onApprove={handleApprove}
        openRejectModal={openRejectModal}
        onDelete={handleDeleteVideo}
        onUpdateAIContent={handleUpdateAIContent}
        role={adminView ? "admin" : "client"}
      />
      
      {/* Reject Modal with Required Reasoning */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
      
      {/* Upload Modal */}
      <UploadSection 
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
        videoTypes={VIDEO_TYPES}
        onVideosUploaded={handleVideosUploaded}
      />
    </div>
  );
}
