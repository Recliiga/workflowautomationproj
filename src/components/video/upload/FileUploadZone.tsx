
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  maxFiles: number;
  disabled?: boolean;
}

export function FileUploadZone({ onFilesSelected, maxFiles, disabled = false }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <>
      <div
        onDragEnter={disabled ? undefined : handleDrag}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors",
          dragActive 
            ? "border-accent bg-accent/5" 
            : "border-border hover:border-accent/50 hover:bg-accent/5",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Drag and drop video or image files</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            or click to browse (max {maxFiles} files)
          </p>
          <Button 
            variant="outline" 
            onClick={() => !disabled && inputRef.current?.click()}
            className="mt-2"
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>
      </div>
      
      {/* Drag and drop event handlers */}
      {dragActive && !disabled && (
        <div
          className="absolute inset-0 z-10"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </>
  );
}
