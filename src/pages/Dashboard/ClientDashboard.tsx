
import { useState } from "react";
import { Video, VideoStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { Button } from "@/components/ui/button";
import { Upload, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadModule } from "@/components/video/FileUploadModule";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Video Types - these would typically be fetched from the server
const VIDEO_TYPES = [
  "Dialogue",
  "Evergreen Content",
  "Exercises",
  "Huge Client Win",
  "Partnership/Sponsorship",
  "Testimonial"
].sort((a, b) => a.localeCompare(b));

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
    aiContent: {
      caption: "Master our advanced features with this comprehensive guide.",
      hook: "Did you know you're only using 20% of our platform's capabilities?",
      cta: "Unlock your full potential - watch the full tutorial now!",
      emailCopy: "Hi [Name],\n\nAre you getting the most out of our platform? Our data shows that most users are only scratching the surface of what's possible.\n\nWe've created a comprehensive tutorial to help you leverage our advanced features and maximize your ROI.\n\nCheck it out below!\n\nBest,\nTraining Team"
    }
  }
];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleApprove = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, status: 'approved' as VideoStatus } : video
      )
    );
  };
  
  const handleReject = (videoId: string) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId ? { ...video, status: 'rejected' as VideoStatus } : video
      )
    );
  };
  
  const handleSchedule = (videoId: string) => {
    navigate('/calendar');
  };
  
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
      };
    });
    
    setVideos(prev => [...newVideos, ...prev]);
    setIsUploadModalOpen(false);
    toast.success(`${files.length} video${files.length > 1 ? 's' : ''} uploaded successfully!`);
  };
  
  const videosByStatus = {
    "in-progress": videos.filter(v => v.status === "in-progress"),
    "submitted": videos.filter(v => v.status === "submitted"),
    "approved": videos.filter(v => v.status === "approved"),
    "rejected": videos.filter(v => v.status === "rejected")
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
          <p className="text-muted-foreground">Manage your videos and content</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/history')}
          >
            <History className="mr-2 h-4 w-4" />
            Task History
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Videos
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-3 xl:col-span-4">
          <NotificationBanner
            message="Your video 'Product Demo' has been edited and submitted. Please review and approve it."
            type="info"
          />
        </div>
      </div>
      
      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress ({videosByStatus["in-progress"].length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({videosByStatus["submitted"].length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({videosByStatus["approved"].length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({videosByStatus["rejected"].length})
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
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="client"
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="mt-6">
          {videosByStatus["submitted"].length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos submitted for review</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByStatus["submitted"].map(video => (
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="client"
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          {videosByStatus["approved"].length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved videos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByStatus["approved"].map(video => (
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="client"
                  onSchedule={handleSchedule}
                />
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
                <VideoPreviewCard
                  key={video.id}
                  video={video}
                  role="client"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
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
