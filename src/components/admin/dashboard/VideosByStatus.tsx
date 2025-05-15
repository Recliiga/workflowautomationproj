
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoPreviewCard } from "@/components/video/VideoPreviewCard";
import { Video } from "@/types";

interface VideosByStatusProps {
  videos: Video[];
  role: "admin" | "client" | "freelancer";
}

export function VideosByStatus({ videos, role }: VideosByStatusProps) {
  return (
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
                    role={role}
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
                    role={role}
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
                    role={role}
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
                    role={role}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
