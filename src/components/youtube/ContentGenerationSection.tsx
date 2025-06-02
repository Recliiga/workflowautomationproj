
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { generateYouTubeContent } from "@/utils/youtubeGenerator";
import { toast } from "sonner";

interface ContentGenerationSectionProps {
  project: CalendarEvent;
  isGenerating: boolean;
  onGenerate: (content: YouTubeContent) => void;
  onGeneratingChange: (isGenerating: boolean) => void;
}

export function ContentGenerationSection({ 
  project, 
  isGenerating, 
  onGenerate, 
  onGeneratingChange 
}: ContentGenerationSectionProps) {
  const handleGenerate = async () => {
    const firstVideo = project.videos?.[0];
    if (!firstVideo?.aiContent) {
      toast.error("No AI content found for this project");
      return;
    }

    onGeneratingChange(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = generateYouTubeContent({
        videoId: firstVideo.id,
        projectTitle: project.title,
        caption: firstVideo.aiContent.caption,
        hook: firstVideo.aiContent.hook,
        cta: firstVideo.aiContent.cta,
      });
      
      onGenerate(content);
      toast.success("YouTube content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      onGeneratingChange(false);
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
