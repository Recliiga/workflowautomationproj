
import { useState, useRef } from "react";
import { Upload, X, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NotificationBanner } from "@/components/ui/notification-banner";

interface FileWithPreview extends File {
  id: string;
  previewUrl: string;
}

interface FileUploadModuleProps {
  maxFiles?: number;
  onFilesSelected: (files: File[], metadata: { [key: string]: { title: string; description: string; notes: string } }) => void;
  className?: string;
}

export function FileUploadModule({ 
  maxFiles = 5, 
  onFilesSelected,
  className
}: FileUploadModuleProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ [key: string]: { title: string; description: string; notes: string } }>({});
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} videos.`);
      return;
    }

    const videoFiles = Array.from(files).filter(
      file => file.type.startsWith('video/')
    );

    if (videoFiles.length !== files.length) {
      setError('Only video files are allowed.');
      return;
    }

    const newFiles = videoFiles.map(file => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      
      // Initialize metadata for new file
      setMetadata(prev => ({
        ...prev,
        [id]: { title: '', description: '', notes: '' }
      }));
      
      return Object.assign(file, { id, previewUrl });
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    setMetadata(prev => {
      const newMetadata = { ...prev };
      delete newMetadata[id];
      return newMetadata;
    });
  };

  const updateMetadata = (id: string, field: 'title' | 'description' | 'notes', value: string) => {
    setMetadata(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const invalidFiles = uploadedFiles.filter(file => !metadata[file.id]?.title);
    if (invalidFiles.length > 0) {
      setError('All videos must have a title.');
      return;
    }

    onFilesSelected(uploadedFiles, metadata);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {error && (
        <NotificationBanner
          message={error}
          type="error"
          onDismiss={() => setError(null)}
        />
      )}
      
      <div
        onDragEnter={handleDrag}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors",
          dragActive 
            ? "border-accent bg-accent/5" 
            : "border-border hover:border-accent/50 hover:bg-accent/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Drag and drop video files</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            or click to browse (max {maxFiles} files)
          </p>
          <Button 
            variant="outline" 
            onClick={() => inputRef.current?.click()}
            className="mt-2"
          >
            Select Files
          </Button>
        </div>
      </div>
      
      {/* Drag and drop event handlers */}
      {dragActive && (
        <div
          className="absolute inset-0 z-10"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
      
      {/* List of uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Uploaded Videos ({uploadedFiles.length}/{maxFiles})</h3>
          
          <div className="space-y-6">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center mr-3">
                      <FileVideo className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[180px] sm:max-w-xs">
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
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Video preview */}
                <div className="mb-4">
                  <video
                    src={file.previewUrl}
                    controls
                    className="rounded-md max-h-[200px] w-full object-cover"
                  />
                </div>
                
                {/* Metadata form */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`title-${file.id}`} className="text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id={`title-${file.id}`}
                      placeholder="Enter title"
                      value={metadata[file.id]?.title || ''}
                      onChange={(e) => updateMetadata(file.id, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`description-${file.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id={`description-${file.id}`}
                      placeholder="Enter description"
                      value={metadata[file.id]?.description || ''}
                      onChange={(e) => updateMetadata(file.id, 'description', e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`notes-${file.id}`} className="text-sm font-medium">
                      Notes
                    </label>
                    <Textarea
                      id={`notes-${file.id}`}
                      placeholder="Add any notes for the freelancer"
                      value={metadata[file.id]?.notes || ''}
                      onChange={(e) => updateMetadata(file.id, 'notes', e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Video' : 'Videos'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
