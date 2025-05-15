
import { useMemo } from "react";
import { Video, CalendarEvent, VideoStatus } from "@/types";
import { format } from "date-fns";

export function useCalendarEvents(videos: Video[]) {
  // Create calendar events from videos with publish dates
  return useMemo(() => {
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
          videoType: video.videoType,
          videos: [video] // Include the video in videos array to ensure consistent access
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
}

// Helper function to handle event scheduling and rescheduling
export function updateVideoSchedule(
  videos: Video[], 
  eventId: string, 
  newDate: Date, 
  calendarEvents: CalendarEvent[]
) {
  const event = calendarEvents.find(e => e.id === eventId);
  
  if (event && event.videos) {
    // It's a project, update all videos in this project
    return videos.map(video => {
      if (event.videos!.some(v => v.id === video.id)) {
        return { ...video, publishDate: format(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") };
      }
      return video;
    });
  } else {
    // It's a single video
    return videos.map(video => 
      video.id === eventId 
        ? { ...video, publishDate: format(newDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") } 
        : video
    );
  }
}
