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

// Mock data for demonstration
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Brand Introduction Video",
    description: "A short introduction to our brand values and mission.",
    clientId: "2",
    originalUrl: "https://example.com/videos/original1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-01T12:00:00Z",
    dueDate: "2023-05-10T12:00:00Z",
    aiContent: {
      caption: "Introducing our brand's mission to transform the industry through innovative solutions.",
      hook: "Tired of the same old solutions? Here's how we're changing the game...",
      cta: "Visit our website to learn more and schedule a demo today!",
      emailCopy: "Dear [Name],\n\nWe're excited to introduce our brand new approach to solving [industry problem]. Our team has worked tirelessly to develop a solution that not only addresses your pain points but revolutionizes the way you work.\n\nClick below to learn more and schedule your personalized demo.\n\nBest regards,\nThe Team"
    }
  },
  {
    id: "2",
    title: "Product Demo - New Feature",
    description: "Walkthrough of our latest product feature.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original2.mp4",
    editedUrl: "https://example.com/videos/edited2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=300",
    status: "submitted",
    uploadDate: "2023-05-02T12:00:00Z",
    dueDate: "2023-05-12T12:00:00Z",
    videoType: "Product Demo",
    publishDate: "2023-06-15T12:00:00Z",
    aiContent: {
      caption: "Our new feature makes your workflow 10x faster. See it in action!",
      hook: "What if you could save 5 hours every week with just one click?",
      cta: "Try our new feature now - free for 14 days!",
      emailCopy: "Hi [Name],\n\nWe've just released our most requested feature, and we think you're going to love it. In the attached video, you'll see how it can save you hours every week.\n\nLog in now to try it yourself!\n\nRegards,\nProduct Team"
    }
  },
  {
    id: "3",
    title: "Customer Testimonial - Johnson Inc.",
    description: "Interview with the CEO of Johnson Inc. about their experience.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original3.mp4",
    editedUrl: "https://example.com/videos/edited3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=300",
    status: "approved",
    uploadDate: "2023-04-20T12:00:00Z",
    publishDate: "2023-05-15T12:00:00Z",
    videoType: "Testimonial",
    aiContent: {
      caption: "Hear how Johnson Inc. increased productivity by 35% using our platform.",
      hook: "Johnson Inc. was struggling with efficiency. Then they found us.",
      cta: "Join hundreds of satisfied customers - book a call today!",
      emailCopy: "Hello [Name],\n\nSuccess stories speak louder than features. That's why we wanted to share this testimonial from Johnson Inc., who saw a 35% increase in productivity within just 2 months of implementing our solution.\n\nWatch the full story in the video below.\n\nCheers,\nCustomer Success Team"
    }
  },
  {
    id: "4",
    title: "How-To Guide: Advanced Features",
    description: "Step by step tutorial on using advanced features.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original4.mp4",
    editedUrl: "https://example.com/videos/edited4.mp4",
    resubmittedUrl: "https://example.com/videos/resubmitted4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=300",
    status: "rejected",
    uploadDate: "2023-04-25T12:00:00Z",
    dueDate: "2023-05-05T12:00:00Z",
    videoType: "How-To Guide",
    aiContent: {
      caption: "Master our advanced features with this comprehensive guide.",
      hook: "Did you know you're only using 20% of our platform's capabilities?",
      cta: "Unlock your full potential - watch the full tutorial now!",
      emailCopy: "Hi [Name],\n\nAre you getting the most out of our platform? Our data shows that most users are only scratching the surface of what's possible.\n\nWe've created a comprehensive tutorial to help you leverage our advanced features and maximize your ROI.\n\nCheck it out below!\n\nBest,\nTraining Team"
    }
  }
];

// Video Types - these would typically be fetched from the server
const VIDEO_TYPES = [
  "Dialogue",
  "Evergreen Content",
  "Exercises",
  "Huge Client Win",
  "Partnership/Sponsorship",
  "Testimonial"
].sort((a, b) => a.localeCompare(b));

export default function UnifiedClientView() {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [calendarViewMode, setCalendarViewMode] = useState<"twoWeeks" | "month">("twoWeeks");
  
  // Add back the state variable for selectedProject
  const [selectedProjectState, setSelectedProjectState] = useState<CalendarEvent | null>(null);
  
  // Helper function to get color for video status
  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500 text-white";
      case "submitted":
        return "bg-amber-500 text-white";
      case "approved":
        return "bg-emerald-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Filter videos for approval section
  const videosForApproval = useMemo(() => 
    videos.filter(v => v.status === "submitted"), 
    [videos]
  );
  
  // Create calendar events from videos with publish dates,
  // grouping them by project (using title as project identifier for simplicity)
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
    
    // Convert the map to an array of calendar events
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
  
  // Use the existing selectedProject from useMemo, but rename it to avoid conflicts
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
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Videos Requiring Your Approval ({videosForApproval.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {videosForApproval.map(video => (
              <ApprovalCard
                key={video.id}
                video={video}
                onViewDetails={(id) => { setSelectedVideoId(id); setIsModalOpen(true); }}
                onReject={openRejectModal}
                onApprove={handleApprove}
              />
            ))}
          </div>
        </div>
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
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedProject.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Scheduled for: {format(new Date(selectedProject.date), "MMMM d, yyyy")}
                  </p>
                  <Badge className={cn(
                    "px-2 py-0.5",
                    getStatusColor(selectedProject.videos?.[0]?.status || "in-progress")
                  )}>
                    {selectedProject.videos?.[0]?.status || "in-progress"}
                  </Badge>
                </div>
                
                {/* Project-level notes and context */}
                {selectedProject.videos?.[0]?.notes && (
                  <Card className="border border-muted">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Notes for Freelancer</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <p className="text-sm whitespace-pre-wrap">{selectedProject.videos[0].notes}</p>
                    </CardContent>
                  </Card>
                )}
                
                {selectedProject.videos?.[0]?.description && (
                  <Card className="border border-muted">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Video Context</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <p className="text-sm whitespace-pre-wrap">{selectedProject.videos[0].description}</p>
                    </CardContent>
                  </Card>
                )}
                
                <h3 className="text-lg font-medium mt-2">Videos in this project:</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {selectedProject.videos?.map((video: Video) => (
                    <CalendarVideoCard
                      key={video.id}
                      video={video}
                      className="h-auto"
                      compact={true}
                      onClick={() => {
                        setSelectedProjectState(null);
                        setSelectedVideoId(video.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
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
