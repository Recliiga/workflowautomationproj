import { useState, useMemo } from "react";
import { Video, VideoStatus, CalendarEvent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { FileUploadModule } from "@/components/video/FileUploadModule";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { ApprovalCard } from "@/components/client/ApprovalCard";
import { RejectModal } from "@/components/client/RejectModal";
import { CalendarVideoCard } from "@/components/video/CalendarVideoCard";
import { ProjectModal } from "@/components/client/ProjectModal";

// Move MOCK_VIDEOS and VIDEO_TYPES to a separate file
import { MOCK_VIDEOS, VIDEO_TYPES } from "@/data/mockData";

export default function UnifiedClientView() {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [calendarViewMode, setCalendarViewMode] = useState<"twoWeeks" | "month">("twoWeeks");
  const [selectedProjectState, setSelectedProjectState] = useState<CalendarEvent | null>(null);
  
  // Filter videos for approval section
  const videosForApproval = useMemo(() => 
    videos.filter(v => v.status === "submitted"), 
    [videos]
  );
  
  // Create calendar events from videos with publish dates,
  // grouping them by project
  const calendarEvents = useMemo(() => {
    const projectMap = new Map();
    
    videos
      .filter(video => video.publishDate)
      .forEach(video => {
        const projectTitle = video.title.split(' - ')[0]; // Simple grouping by title prefix
        const date = video.publishDate || "";
        
        if (!projectMap.has(date)) {
          projectMap.set(date, new Map());
        }
        
        const dateProjects = projectMap.get(date);
        if (!dateProjects.has(projectTitle)) {
          dateProjects.set(projectTitle, {
            id: `project-${projectTitle}-${date}`,
            title: projectTitle,
            date: date,
            status: video.status,
            videoType: "Project",
            videos: []
          });
        }
        
        const project = dateProjects.get(projectTitle);
        project.videos.push(video);
      });
    
    const events: CalendarEvent[] = [];
    projectMap.forEach(dateProjects => {
      dateProjects.forEach(project => {
        events.push(project);
      });
    });
    
    return events;
  }, [videos]);
  
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
    setSelectedVideoId(eventId);
    setIsModalOpen(true);
  };
  
  const handleEventDrop = (eventId: string, newDate: Date) => {
    // Handle both individual videos and project groups
    const project = calendarEvents.find(event => event.id === eventId);
    
    if (project && project.videos) {
      // It's a project group, update all videos in this project
      setVideos(prev => 
        prev.map(video => {
          if (project.videos!.some((v: any) => v.id === video.id)) {
            return { ...video, publishDate: format(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") };
          }
          return video;
        })
      );
    } else {
      // It's a single video
      setVideos(prev => 
        prev.map(video => 
          video.id === eventId 
            ? { ...video, publishDate: format(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") } 
            : video
        )
      );
    }
    
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Content Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={calendarViewMode === "twoWeeks" ? "default" : "outline"} 
              onClick={() => setCalendarViewMode("twoWeeks")}
            >
              2 Weeks
            </Button>
            <Button 
              size="sm" 
              variant={calendarViewMode === "month" ? "default" : "outline"}
              onClick={() => setCalendarViewMode("month")}
            >
              Month
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarView
            events={calendarEvents}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            readOnly={false}
            viewMode={calendarViewMode}
          />
        </CardContent>
      </Card>

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

// Extract the approval section into a separate component
function ApprovalSection({ 
  videos,
  onViewDetails,
  onReject, 
  onApprove 
}: { 
  videos: Video[], 
  onViewDetails: (id: string) => void,
  onReject: (id: string) => void, 
  onApprove: (id: string) => void 
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Videos Requiring Your Approval ({videos.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {videos.map(video => (
          <ApprovalCard
            key={video.id}
            video={video}
            onViewDetails={onViewDetails}
            onReject={onReject}
            onApprove={onApprove}
          />
        ))}
      </div>
    </div>
  );
}
