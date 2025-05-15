
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/AuthContext";
import { Video } from "@/types";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";

// Mock data for demonstration
const MOCK_VIDEOS: Video[] = [
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
  },
  {
    id: "5",
    title: "Product Announcement - New Mobile App",
    description: "Announcing our new mobile app launch.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original5.mp4",
    editedUrl: "https://example.com/videos/edited5.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=300",
    status: "approved",
    uploadDate: "2023-03-15T12:00:00Z",
    publishDate: "2023-04-01T12:00:00Z",
    aiContent: {
      caption: "Introducing our all-new mobile app! Download now for free.",
      hook: "Your pocket just got a lot more powerful.",
      cta: "Get it now on iOS and Android!",
      emailCopy: "Hi [Name],\n\nWe're thrilled to announce the launch of our mobile app! Now you can access all your favorite features on the go.\n\nDownload it today and enjoy these exclusive mobile features:\n- Offline mode\n- Push notifications\n- Quick access dashboard\n\nAvailable now on iOS and Android.\n\nBest,\nThe Product Team"
    }
  },
  {
    id: "6",
    title: "Annual Conference Highlights",
    description: "Highlights from our annual user conference.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original6.mp4",
    editedUrl: "https://example.com/videos/edited6.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300",
    status: "approved",
    uploadDate: "2023-02-20T12:00:00Z",
    publishDate: "2023-03-05T12:00:00Z",
    aiContent: {
      caption: "Missed our conference? Here are all the highlights in 3 minutes!",
      hook: "The biggest announcements from our biggest event of the year.",
      cta: "Register now for next year's conference at early bird rates!",
      emailCopy: "Hello [Name],\n\nWhat an amazing conference we had last month! For those who couldn't make it (and those who want to relive the experience), we've put together a highlights video.\n\nIn just 3 minutes, you'll see all the major announcements, product reveals, and inspiring moments from our biggest event of the year.\n\nAnd don't forget - early bird registration is now open for next year!\n\nBest regards,\nEvents Team"
    }
  }
];

export default function TaskHistory() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // In a real app, this would fetch task history from an API
    // Filter based on current user's ID
    setVideos(MOCK_VIDEOS.filter(v => {
      if (user?.role === 'client') {
        return v.clientId === user.id;
      } else if (user?.role === 'freelancer') {
        return v.freelancerId === user.id;
      } else if (user?.role === 'admin') {
        return true;
      }
      return false;
    }));
  }, [user]);
  
  const viewVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task History</h1>
          <p className="text-muted-foreground">View your completed and published videos</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Video History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No video history available</p>
                </div>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-secondary/20 -mx-2 px-2 rounded-md cursor-pointer"
                    onClick={() => viewVideo(video)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-24 bg-gray-200 rounded-md overflow-hidden">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-300">
                            <span className="text-xs text-gray-500">No thumbnail</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{video.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end sm:space-y-1">
                      <StatusBadge status={video.status} className="sm:ml-4" />
                      <span className="text-xs text-muted-foreground ml-auto sm:ml-0">
                        {video.publishDate 
                          ? `Published: ${format(parseISO(video.publishDate), 'MMM d, yyyy')}`
                          : `Uploaded: ${format(parseISO(video.uploadDate), 'MMM d, yyyy')}`
                        }
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Video Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            {selectedVideo && (
              <VideoPreviewCard
                video={selectedVideo}
                role={user?.role || "client"}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
