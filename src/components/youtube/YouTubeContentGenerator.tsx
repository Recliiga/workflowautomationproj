
import { useState } from "react";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { generateYouTubeContent } from "@/utils/youtubeGenerator";
import { toast } from "sonner";

interface YouTubeContentGeneratorProps {
  project: CalendarEvent;
  onContentGenerated: (content: YouTubeContent) => void;
  onBack: () => void;
}

export function YouTubeContentGenerator({ 
  project, 
  onContentGenerated, 
  onBack 
}: YouTubeContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const firstVideo = project.videos?.[0];
    if (!firstVideo?.aiContent) {
      toast.error("No AI content found for this project");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = generateYouTubeContent({
        videoId: firstVideo.id,
        projectTitle: project.title,
        caption: firstVideo.aiContent.caption,
        hook: firstVideo.aiContent.hook,
        cta: firstVideo.aiContent.cta,
        // Admin-configured settings would be passed here in a real app
        // industry: clientSettings.industry,
        // location: clientSettings.location,
      });
      
      onContentGenerated(content);
      toast.success("YouTube content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const firstVideo = project.videos?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/20 rounded-lg">
              <h3 className="font-medium mb-2">{project.title}</h3>
              {firstVideo?.aiContent && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Hook: </span>
                    <span className="text-muted-foreground">{firstVideo.aiContent.hook}</span>
                  </div>
                  <div>
                    <span className="font-medium">Caption: </span>
                    <span className="text-muted-foreground">{firstVideo.aiContent.caption}</span>
                  </div>
                  <div>
                    <span className="font-medium">CTA: </span>
                    <span className="text-muted-foreground">{firstVideo.aiContent.cta}</span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating YouTube Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate YouTube Content
                </>
              )}
            </Button>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Content will be optimized using your admin-configured settings for industry, location, and brand voice.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Content Output Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>YouTube Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              {isGenerating ? (
                <div className="space-y-2">
                  <Sparkles className="h-8 w-8 mx-auto animate-spin" />
                  <p>Generating YouTube content...</p>
                </div>
              ) : (
                <p>Click "Generate YouTube Content" to create optimized content for this project.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
