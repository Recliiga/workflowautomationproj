
import { useState } from "react";
import { Video, CalendarEvent } from "@/types";
import { NewsletterTemplate } from "@/types/newsletter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface NewsletterTemplateGeneratorProps {
  approvedVideos: Video[];
  monthlyCredits: number;
  creditsUsed: number;
  basicInstructions: string;
}

export function NewsletterTemplateGenerator({
  approvedVideos,
  monthlyCredits,
  creditsUsed,
  basicInstructions
}: NewsletterTemplateGeneratorProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<NewsletterTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(0);

  const canGenerate = creditsUsed < monthlyCredits;
  const canRevise = currentTemplate && currentTemplate.revisionsUsed < 3;

  const generateTemplate = async (video: Video) => {
    setIsGenerating(true);
    
    // Simulate API call to generate newsletter template
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template: NewsletterTemplate = {
      id: `template-${Date.now()}`,
      videoId: video.id,
      clientId: video.clientId,
      content: generateNewsletterContent(video, basicInstructions),
      revisions: [],
      revisionsUsed: 0,
      createdAt: new Date().toISOString(),
      monthYear: format(new Date(), "yyyy-MM")
    };
    
    setCurrentTemplate(template);
    setSelectedRevision(0);
    setIsGenerating(false);
    toast.success("Newsletter template generated successfully!");
  };

  const generateRevision = async () => {
    if (!currentTemplate || !canRevise) return;
    
    setIsGenerating(true);
    
    // Simulate API call for revision
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRevision = generateNewsletterContent(
      approvedVideos.find(v => v.id === currentTemplate.videoId)!,
      basicInstructions,
      currentTemplate.revisionsUsed + 1
    );
    
    const updatedTemplate = {
      ...currentTemplate,
      revisions: [...currentTemplate.revisions, newRevision],
      revisionsUsed: currentTemplate.revisionsUsed + 1
    };
    
    setCurrentTemplate(updatedTemplate);
    setSelectedRevision(updatedTemplate.revisions.length);
    setIsGenerating(false);
    toast.success("New revision generated!");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Template copied to clipboard!");
  };

  const getCurrentContent = () => {
    if (!currentTemplate) return "";
    if (selectedRevision === 0) return currentTemplate.content;
    return currentTemplate.revisions[selectedRevision - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Newsletter Template Generator</h2>
          <p className="text-muted-foreground">
            Generate email newsletter templates from your approved videos
          </p>
        </div>
        <Badge variant={canGenerate ? "default" : "destructive"}>
          {creditsUsed}/{monthlyCredits} Credits Used
        </Badge>
      </div>

      {basicInstructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{basicInstructions}</p>
          </CardContent>
        </Card>
      )}

      {!canGenerate && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              You have reached your monthly limit of {monthlyCredits} newsletter templates.
              Your credits will reset next month.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Selection */}
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {approvedVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVideo?.id === video.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedVideo(video)}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedVideo && canGenerate && (
              <Button 
                onClick={() => generateTemplate(selectedVideo)}
                disabled={isGenerating}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Newsletter Template"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Template Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Newsletter Template
              {currentTemplate && (
                <div className="flex gap-2">
                  {canRevise && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateRevision}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Revise ({3 - currentTemplate.revisionsUsed} left)
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(getCurrentContent())}
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTemplate ? (
              <div className="space-y-4">
                {/* Version Selector */}
                {currentTemplate.revisions.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedRevision === 0 ? "default" : "outline"}
                      onClick={() => setSelectedRevision(0)}
                    >
                      Original
                    </Button>
                    {currentTemplate.revisions.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={selectedRevision === index + 1 ? "default" : "outline"}
                        onClick={() => setSelectedRevision(index + 1)}
                      >
                        Revision {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Template Content */}
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {getCurrentContent()}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isGenerating ? "Generating template..." : "Select a video to generate template"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to generate newsletter content
function generateNewsletterContent(video: Video, instructions: string, revision = 0): string {
  const variations = [
    // Original
    `Subject: ${video.title} - Weekly Update

Hi [First Name],

Hope you're having a great week! I wanted to share something exciting with you.

${video.aiContent?.hook || "Check out our latest content that I think you'll find valuable."}

🎥 ${video.title}

${video.description || "This content covers important insights that can help you in your journey."}

${video.aiContent?.caption || "Here's what makes this special..."}

${video.aiContent?.cta || "Take a look and let me know what you think!"}

Best regards,
[Your Name]

P.S. ${video.aiContent?.emailCopy?.split('\n')[0] || "Don't miss out on this valuable content!"}`,

    // Revision 1
    `Subject: 🚀 ${video.title} - You Won't Want to Miss This

Hey [First Name],

Quick question - ${video.aiContent?.hook || "are you ready for something game-changing?"}

I just dropped new content that I'm really excited about:

"${video.title}"

${video.description || "This dives deep into strategies that can transform your approach."}

Here's the thing: ${video.aiContent?.caption || "this isn't just another piece of content."}

${video.aiContent?.cta || "Check it out and see how it can help you!"}

Talk soon,
[Your Name]`,

    // Revision 2
    `Subject: Personal Note About ${video.title}

[First Name],

I've been working on something that I think you'll really appreciate.

${video.aiContent?.hook || "You know how we're always looking for better ways to approach challenges?"}

Well, I created "${video.title}" specifically with people like you in mind.

What you'll discover:
${video.description || "• Key insights that make a real difference\n• Practical strategies you can implement today\n• A fresh perspective on common challenges"}

${video.aiContent?.caption || "This content represents hours of research and real-world application."}

${video.aiContent?.cta || "I'd love to hear your thoughts after you check it out."}

Best,
[Your Name]

P.S. This is exactly the kind of content that has helped our community achieve remarkable results.`,

    // Revision 3
    `Subject: [First Name], This Changed Everything

Hi there,

${video.aiContent?.hook || "Sometimes a single piece of content can shift your entire perspective."}

That's exactly what happened when I created "${video.title}".

${video.description || "This content explores breakthrough concepts that challenge conventional thinking."}

Why am I sharing this with you?

Because ${video.aiContent?.caption || "I believe you're someone who values growth and isn't afraid to think differently."}

${video.aiContent?.cta || "Dive in when you have a moment and let me know what resonates with you."}

Cheers,
[Your Name]

P.S. ${video.aiContent?.emailCopy?.split('.')[0] + '.' || "The feedback on this has been incredible."}`
  ];

  return variations[revision] || variations[0];
}
