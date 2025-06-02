
import { YouTubeContent } from "@/types/youtube";
import { CalendarEvent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, RefreshCw, Youtube } from "lucide-react";
import { toast } from "sonner";

interface YouTubeContentDisplayProps {
  content: YouTubeContent;
  project: CalendarEvent;
  onGenerateNew: () => void;
}

export function YouTubeContentDisplay({ 
  content, 
  project, 
  onGenerateNew 
}: YouTubeContentDisplayProps) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Youtube className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-semibold">YouTube Content Ready!</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onGenerateNew}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
          <Button variant="outline" onClick={handleCopyAll}>
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">YouTube Video Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-lg font-medium leading-relaxed">{content.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {content.title.length} characters
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.title, "Title")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">YouTube Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="p-3 bg-secondary/20 rounded-md">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-normal">
                  {content.description}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {content.description.length} characters
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.description, "Description")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">YouTube Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {content.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {content.tags.length} tags • Click to copy as comma-separated list
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.tags.join(", "), "Tags")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thumbnail Text Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {content.thumbnailText.map((text, index) => (
                <div
                  key={index}
                  className="p-2 bg-secondary/20 rounded text-center font-bold"
                >
                  {text}
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-3">
                Bold, attention-grabbing text for your video thumbnail
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(content.thumbnailText.join(" | "), "Thumbnail Text")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-green-800">
            <Youtube className="h-5 w-5" />
            <span className="font-medium">Ready for YouTube!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your content is optimized and ready to upload to YouTube Shorts. 
            Copy the content above and paste it when uploading your video.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
