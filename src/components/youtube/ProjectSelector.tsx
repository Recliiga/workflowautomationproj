
import { useState } from "react";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { ProjectSelectorHeader } from "./ProjectSelectorHeader";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetails } from "./ProjectDetails";
import { ContentGenerationSection } from "./ContentGenerationSection";
import { GeneratedContentDisplay } from "./GeneratedContentDisplay";

interface ProjectSelectorProps {
  projects: CalendarEvent[];
}

export function ProjectSelector({ projects }: ProjectSelectorProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleProjectClick = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    setGeneratedContent(null);
  };

  const handleContentGenerated = (content: YouTubeContent) => {
    setGeneratedContent(content);
  };

  return (
    <div className="space-y-6">
      <ProjectSelectorHeader />

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
                  <div key={project.id}>
                    <ProjectCard
                      project={project}
                      isExpanded={isExpanded}
                      onToggle={() => handleProjectClick(project.id)}
                    />
                    
                    {isExpanded && (
                      <CollapsibleContent>
                        <div className="mt-4 p-4 bg-secondary/20 rounded-lg space-y-4">
                          <ProjectDetails project={project} />

                          <ContentGenerationSection
                            project={project}
                            isGenerating={isGenerating}
                            onGenerate={handleContentGenerated}
                            onGeneratingChange={setIsGenerating}
                          />

                          {generatedContent && (
                            <GeneratedContentDisplay
                              project={project}
                              content={generatedContent}
                            />
                          )}
                        </div>
                      </CollapsibleContent>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
