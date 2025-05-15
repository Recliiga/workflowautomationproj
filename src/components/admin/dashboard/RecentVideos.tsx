
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo } from "lucide-react";
import { Video, Client } from "@/types";
import { useNavigate } from "react-router-dom";

interface RecentVideosProps {
  videos: Video[];
  getClientById: (id: string) => Client | undefined;
}

export function RecentVideos({ videos, getClientById }: RecentVideosProps) {
  const navigate = useNavigate();
  
  return (
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
  );
}
