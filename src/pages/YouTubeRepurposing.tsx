
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MOCK_VIDEOS } from "@/data/mockData";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { ProjectSelector } from "@/components/youtube/ProjectSelector";
import { GeneratedContentDisplay } from "@/components/youtube/GeneratedContentDisplay";
import { YouTubeContent } from "@/types/youtube";
import { CalendarEvent } from "@/types";

export default function YouTubeRepurposing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
  const [selectedProject, setSelectedProject] = useState<CalendarEvent | null>(null);

  // Filter videos based on user role
  const videos = useMemo(() => {
    if (user?.role === 'client') {
      return MOCK_VIDEOS.filter(v => v.clientId === user.id);
    } else if (user?.role === 'freelancer') {
      return MOCK_VIDEOS.filter(v => v.freelancerId === user.id);
    } else if (user?.role === 'admin') {
      return MOCK_VIDEOS;
    }
    return [];
  }, [user]);

  // Get calendar events from videos
  const calendarEvents = useCalendarEvents(videos);

  // Filter to only show projects with AI content
  const projectsWithContent = useMemo(() => 
    calendarEvents.filter(event => 
      event.videos && event.videos.some(video => video.aiContent)
    ), 
    [calendarEvents]
  );

  const handleContentGenerated = (content: YouTubeContent, project: CalendarEvent) => {
    setGeneratedContent(content);
    setSelectedProject(project);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold">YouTube Shorts Repurposing</h2>
          <p className="text-muted-foreground">
            Transform your Instagram content into YouTube-ready videos
          </p>
        </div>

        {projectsWithContent.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Content Available</h3>
              <p className="text-muted-foreground mb-4">
                You need projects with AI-generated content to use this feature.
              </p>
              <Button onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Generated Content Display - Left Side */}
            <div className="order-2 lg:order-1">
              {generatedContent && selectedProject ? (
                <GeneratedContentDisplay
                  project={selectedProject}
                  content={generatedContent}
                />
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Generate YouTube Content</h3>
                    <p className="text-muted-foreground">
                      Select a project from the right panel and generate YouTube content to see it here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Project Selection - Right Side */}
            <div className="order-1 lg:order-2">
              <ProjectSelector 
                projects={projectsWithContent} 
                onContentGenerated={handleContentGenerated}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
