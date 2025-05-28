
import { Video } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface VideoSelectorProps {
  approvedVideos: Video[];
  selectedVideo: Video | null;
  isContentExpanded: boolean;
  canGenerate: boolean;
  isGenerating: boolean;
  onVideoSelect: (video: Video) => void;
  onGenerateClick: () => void;
}

export function VideoSelector({
  approvedVideos,
  selectedVideo,
  isContentExpanded,
  canGenerate,
  isGenerating,
  onVideoSelect,
  onGenerateClick
}: VideoSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Approved Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {approvedVideos.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No approved videos available
          </p>
        ) : (
          <div className="space-y-2">
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <div className="space-y-2">
                {approvedVideos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVideo?.id === video.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => onVideoSelect(video)}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={video.thumbnailUrl || "https://via.placeholder.com/60x40"}
                          alt={video.title}
                          className="w-16 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {video.videoType || "Unclassified"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {video.publishDate && format(new Date(video.publishDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        {selectedVideo?.id === video.id && (
                          <div className="flex-shrink-0">
                            {isContentExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedVideo?.id === video.id && (
                      <Collapsible open={isContentExpanded}>
                        <CollapsibleContent className="space-y-0">
                          <div className="ml-4 p-3 border-l-2 border-primary/20 bg-muted/30 rounded-r-lg space-y-3">
                            <h5 className="font-medium text-sm text-primary">Content Details</h5>
                            
                            {video.aiContent ? (
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Hook:</p>
                                  <p className="text-xs">{video.aiContent.hook}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Caption:</p>
                                  <p className="text-xs">{video.aiContent.caption}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Call to Action:</p>
                                  <p className="text-xs">{video.aiContent.cta}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Email Copy:</p>
                                  <p className="text-xs">{video.aiContent.emailCopy}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">No content details available for this video.</p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {selectedVideo && canGenerate && (
          <Button 
            onClick={onGenerateClick}
            disabled={isGenerating}
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Newsletter Template"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
