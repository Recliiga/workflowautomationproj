
import { CalendarEvent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Play, Calendar, Video } from "lucide-react";

interface ProjectSelectorProps {
  projects: CalendarEvent[];
  onProjectSelect: (project: CalendarEvent) => void;
}

export function ProjectSelector({ projects, onProjectSelect }: ProjectSelectorProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Select a Project to Repurpose
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Choose from your projects that have AI-generated content ready for YouTube optimization.
          </p>
          
          <div className="grid gap-4">
            {projects.map((project) => {
              const firstVideo = project.videos?.[0];
              const hasMultipleVideos = project.videos && project.videos.length > 1;
              
              return (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => onProjectSelect(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{project.title}</h3>
                          {hasMultipleVideos && (
                            <Badge variant="secondary">
                              {project.videos.length} videos
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(project.date), "MMM d, yyyy")}
                          </div>
                          <Badge className="text-xs">{project.status}</Badge>
                        </div>
                        
                        {firstVideo?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {firstVideo.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {firstVideo?.thumbnailUrl && (
                          <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={firstVideo.thumbnailUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Repurpose
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
