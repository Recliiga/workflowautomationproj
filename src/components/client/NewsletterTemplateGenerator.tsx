
import { Video } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoSelector } from "./components/VideoSelector";
import { TemplateDisplay } from "./components/TemplateDisplay";
import { GenerationDialog } from "./components/GenerationDialog";
import { useNewsletterGeneration } from "./hooks/useNewsletterGeneration";
import { useState } from "react";

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
    generatedTemplates,
    showNewsletterModal,
    selectedNewsletterVideoId,
    handleGenerateClick,
    handleVideoSelect,
    handleViewNewsletter,
    confirmGenerate,
    generateRevision,
    getCurrentContent,
    setShowConfirmDialog,
    setSelectedRevision,
    setShowNewsletterModal
  } = useNewsletterGeneration(approvedVideos, monthlyCredits, creditsUsed, basicInstructions);

  const selectedNewsletterTemplate = selectedNewsletterVideoId ? generatedTemplates[selectedNewsletterVideoId] : null;
  const [modalSelectedRevision, setModalSelectedRevision] = useState(0);

  const getModalContent = () => {
    if (!selectedNewsletterTemplate) return "";
    if (modalSelectedRevision === 0) return selectedNewsletterTemplate.content;
    return selectedNewsletterTemplate.revisions[modalSelectedRevision - 1];
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
        <div className="bg-muted px-4 py-2 rounded-lg border">
          <div className="text-sm font-medium">
            Monthly Credits {currentCreditsUsed}/{monthlyCredits}
          </div>
        </div>
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
          generatedTemplates={generatedTemplates}
          onViewNewsletter={handleViewNewsletter}
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

      <Dialog open={showNewsletterModal} onOpenChange={setShowNewsletterModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Newsletter Template</DialogTitle>
          </DialogHeader>
          {selectedNewsletterTemplate && (
            <div className="space-y-4">
              {/* Version Selector */}
              {selectedNewsletterTemplate.revisions.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={modalSelectedRevision === 0 ? "default" : "outline"}
                    onClick={() => setModalSelectedRevision(0)}
                  >
                    Original
                  </Button>
                  {selectedNewsletterTemplate.revisions.map((_, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={modalSelectedRevision === index + 1 ? "default" : "outline"}
                      onClick={() => setModalSelectedRevision(index + 1)}
                    >
                      Revision {index + 1}
                    </Button>
                  ))}
                </div>
              )}
              
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
                  {getModalContent()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
