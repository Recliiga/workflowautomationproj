
import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { MOCK_VIDEOS } from "@/data/mockData";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { ProjectSelector } from "@/components/youtube/ProjectSelector";
import { YouTubeContentGenerator } from "@/components/youtube/YouTubeContentGenerator";
import { YouTubeContentDisplay } from "@/components/youtube/YouTubeContentDisplay";

export default function YouTubeRepurposing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<CalendarEvent | null>(null);
  const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);

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

  const handleProjectSelect = (project: CalendarEvent) => {
    setSelectedProject(project);
    setGeneratedContent(null);
  };

  const handleContentGenerated = (content: YouTubeContent) => {
    setGeneratedContent(content);
  };

  const handleReset = () => {
    setSelectedProject(null);
    setGeneratedContent(null);
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

        {!selectedProject ? (
          <ProjectSelector
            projects={projectsWithContent}
            onProjectSelect={handleProjectSelect}
          />
        ) : !generatedContent ? (
          <YouTubeContentGenerator
            project={selectedProject}
            onContentGenerated={handleContentGenerated}
            onBack={handleReset}
          />
        ) : (
          <YouTubeContentDisplay
            content={generatedContent}
            project={selectedProject}
            onGenerateNew={handleReset}
          />
        )}

        {projectsWithContent.length === 0 && !selectedProject && (
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
        )}
      </div>
    </AppLayout>
  );
}
