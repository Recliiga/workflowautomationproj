
import { CalendarEvent } from "@/types";

interface ProjectDetailsProps {
  project: CalendarEvent;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const firstVideo = project.videos?.[0];

  if (!firstVideo?.aiContent) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h5 className="font-medium text-sm">AI Content Details:</h5>
      <div className="grid gap-3 text-sm">
        <div>
          <span className="font-medium text-primary">Hook: </span>
          <span className="text-muted-foreground">{firstVideo.aiContent.hook}</span>
        </div>
        <div>
          <span className="font-medium text-primary">Caption: </span>
          <span className="text-muted-foreground">{firstVideo.aiContent.caption}</span>
        </div>
        <div>
          <span className="font-medium text-primary">CTA: </span>
          <span className="text-muted-foreground">{firstVideo.aiContent.cta}</span>
        </div>
      </div>
    </div>
  );
}
