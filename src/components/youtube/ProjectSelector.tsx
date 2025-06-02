
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">YouTube Shorts Repurposing</h2>
          <p className="text-muted-foreground">
            Transform your Instagram content into YouTube-ready videos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Project to Repurpose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No projects with AI content available
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.map((project) => {
                  const firstVideo = project.videos?.[0];
                  const hasMultipleVideos = project.videos && project.videos.length > 1;
                  
                  return (
                    <div
                      key={project.id}
                      className="p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50"
                      onClick={() => onProjectSelect(project)}
                    >
                      <div className="flex items-start gap-3">
                        {firstVideo?.thumbnailUrl && (
                          <img
                            src={firstVideo.thumbnailUrl}
                            alt={project.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{project.title}</h4>
                            {hasMultipleVideos && (
                              <Badge variant="secondary" className="text-xs">
                                {project.videos.length} videos
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(project.date), "MMM d, yyyy")}
                            <Badge className="text-xs">{project.status}</Badge>
                          </div>
                          {firstVideo?.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {firstVideo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repurpose Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                YouTube Content
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Ready to Repurpose</h3>
              <p className="text-muted-foreground mb-4">
                Select a project to generate YouTube-optimized content from your Instagram posts.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Choose from projects that have AI-generated content ready for YouTube optimization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
