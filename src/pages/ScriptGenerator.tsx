
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Input or Generated Script */}
          <div className="h-full">
            {!script ? (
              <ScriptInputForm 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            ) : (
              <ScriptEditor
                script={script}
                onSave={handleSaveScript}
                onOpenTeleprompter={handleOpenTeleprompter}
              />
            )}
          </div>

          {/* Right Side - New Script Button when script exists */}
          {script && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-green-900">Script Ready!</h3>
                <p className="text-sm text-green-800 mb-4">
                  Your script has been generated and is ready for editing. Use the teleprompter feature when you're ready to film.
                </p>
                <Button onClick={handleNewScript} variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  Generate New Script
                </Button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-blue-900">Teleprompter Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 5-second countdown before reading starts</li>
                  <li>• Adjustable reading speed (Slow, Normal, Fast)</li>
                  <li>• Current word highlighting in yellow</li>
                  <li>• Pause/Resume controls</li>
                  <li>• Restart button to begin again</li>
                </ul>
              </div>
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
