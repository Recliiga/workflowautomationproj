
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FileWithPreview, FileMetadata } from "./types";

interface VideoPreviewProps {
  file: FileWithPreview;
  metadata: FileMetadata;
  onRemove: (id: string) => void;
  onMetadataChange: (id: string, field: 'title' | 'description', value: string) => void;
}

export function VideoPreview({
  file,
  metadata,
  onRemove,
  onMetadataChange
}: VideoPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const isVideo = file.type.startsWith('video/');
  
  return <div className="flex-shrink-0 w-72 border rounded-md overflow-hidden bg-card">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          {isVideo ? <video src={file.preview} className="object-cover w-full h-full" controls /> : <img src={file.preview} alt="Preview" className="object-cover w-full h-full" />}
        </AspectRatio>
        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => onRemove(file.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3 space-y-3">
        <div>
          
          
        </div>
        
        <div>
          <p className="text-xs font-medium">Add Notes</p>
          <Textarea value={metadata.description} onChange={e => onMetadataChange(file.id, 'description', e.target.value)} placeholder="Enter description" className="mt-1 h-20 text-xs" />
        </div>
      </div>
    </div>;
}
