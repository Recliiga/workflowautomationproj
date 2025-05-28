
import { NewsletterTemplate } from "@/types/newsletter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TemplateDisplayProps {
  currentTemplate: NewsletterTemplate | null;
  selectedRevision: number;
  isGenerating: boolean;
  canRevise: boolean;
  getCurrentContent: () => string;
  onGenerateRevision: () => void;
  onSetSelectedRevision: (revision: number) => void;
}

export function TemplateDisplay({
  currentTemplate,
  selectedRevision,
  isGenerating,
  canRevise,
  getCurrentContent,
  onGenerateRevision,
  onSetSelectedRevision
}: TemplateDisplayProps) {
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Template copied to clipboard!");
  };

  return (
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
                  onClick={onGenerateRevision}
                  disabled={isGenerating}
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Revise ({2 - currentTemplate.revisionsUsed} left)
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
                  onClick={() => onSetSelectedRevision(0)}
                >
                  Original
                </Button>
                {currentTemplate.revisions.map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={selectedRevision === index + 1 ? "default" : "outline"}
                    onClick={() => onSetSelectedRevision(index + 1)}
                  >
                    Revision {index + 1}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Credit Usage Info */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 This template has used 1 credit. Revisions are free!
              </p>
            </div>
            
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
  );
}
