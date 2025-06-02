
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Video } from "lucide-react";
import { toast } from "sonner";

interface GeneratedContentDisplayProps {
  project: CalendarEvent;
  content: YouTubeContent;
}

export function GeneratedContentDisplay({ project, content }: GeneratedContentDisplayProps) {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCopyAll = () => {
    const allContent = `TITLE:
${content.title}

DESCRIPTION:
${content.description}

TAGS:
${content.tags.join(", ")}

THUMBNAIL TEXT IDEAS:
${content.thumbnailText.join(" | ")}`;
    
    navigator.clipboard.writeText(allContent);
    toast.success("All content copied to clipboard!");
  };

  const handleExport = () => {
    const blob = new Blob([
      `YouTube Content for: ${project.title}\n\n`,
      `TITLE:\n${content.title}\n\n`,
      `DESCRIPTION:\n${content.description}\n\n`,
      `TAGS:\n${content.tags.join(", ")}\n\n`,
      `THUMBNAIL TEXT IDEAS:\n${content.thumbnailText.join("\n")}`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-content-${project.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Content exported successfully!");
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-sm">Generated YouTube Content:</h5>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <Copy className="h-3 w-3 mr-1" />
            Copy All
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-background border rounded">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="font-medium text-xs text-primary">Title: </span>
              <p className="text-sm">{content.title}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.title, "Title")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 bg-background border rounded">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="font-medium text-xs text-primary">Description: </span>
              <pre className="text-xs mt-1 whitespace-pre-wrap">{content.description}</pre>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.description, "Description")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 bg-background border rounded">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="font-medium text-xs text-primary">Tags: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {content.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.tags.join(", "), "Tags")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 bg-background border rounded">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="font-medium text-xs text-primary">Thumbnail Text: </span>
              <div className="space-y-1 mt-1">
                {content.thumbnailText.map((text, index) => (
                  <div key={index} className="text-xs bg-secondary/30 px-2 py-1 rounded font-bold text-center">
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.thumbnailText.join(" | "), "Thumbnail Text")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <Video className="h-4 w-4" />
          <span className="font-medium text-sm">Ready for YouTube!</span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Your content is optimized and ready to upload to YouTube Shorts.
        </p>
      </div>
    </div>
  );
}
