
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Monitor } from "lucide-react";
import { GeneratedScript } from "@/types/script";

interface ScriptEditorProps {
  script: GeneratedScript;
  onSave: (updatedScript: GeneratedScript) => void;
  onOpenTeleprompter: () => void;
}

export function ScriptEditor({ script, onSave, onOpenTeleprompter }: ScriptEditorProps) {
  const [hook, setHook] = useState(script.hook);
  const [body, setBody] = useState(script.body);
  const [cta, setCta] = useState(script.cta);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    const updatedScript = {
      ...script,
      hook,
      body,
      cta
    };
    onSave(updatedScript);
    setHasChanges(false);
  };

  const handleChange = (field: string, value: string) => {
    setHasChanges(true);
    switch (field) {
      case 'hook':
        setHook(value);
        break;
      case 'body':
        setBody(value);
        break;
      case 'cta':
        setCta(value);
        break;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Edit Your Script</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              variant="outline"
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button
              onClick={onOpenTeleprompter}
              size="sm"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Open Teleprompter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hook">Hook Line</Label>
          <Textarea
            id="hook"
            value={hook}
            onChange={(e) => handleChange('hook', e.target.value)}
            placeholder="Enter your hook line..."
            rows={4}
            className="resize-none text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => handleChange('body', e.target.value)}
            placeholder="Enter your main content..."
            rows={12}
            className="resize-none text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cta">Call-to-Action</Label>
          <Textarea
            id="cta"
            value={cta}
            onChange={(e) => handleChange('cta', e.target.value)}
            placeholder="Enter your call-to-action..."
            rows={4}
            className="resize-none text-base"
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
