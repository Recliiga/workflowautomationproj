
import { CalendarEvent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Check } from "lucide-react";

interface ProjectCardProps {
  project: CalendarEvent;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
  const firstVideo = project.videos?.[0];
  const hasMultipleVideos = project.videos && project.videos.length > 1;

  return (
    <div 
      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary/50 ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onSelect}
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
            {isSelected && (
              <Check className="h-4 w-4 ml-auto text-primary" />
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
  );
}
