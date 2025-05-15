import { useState } from "react";
import { User, Client, Freelancer, DashboardStats, Video } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, AlertCircle, Clock, FileVideo, User as UserIcon, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VideoTypeManager } from "@/components/admin/VideoTypeManager";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock users for demonstration
const MOCK_CLIENTS: Client[] = [
  {
    id: "2",
    name: "Client User",
    email: "client@company.com",
    role: "client",
    company: "Acme Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3"]
  },
  {
    id: "4",
    name: "Jane Cooper",
    email: "jane@example.com",
    role: "client",
    company: "Globex Corp",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3", "5"]
  }
];

const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: "3",
    name: "Freelancer User",
    email: "freelancer@creator.com",
    role: "freelancer",
    certifications: ["Adobe Certified Expert", "YouTube Content Creation"],
    specialties: ["Motion Graphics", "Video Editing"],
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["2", "4"]
  },
  {
    id: "5",
    name: "Michael Johnson",
    email: "michael@creator.com",
    role: "freelancer",
    certifications: ["Final Cut Pro Certified"],
    specialties: ["Commercial Editing", "Sound Design"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["4"]
  }
];

// Mock videos for demonstration
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
    clientId: "4",
    freelancerId: "5",
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [freelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [videos] = useState<Video[]>(MOCK_VIDEOS);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [videoTypes, setVideoTypes] = useState<string[]>([
    "Dialogue",
    "Evergreen Content",
    "Exercises",
    "Huge Client Win",
    "Partnership/Sponsorship",
    "Testimonial"
  ]);
  
  // Calculate stats
  const stats: DashboardStats = {
    totalVideos: videos.length,
    inProgress: videos.filter(v => v.status === "in-progress").length,
    submitted: videos.filter(v => v.status === "submitted").length,
    approved: videos.filter(v => v.status === "approved").length,
    rejected: videos.filter(v => v.status === "rejected").length,
  };
  
  const impersonateUser = (role: 'client' | 'freelancer', userId: string) => {
    // In a real app, this would set the impersonated user in context
    console.log(`Impersonating ${role} with ID ${userId}`);
    
    if (role === 'client') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };
  
  const viewAssignments = (userId: string) => {
    // In a real app, this would navigate to the assignments page filtered for this user
    navigate('/users');
  };
  
  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };
  
  const getFreelancerById = (freelancerId: string) => {
    return freelancers.find(f => f.id === freelancerId);
  };

  const handleVideoTypesChange = (newTypes: string[]) => {
    setVideoTypes(newTypes);
    // In a real app, this would save the changes to a database or API
    console.log("Video types updated:", newTypes);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage clients, freelancers, and content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <FileVideo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Videos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Videos</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {videos.slice(0, 3).map((video) => (
                      <div key={video.id} className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center">
                          <FileVideo className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{video.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Client: {getClientById(video.clientId)?.name}</span>
                            <span>•</span>
                            <span>Status: {video.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* User Management */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
                    <Users className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="clients">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="clients">Clients</TabsTrigger>
                      <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="clients" className="space-y-4">
                      {clients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={client.avatar} alt={client.name} />
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{client.company}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewAssignments(client.id)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => impersonateUser('client', client.id)}
                            >
                              <UserIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="freelancers" className="space-y-4">
                      {freelancers.map((freelancer) => (
                        <div key={freelancer.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                              <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{freelancer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {freelancer.specialties?.join(', ') || 'No specialties'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewAssignments(freelancer.id)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => impersonateUser('freelancer', freelancer.id)}
                            >
                              <UserIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Videos by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Videos by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="in-progress">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-progress" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(v => v.status === "in-progress")
                      .map(video => (
                        <VideoPreviewCard
                          key={video.id}
                          video={video}
                          role="admin"
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="submitted" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(v => v.status === "submitted")
                      .map(video => (
                        <VideoPreviewCard
                          key={video.id}
                          video={video}
                          role="admin"
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="approved" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(v => v.status === "approved")
                      .map(video => (
                        <VideoPreviewCard
                          key={video.id}
                          video={video}
                          role="admin"
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="rejected" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(v => v.status === "rejected")
                      .map(video => (
                        <VideoPreviewCard
                          key={video.id}
                          video={video}
                          role="admin"
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <VideoTypeManager 
              initialTypes={videoTypes} 
              onTypesChange={handleVideoTypesChange} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
