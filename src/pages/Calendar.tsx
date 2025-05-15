
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarView } from "@/components/calendar/CalendarView";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  
  const isClient = user?.role === "client";
  const isReadOnly = user?.role === "freelancer";
  
  // Create calendar events from approved videos with publish dates
  const calendarEvents = useMemo(() => {
    return videos
      .filter(video => video.publishDate || video.dueDate)
      .map(video => ({
        id: video.id,
        videoId: video.id,
        title: video.title,
        date: video.publishDate || video.dueDate || "",
        status: video.status
      }));
  }, [videos]);
  
  const selectedVideo = useMemo(() => {
    return videos.find(v => v.id === selectedVideoId);
  }, [selectedVideoId, videos]);
  
  const handleEventClick = (eventId: string) => {
    setSelectedVideoId(eventId);
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
    
    setVideos(prev => 
      prev.map(video => 
        video.id === eventId 
          ? { ...video, publishDate: format(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") } 
          : video
      )
    );
    
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
          <DialogContent className="max-w-3xl">
            {selectedVideo && (
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
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
