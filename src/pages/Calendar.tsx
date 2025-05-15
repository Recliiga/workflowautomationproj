import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarView } from "@/components/calendar/CalendarView";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { CalendarVideoCard } from "@/components/video/CalendarVideoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarEvent, Video, VideoStatus } from "@/types";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Brand Introduction Video",
    description: "A short introduction to our brand values and mission.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-01T12:00:00Z",
    dueDate: "2023-05-10T12:00:00Z",
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
  },
  {
    id: "4",
    title: "How-To Guide: Advanced Features",
    description: "Step by step tutorial on using advanced features.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original4.mp4",
    editedUrl: "https://example.com/videos/edited4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=300",
    status: "approved",
    uploadDate: "2023-04-25T12:00:00Z",
    dueDate: "2023-05-05T12:00:00Z",
    publishDate: "2023-05-24T12:00:00Z",
  }
];

export default function Calendar() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedulingVideoId, setSchedulingVideoId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<CalendarEvent | null>(null);
  
  const isClient = user?.role === "client";
  const isReadOnly = user?.role === "freelancer";
  
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
  
  // Create calendar events from approved videos with publish dates
  const calendarEvents = useMemo(() => {
    // First, group videos by date
    const groupedByDate = videos
      .filter(video => video.publishDate || video.dueDate)
      .reduce((acc, video) => {
        const date = video.publishDate || video.dueDate || "";
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(video);
        return acc;
      }, {} as Record<string, Video[]>);
    
    // Then create calendar events for each group
    return Object.entries(groupedByDate).map(([date, dateVideos]) => {
      // If there's only one video on this date, create a simple event
      if (dateVideos.length === 1) {
        const video = dateVideos[0];
        return {
          id: video.id,
          videoId: video.id,
          title: video.title,
          date: date,
          status: video.status,
          videoType: video.videoType
        };
      }
      
      // Otherwise, create a project/group event
      return {
        id: `project-${date}`,
        title: `${dateVideos.length} Videos`,
        date: date,
        status: dateVideos[0].status,
        videoType: "Project",
        videos: dateVideos
      };
    });
  }, [videos]);
  
  const selectedVideo = useMemo(() => {
    return videos.find(v => v.id === selectedVideoId);
  }, [selectedVideoId, videos]);
  
  const handleEventClick = (eventId: string) => {
    // Check if this is a project or individual video
    const event = calendarEvents.find(e => e.id === eventId);
    
    if (event && event.videos) {
      // It's a project, set the selected project
      setSelectedProject(event);
      setSelectedVideoId(null);
    } else {
      // It's a single video
      setSelectedVideoId(eventId);
      setSelectedProject(null);
    }
    
    setIsModalOpen(true);
  };
  
  const handleDateClick = (date: Date) => {
    if (isReadOnly) return;
    
    if (schedulingVideoId) {
      // Scheduling a specific video
      setVideos(prev => 
        prev.map(video => 
          video.id === schedulingVideoId 
            ? { ...video, publishDate: format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") } 
            : video
        )
      );
      setSchedulingVideoId(null);
      toast.success("Video scheduled successfully!");
    }
  };
  
  const handleEventDrop = (eventId: string, newDate: Date) => {
    if (isReadOnly) return;
    
    // Check if this is a project or individual video
    const event = calendarEvents.find(e => e.id === eventId);
    
    if (event && event.videos) {
      // It's a project, update all videos in this project
      setVideos(prev => 
        prev.map(video => {
          if (event.videos!.some(v => v.id === video.id)) {
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
    
    toast.success("Video rescheduled successfully!");
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            {isClient 
              ? "Schedule and manage your content publishing" 
              : "View upcoming content schedule"}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView
              events={calendarEvents}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onEventDrop={handleEventDrop}
              readOnly={isReadOnly}
            />
          </CardContent>
        </Card>
        
        {/* Video Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedVideo && !selectedProject && (
              <VideoPreviewCard
                video={selectedVideo}
                role={user?.role || "client"}
                onSchedule={
                  isClient && selectedVideo.status === "approved" && !selectedVideo.publishDate
                    ? (videoId) => {
                        setSchedulingVideoId(videoId);
                        setIsModalOpen(false);
                        toast.info("Select a date on the calendar to schedule this video");
                      }
                    : undefined
                }
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
                        onClick={() => {
                          setSelectedProject(null);
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
      </div>
    </AppLayout>
  );
}
