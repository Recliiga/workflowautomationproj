
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { ScriptInput } from "@/types/script";

interface ScriptInputFormProps {
  onGenerate: (input: ScriptInput) => void;
  isGenerating: boolean;
}

export function ScriptInputForm({ onGenerate, isGenerating }: ScriptInputFormProps) {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<string>("30");
  const [customDuration, setCustomDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const finalDuration = duration === "custom" 
      ? parseInt(customDuration) || 30 
      : parseInt(duration);

    onGenerate({
      topic: topic.trim(),
      duration: Math.min(finalDuration, 180) // Max 3 minutes
    });
  };

  const isCustom = duration === "custom";
  const canSubmit = topic.trim() && (!isCustom || customDuration);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Video Script</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Video Topic</Label>
            <Textarea
              id="topic"
              placeholder="Describe what your video should be about..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Video Length</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="45">45 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="custom">Custom (up to 3 minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <div className="space-y-2">
              <Label htmlFor="customDuration">Custom Duration (seconds)</Label>
              <Input
                id="customDuration"
                type="number"
                min="10"
                max="180"
                placeholder="Enter duration in seconds"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!canSubmit || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
