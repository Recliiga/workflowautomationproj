
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileVideo, X, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface VideoPreviewProps {
  file: {
    id: string;
    name: string;
    size: number;
    previewUrl: string;
  };
  metadata: {
    notes: string;
  };
  onRemove: (id: string) => void;
  onMetadataChange: (id: string, field: 'notes', value: string) => void;
}

export function VideoPreview({ 
  file, 
  metadata, 
  onRemove, 
  onMetadataChange 
}: VideoPreviewProps) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="flex-shrink-0 w-[250px] rounded-lg border bg-card p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center mr-2">
            <FileVideo className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium truncate max-w-[150px]">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onRemove(file.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Video preview */}
      <div className="mb-3">
        <video
          src={file.previewUrl}
          controls
          className="rounded-md w-full max-h-[120px] object-cover"
        />
      </div>
      
      {/* Optional Notes with toggle */}
      {!showNotes ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs" 
          onClick={() => setShowNotes(true)}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Notes
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`notes-${file.id}`} className="text-xs font-medium">
              Notes for this video
            </Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowNotes(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Textarea
            id={`notes-${file.id}`}
            placeholder="Add any notes specific to this video"
            value={metadata?.notes || ''}
            onChange={(e) => onMetadataChange(file.id, 'notes', e.target.value)}
            className="text-xs h-20 min-h-0"
          />
        </div>
      )}
    </div>
  );
}
