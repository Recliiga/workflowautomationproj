
import { useState } from "react";
import { NewsletterSettings } from "@/types/newsletter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface NewsletterSettingsTabProps {
  clientId: string;
  clientName: string;
}

export function NewsletterSettingsTab({ clientId, clientName }: NewsletterSettingsTabProps) {
  const [settings, setSettings] = useState<NewsletterSettings>({
    basicInstructions: "Create engaging email newsletter templates based on approved video content. Focus on compelling subject lines, clear value propositions, and strong calls-to-action.",
    examples: [
      "Subject: 🚀 This Changed Everything for Our Clients\n\nHey [First Name],\n\nI wanted to share something that's been getting incredible results...\n\n[Video content summary]\n\nThe response has been amazing - people are saying this is exactly what they needed to hear.\n\nCheck it out here: [Link]\n\nLet me know what you think!\n\nBest,\n[Your Name]",
      "Subject: Personal Note About [Video Title]\n\n[First Name],\n\nI've been working on something that I think you'll really appreciate.\n\n[Video hook/teaser]\n\nWhat you'll discover:\n• Key insight #1\n• Practical strategy #2\n• Game-changing perspective #3\n\nThis represents hours of research and real-world application.\n\nTake a look: [Link]\n\nTalk soon,\n[Your Name]"
    ],
    monthlyCredits: 2
  });

  const [newExample, setNewExample] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleInstructionsChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      basicInstructions: value
    }));
  };

  const handleCreditsChange = (value: string) => {
    const credits = parseInt(value) || 0;
    setSettings(prev => ({
      ...prev,
      monthlyCredits: Math.max(0, credits)
    }));
  };

  const addExample = () => {
    if (newExample.trim()) {
      setSettings(prev => ({
        ...prev,
        examples: [...prev.examples, newExample.trim()]
      }));
      setNewExample("");
    }
  };

  const removeExample = (index: number) => {
    setSettings(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would save to database
    console.log("Saving newsletter settings for client:", clientId, settings);
    
    setIsSaving(false);
    toast.success("Newsletter settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Newsletter Template Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure newsletter template generation for {clientName}
        </p>
      </div>

      {/* Monthly Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="credits">Monthly Newsletter Template Credits</Label>
            <Input
              id="credits"
              type="number"
              min="0"
              value={settings.monthlyCredits}
              onChange={(e) => handleCreditsChange(e.target.value)}
              placeholder="Number of templates per month"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of newsletter templates the client can generate per month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instructions">Newsletter Generation Instructions</Label>
            <Textarea
              id="instructions"
              value={settings.basicInstructions}
              onChange={(e) => handleInstructionsChange(e.target.value)}
              placeholder="Enter instructions for newsletter template generation..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              These instructions will guide the AI when generating newsletter templates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Newsletter Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {settings.examples.map((example, index) => (
              <div key={index} className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Example {index + 1}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeExample(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="bg-background p-3 rounded border">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{example}</pre>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="newExample">Add New Newsletter Example</Label>
            <Textarea
              id="newExample"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Paste your newsletter example here...&#10;&#10;Include subject line, body text, and any formatting you want to preserve."
              rows={8}
            />
            <Button onClick={addExample} disabled={!newExample.trim()} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Newsletter Example
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
