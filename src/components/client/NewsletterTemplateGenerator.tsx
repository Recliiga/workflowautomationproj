
import { Video } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoSelector } from "./components/VideoSelector";
import { TemplateDisplay } from "./components/TemplateDisplay";
import { GenerationDialog } from "./components/GenerationDialog";
import { useNewsletterGeneration } from "./hooks/useNewsletterGeneration";

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
  const {
    selectedVideo,
    currentTemplate,
    isGenerating,
    selectedRevision,
    showConfirmDialog,
    currentCreditsUsed,
    isContentExpanded,
    canGenerate,
    canRevise,
    handleGenerateClick,
    handleVideoSelect,
    confirmGenerate,
    generateRevision,
    getCurrentContent,
    setShowConfirmDialog,
    setSelectedRevision
  } = useNewsletterGeneration(approvedVideos, monthlyCredits, creditsUsed, basicInstructions);

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
          {currentCreditsUsed}/{monthlyCredits} Credits Used
        </Badge>
      </div>

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
        <VideoSelector
          approvedVideos={approvedVideos}
          selectedVideo={selectedVideo}
          isContentExpanded={isContentExpanded}
          canGenerate={canGenerate}
          isGenerating={isGenerating}
          onVideoSelect={handleVideoSelect}
          onGenerateClick={handleGenerateClick}
        />

        <TemplateDisplay
          currentTemplate={currentTemplate}
          selectedRevision={selectedRevision}
          isGenerating={isGenerating}
          canRevise={canRevise}
          getCurrentContent={getCurrentContent}
          onGenerateRevision={generateRevision}
          onSetSelectedRevision={setSelectedRevision}
        />
      </div>

      <GenerationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedVideo={selectedVideo}
        currentCreditsUsed={currentCreditsUsed}
        monthlyCredits={monthlyCredits}
        onConfirm={confirmGenerate}
      />
    </div>
  );
}
