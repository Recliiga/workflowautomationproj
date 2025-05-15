
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { VideoDetailDialog } from "@/components/calendar/VideoDetailDialog";
import { CalendarEvent, Video } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useCalendarEvents, updateVideoSchedule } from "@/hooks/useCalendarEvents";
import { MOCK_VIDEOS } from "@/data/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedulingVideoId, setSchedulingVideoId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<CalendarEvent | null>(null);
  const [calendarViewMode, setCalendarViewMode] = useState<"twoWeeks" | "month">("twoWeeks");
  
  const isClient = user?.role === "client";
  const isReadOnly = user?.role === "freelancer";
  
  // Use the custom hook to generate calendar events
  const calendarEvents = useCalendarEvents(videos);
  
  // Find the selected video from the ID
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
    
    // Use the utility function to update video schedules
    setVideos(prev => updateVideoSchedule(prev, eventId, newDate, calendarEvents));
    
    toast.success("Video rescheduled successfully!");
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-muted-foreground">
              {isClient 
                ? "Schedule and manage your content publishing" 
                : "View upcoming content schedule"}
            </p>
          </div>
          
          <div className="space-x-2">
            <Button
              variant={calendarViewMode === "twoWeeks" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarViewMode("twoWeeks")}
            >
              2 Weeks
            </Button>
            <Button
              variant={calendarViewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarViewMode("month")}
            >
              Month
            </Button>
          </div>
        </div>
        
        <CalendarContainer
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onEventDrop={handleEventDrop}
          readOnly={isReadOnly}
          viewMode={calendarViewMode}
        />
        
        <VideoDetailDialog
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          selectedVideo={selectedVideo}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setSelectedVideoId={setSelectedVideoId}
          userRole={user?.role}
        />
      </div>
    </AppLayout>
  );
}
