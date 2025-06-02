
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ProjectDetails } from "./ProjectDetails";
import { ContentGenerationSection } from "./ContentGenerationSection";

interface ProjectCardProps {
  project: CalendarEvent;
  isExpanded: boolean;
  onToggle: () => void;
  isGenerating: boolean;
  onContentGenerated: (content: YouTubeContent) => void;
  onGeneratingChange: (isGenerating: boolean) => void;
}

export function ProjectCard({ 
  project, 
  isExpanded, 
  onToggle,
  isGenerating,
  onContentGenerated,
  onGeneratingChange
}: ProjectCardProps) {
  const firstVideo = project.videos?.[0];
  const hasMultipleVideos = project.videos && project.videos.length > 1;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50">
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
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(project.date), "MMM d, yyyy")}
              </div>
              {firstVideo?.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {firstVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-4 p-4 bg-secondary/20 rounded-lg space-y-4">
          <ProjectDetails project={project} />

          <ContentGenerationSection
            project={project}
            isGenerating={isGenerating}
            onGenerate={onContentGenerated}
            onGeneratingChange={onGeneratingChange}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
