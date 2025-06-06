
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowLeft } from "lucide-react";
import { GeneratedScript } from "@/types/script";
import { toast } from "sonner";

interface FinalScriptViewProps {
  script: GeneratedScript;
  onBack: () => void;
  onNewScript: () => void;
}

export function FinalScriptView({ script, onBack, onNewScript }: FinalScriptViewProps) {
  const [fullScript] = useState(() => {
    return `${script.hook}\n\n${script.body}\n\n${script.cta}`;
  });

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(fullScript);
      toast.success("Script copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy script to clipboard");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
            <CardTitle>Final Script</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopyScript}
              variant="outline"
              size="sm"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Script
            </Button>
            <Button onClick={onNewScript} variant="outline" size="sm">
              Generate New Script
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            value={fullScript}
            readOnly
            rows={20}
            className="resize-none text-base bg-gray-50 font-mono"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Topic:</strong> {script.topic} | <strong>Duration:</strong> {script.duration} seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
