
import { useState } from "react";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "./ProjectCard";

interface ProjectSelectorProps {
  projects: CalendarEvent[];
  onContentGenerated: (content: YouTubeContent, project: CalendarEvent) => void;
}

export function ProjectSelector({ projects, onContentGenerated }: ProjectSelectorProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleProjectClick = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleContentGenerated = (content: YouTubeContent, project: CalendarEvent) => {
    onContentGenerated(content, project);
  };

  return (
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
            {projects.map((project) => {
              const isExpanded = expandedProject === project.id;
              
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={isExpanded}
                  onToggle={() => handleProjectClick(project.id)}
                  isGenerating={isGenerating}
                  onContentGenerated={(content) => handleContentGenerated(content, project)}
                  onGeneratingChange={setIsGenerating}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
