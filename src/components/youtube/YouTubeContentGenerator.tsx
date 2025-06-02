
import { useState } from "react";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Youtube } from "lucide-react";
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
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");

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
        industry: industry || undefined,
        location: location || undefined,
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            Generate YouTube Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-medium mb-2">Selected Project: {project.title}</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Input
                id="industry"
                placeholder="e.g., Real Estate, Fitness, Marketing"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Helps optimize keywords and SEO
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., New York, Miami, Los Angeles"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Adds local SEO targeting
              </p>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating YouTube Content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate YouTube Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
