
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "./ProjectCard";
import { ContentGenerationSection } from "./ContentGenerationSection";

interface ProjectSelectorProps {
  projects: CalendarEvent[];
  selectedProject: CalendarEvent | null;
  onProjectSelected: (project: CalendarEvent) => void;
  onContentGenerated: (content: YouTubeContent, project: CalendarEvent) => void;
}

export function ProjectSelector({ 
  projects, 
  selectedProject, 
  onProjectSelected, 
  onContentGenerated 
}: ProjectSelectorProps) {
  const handleContentGenerated = (content: YouTubeContent) => {
    if (selectedProject) {
      onContentGenerated(content, selectedProject);
    }
  };

  return (
    <div className="space-y-4">
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
            <div className="space-y-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={selectedProject?.id === project.id}
                  onSelect={() => onProjectSelected(project)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProject && (
        <ContentGenerationSection
          project={selectedProject}
          onGenerate={handleContentGenerated}
        />
      )}
    </div>
  );
}
