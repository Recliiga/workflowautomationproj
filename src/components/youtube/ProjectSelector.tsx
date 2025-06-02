
import { useState } from "react";
import { CalendarEvent } from "@/types";
import { YouTubeContent } from "@/types/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { Calendar, Video, ChevronDown, ChevronUp, Sparkles, Copy, Download } from "lucide-react";
import { generateYouTubeContent } from "@/utils/youtubeGenerator";
import { toast } from "sonner";

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

  const handleGenerate = async (project: CalendarEvent) => {
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
      });
      
      setGeneratedContent(content);
      toast.success("YouTube content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCopyAll = () => {
    if (!generatedContent) return;
    
    const allContent = `TITLE:
${generatedContent.title}

DESCRIPTION:
${generatedContent.description}

TAGS:
${generatedContent.tags.join(", ")}

THUMBNAIL TEXT IDEAS:
${generatedContent.thumbnailText.join(" | ")}`;
    
    navigator.clipboard.writeText(allContent);
    toast.success("All content copied to clipboard!");
  };

  const handleExport = (project: CalendarEvent) => {
    if (!generatedContent) return;
    
    const blob = new Blob([
      `YouTube Content for: ${project.title}\n\n`,
      `TITLE:\n${generatedContent.title}\n\n`,
      `DESCRIPTION:\n${generatedContent.description}\n\n`,
      `TAGS:\n${generatedContent.tags.join(", ")}\n\n`,
      `THUMBNAIL TEXT IDEAS:\n${generatedContent.thumbnailText.join("\n")}`
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
        <div>
          <h2 className="text-2xl font-bold">YouTube Shorts Repurposing</h2>
          <p className="text-muted-foreground">
            Transform your Instagram content into YouTube-ready videos
          </p>
        </div>
      </div>

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
                const firstVideo = project.videos?.[0];
                const hasMultipleVideos = project.videos && project.videos.length > 1;
                const isExpanded = expandedProject === project.id;
                
                return (
                  <Collapsible key={project.id} open={isExpanded} onOpenChange={() => handleProjectClick(project.id)}>
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
                        {firstVideo?.aiContent && (
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
                        )}

                        <Button 
                          onClick={() => handleGenerate(project)}
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

                        {generatedContent && (
                          <div className="space-y-4 mt-6">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm">Generated YouTube Content:</h5>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy All
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleExport(project)}>
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
                                    <p className="text-sm">{generatedContent.title}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.title, "Title")}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-background border rounded">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <span className="font-medium text-xs text-primary">Description: </span>
                                    <pre className="text-xs mt-1 whitespace-pre-wrap">{generatedContent.description}</pre>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.description, "Description")}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-background border rounded">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <span className="font-medium text-xs text-primary">Tags: </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {generatedContent.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.tags.join(", "), "Tags")}>
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-background border rounded">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <span className="font-medium text-xs text-primary">Thumbnail Text: </span>
                                    <div className="space-y-1 mt-1">
                                      {generatedContent.thumbnailText.map((text, index) => (
                                        <div key={index} className="text-xs bg-secondary/30 px-2 py-1 rounded font-bold text-center">
                                          {text}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generatedContent.thumbnailText.join(" | "), "Thumbnail Text")}>
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
                        )}

                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            💡 Content will be optimized using your admin-configured settings for industry, location, and brand voice.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
