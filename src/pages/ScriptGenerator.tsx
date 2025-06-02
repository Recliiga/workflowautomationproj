
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScriptInputForm } from "@/components/script/ScriptInputForm";
import { ScriptEditor } from "@/components/script/ScriptEditor";
import { Teleprompter } from "@/components/script/Teleprompter";
import { GeneratedScript, ScriptInput } from "@/types/script";
import { generateScript } from "@/utils/scriptGenerator";
import { toast } from "sonner";

export default function ScriptGenerator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const handleGenerate = async (input: ScriptInput) => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedScript = generateScript(input);
      setScript(generatedScript);
      toast.success("Script generated successfully!");
    } catch (error) {
      toast.error("Failed to generate script. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScript = (updatedScript: GeneratedScript) => {
    setScript(updatedScript);
    toast.success("Script saved successfully!");
  };

  const handleOpenTeleprompter = () => {
    setShowTeleprompter(true);
  };

  const handleCloseTeleprompter = () => {
    setShowTeleprompter(false);
  };

  const handleNewScript = () => {
    setScript(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Script Generator</h2>
          <p className="text-muted-foreground">
            Generate video scripts with built-in teleprompter functionality
          </p>
        </div>

        {/* Full width content */}
        <div>
          {!script ? (
            <div className="max-w-2xl mx-auto">
              <ScriptInputForm 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Generated Script</h3>
                <Button onClick={handleNewScript} variant="outline">
                  Generate New Script
                </Button>
              </div>
              <ScriptEditor
                script={script}
                onSave={handleSaveScript}
                onOpenTeleprompter={handleOpenTeleprompter}
              />
            </div>
          )}
        </div>

        {/* Teleprompter Modal */}
        {showTeleprompter && script && (
          <Teleprompter
            script={script}
            onClose={handleCloseTeleprompter}
          />
        )}
      </div>
    </AppLayout>
  );
}
