import { useState } from "react";
import { User, Client, Freelancer, DashboardStats, Video } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VideoTypeManager } from "@/components/admin/VideoTypeManager";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { RecentVideos } from "@/components/admin/dashboard/RecentVideos";
import { UserManagement } from "@/components/admin/dashboard/UserManagement";
import { VideosByStatus } from "@/components/admin/dashboard/VideosByStatus";

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
            <StatCard title="Total Videos" value={stats.totalVideos} icon={FileVideo} />
            <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
            <StatCard title="Approved" value={stats.approved} icon={CheckCircle} />
            <StatCard title="Rejected" value={stats.rejected} icon={AlertCircle} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Videos */}
            <div className="lg:col-span-2">
              <RecentVideos videos={videos} getClientById={getClientById} />
            </div>
            
            {/* User Management */}
            <div>
              <UserManagement 
                clients={clients}
                freelancers={freelancers}
                onViewAssignments={viewAssignments}
                onImpersonate={impersonateUser}
              />
            </div>
          </div>
          
          {/* Videos by Status */}
          <VideosByStatus videos={videos} role="admin" />
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
