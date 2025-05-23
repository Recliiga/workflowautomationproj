import { useState, useMemo } from "react";
import { Video, VideoStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { Button } from "@/components/ui/button";
import { Calendar, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock data for demonstration
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Brand Introduction Video",
    description: "A short introduction to our brand values and mission.",
    notes: "Please keep it under 2 minutes and highlight our sustainability initiatives.",
    clientId: "2",
    freelancerId: "3",
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
    notes: "Focus on the time-saving aspects and usability improvements.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-02T12:00:00Z",
    dueDate: "2023-05-12T12:00:00Z",
    aiContent: {
      caption: "Our new feature makes your workflow 10x faster. See it in action!",
      hook: "What if you could save 5 hours every week with just one click?",
      cta: "Try our new feature now - free for 14 days!",
      emailCopy: "Hi [Name],\n\nWe've just released our most requested feature, and we think you're going to love it. In the attached video, you'll see how it can save you hours every week.\n\nLog in now to try it yourself!\n\nRegards,\nProduct Team"
    }
  },
  {
    id: "4",
    title: "How-To Guide: Advanced Features",
    description: "Step by step tutorial on using advanced features.",
    notes: "Please rerecord the section about data exports with the updated UI.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original4.mp4",
    editedUrl: "https://example.com/videos/edited4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=300",
    status: "rejected",
    uploadDate: "2023-04-25T12:00:00Z",
    dueDate: "2023-05-05T12:00:00Z",
    aiContent: {
      caption: "Master our advanced features with this comprehensive guide.",
      hook: "Did you know you're only using 20% of our platform's capabilities?",
      cta: "Unlock your full potential - watch the full tutorial now!",
      emailCopy: "Hi [Name],\n\nAre you getting the most out of our platform? Our data shows that most users are only scratching the surface of what's possible.\n\nWe've created a comprehensive tutorial to help you leverage our advanced features and maximize your ROI.\n\nCheck it out below!\n\nBest,\nTraining Team"
    }
  }
];

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isResubmission, setIsResubmission] = useState(false);
  
  const selectedVideo = useMemo(() => {
    return videos.find(v => v.id === selectedVideoId) || null;
  }, [selectedVideoId, videos]);
  
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
  
  const handleUpdateAIContent = (videoId: string, updatedContent: any) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId
          ? { ...video, aiContent: updatedContent }
          : video
      )
    );
  };
  
  const videosByStatus = {
    "in-progress": videos.filter(v => v.status === "in-progress"),
    "rejected": videos.filter(v => v.status === "rejected"),
    "submitted": videos.filter(v => v.status === "submitted")
  };

  const urgentVideos = videos.filter(v => {
    if (v.status !== "in-progress" && v.status !== "rejected") return false;
    if (!v.dueDate) return false;
    
    const dueDate = new Date(v.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 2; // Videos due in 2 days or less
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freelancer Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned videos</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/calendar')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>
      
      {urgentVideos.length > 0 && (
        <NotificationBanner
          message={`You have ${urgentVideos.length} urgent ${urgentVideos.length === 1 ? 'video' : 'videos'} due in the next 48 hours.`}
          type="warning"
        />
      )}
      
      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress ({videosByStatus["in-progress"].length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({videosByStatus["rejected"].length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({videosByStatus["submitted"].length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="in-progress" className="mt-6">
          {videosByStatus["in-progress"].length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos in progress</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByStatus["in-progress"].map(video => (
                <div key={video.id} className="space-y-4">
                  <VideoPreviewCard
                    video={video}
                    role="freelancer"
                    onUpdateAIContent={handleUpdateAIContent}
                  />
                  <Button 
                    className="w-full"
                    onClick={() => openUploadModal(video.id)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Edited Video
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {videosByStatus["rejected"].length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rejected videos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByStatus["rejected"].map(video => (
                <div key={video.id} className="space-y-4">
                  <VideoPreviewCard
                    video={video}
                    role="freelancer"
                  />
                  <Button 
                    className="w-full"
                    onClick={() => openUploadModal(video.id, true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Resubmit Video
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="mt-6">
          {videosByStatus["submitted"].length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No submitted videos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByStatus["submitted"].map(video => (
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="freelancer"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isResubmission ? "Resubmit Video" : "Submit Edited Video"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedVideo && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Original Video: {selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedVideo.description}</p>
                
                {selectedVideo.notes && (
                  <div className="mt-3 p-3 bg-secondary/30 rounded-md">
                    <h4 className="text-sm font-medium">Client Notes:</h4>
                    <p className="text-sm mt-1">{selectedVideo.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-file">Upload {isResubmission ? "Resubmission" : "Edited Video"}</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitVideo}
                  disabled={!uploadedFile}
                >
                  {isResubmission ? "Resubmit" : "Submit"} Video
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
