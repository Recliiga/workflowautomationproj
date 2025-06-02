
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [minutes, setMinutes] = useState<string>("0");
  const [seconds, setSeconds] = useState<string>("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    
    onGenerate({
      topic: topic.trim(),
      duration: Math.min(totalSeconds, 180) // Max 3 minutes
    });
  };

  const canSubmit = topic.trim() && (parseInt(minutes) > 0 || parseInt(seconds) > 0);

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
            <Label>Video Length (Approximate)</Label>
            <div className="flex items-center gap-2">
              <Select value={minutes} onValueChange={setMinutes}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map(min => (
                    <SelectItem key={min} value={min.toString()}>{min}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">minutes</span>
              
              <Select value={seconds} onValueChange={setSeconds}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map(sec => (
                    <SelectItem key={sec} value={sec.toString()}>{sec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

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
