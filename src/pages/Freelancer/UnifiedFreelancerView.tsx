
import { useState, useMemo } from "react";
import { Video, VideoStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UploadModal } from "@/components/freelancer/UploadModal";
import { toast } from "sonner";

// Mock data for demonstration
import { MOCK_VIDEOS } from "@/data/mockData";

// Import refactored components
import { TasksSection } from "./components/TasksSection";
import { FreelancerCalendarSection } from "./components/FreelancerCalendarSection";
import { FreelancerDetailDialog } from "./components/FreelancerDetailDialog";

export default function UnifiedFreelancerView() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isResubmission, setIsResubmission] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"twoWeeks" | "month">("twoWeeks");

  // Videos that need attention (in-progress or rejected)
  const urgentVideos = useMemo(() => 
    videos.filter(v => v.status === "in-progress" || v.status === "rejected"), 
    [videos]
  );
  
  // Create calendar events from videos with publish dates
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
    const events = [];
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
  
  const selectedProject = useMemo(() => {
    if (!selectedVideoId) return null;
    return calendarEvents.find(event => event.id === selectedVideoId);
  }, [selectedVideoId, calendarEvents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const openUploadModal = (videoId: string, resubmission = false) => {
    setSelectedVideoId(videoId);
    setIsResubmission(resubmission);
    setIsUploadModalOpen(true);
  };
  
  const handleSubmitVideo = () => {
    if (!selectedVideoId || !uploadedFile) return;
    
    // In a real app, this would upload the file to a server
    const editedUrl = URL.createObjectURL(uploadedFile);
    
    setVideos(prev => 
      prev.map(video => {
        if (video.id === selectedVideoId) {
          const updatedVideo = { 
            ...video, 
            status: 'submitted' as VideoStatus 
          };
          
          if (isResubmission) {
            updatedVideo.resubmittedUrl = editedUrl;
          } else {
            updatedVideo.editedUrl = editedUrl;
          }
          
          return updatedVideo;
        }
        return video;
      })
    );
    
    setIsUploadModalOpen(false);
    setSelectedVideoId(null);
    setUploadedFile(null);
    toast.success("Video submitted successfully!");
  };
  
  const handleEventClick = (eventId: string) => {
    setSelectedVideoId(eventId);
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedVideoId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h1>
        <p className="text-muted-foreground">Manage your assigned videos</p>
      </div>

      {/* Videos requiring attention section */}
      <TasksSection 
        urgentVideos={urgentVideos}
        onViewDetails={handleViewDetails}
        onSubmit={openUploadModal}
      />

      {/* Content Calendar section */}
      <FreelancerCalendarSection 
        calendarEvents={calendarEvents}
        onEventClick={handleEventClick}
        calendarViewMode={calendarViewMode}
        setCalendarViewMode={setCalendarViewMode}
      />

      {/* Video Detail Modal */}
      <FreelancerDetailDialog 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedVideo={selectedVideo}
        selectedProject={selectedProject}
      />
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        selectedVideo={selectedVideo}
        isResubmission={isResubmission}
        uploadedFile={uploadedFile}
        onFileChange={handleFileChange}
        onSubmit={handleSubmitVideo}
      />
    </div>
  );
}
