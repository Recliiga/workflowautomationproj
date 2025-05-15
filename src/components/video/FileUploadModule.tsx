
import { useState, useRef } from "react";
import { Upload, X, FileVideo, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface FileWithPreview extends File {
  id: string;
  previewUrl: string;
}

interface FileUploadModuleProps {
  maxFiles?: number;
  onFilesSelected: (
    files: File[], 
    metadata: { [key: string]: { title: string; description: string; notes: string } },
    submissionData: {
      title: string;
      description: string;
      notes: string;
      videoType: string;
      targetDate: Date | undefined;
    }
  ) => void;
  className?: string;
}

// Available video types
const VIDEO_TYPES = [
  "Product Highlight",
  "Behind-the-Scenes",
  "Customer Testimonial",
  "How-To Tutorial",
  "Brand Introduction",
  "Social Media Clip"
];

export function FileUploadModule({ 
  maxFiles = 5, 
  onFilesSelected,
  className
}: FileUploadModuleProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ [key: string]: { title: string; description: string; notes: string } }>({});
  
  // Submission-wide metadata
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [videoType, setVideoType] = useState<string>(VIDEO_TYPES[0]);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  
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
    // Validate required submission-wide fields
    if (!submissionTitle) {
      setError('Submission title is required.');
      return;
    }
    
    if (!submissionDescription) {
      setError('Submission description is required.');
      return;
    }
    
    if (!submissionNotes) {
      setError('Submission notes for the freelancer are required.');
      return;
    }
    
    if (!targetDate) {
      setError('Please select a target content calendar date.');
      return;
    }

    // All validation passed, send data
    onFilesSelected(
      uploadedFiles, 
      metadata, 
      {
        title: submissionTitle,
        description: submissionDescription,
        notes: submissionNotes,
        videoType: videoType,
        targetDate: targetDate
      }
    );
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
      
      {/* Video Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Video Type</h3>
        <p className="text-sm text-muted-foreground">
          Please select what type of video you want created.
        </p>
        <RadioGroup value={videoType} onValueChange={setVideoType} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {VIDEO_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={type.replace(/\s+/g, '-').toLowerCase()} />
              <Label htmlFor={type.replace(/\s+/g, '-').toLowerCase()}>{type}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* File Upload Area */}
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
                
                {/* Optional Metadata form */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`title-${file.id}`} className="text-sm font-medium">
                      Title (Optional)
                    </label>
                    <Input
                      id={`title-${file.id}`}
                      placeholder="Enter title for this video"
                      value={metadata[file.id]?.title || ''}
                      onChange={(e) => updateMetadata(file.id, 'title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`description-${file.id}`} className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <Textarea
                      id={`description-${file.id}`}
                      placeholder="Enter description for this video"
                      value={metadata[file.id]?.description || ''}
                      onChange={(e) => updateMetadata(file.id, 'description', e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`notes-${file.id}`} className="text-sm font-medium">
                      Notes (Optional)
                    </label>
                    <Textarea
                      id={`notes-${file.id}`}
                      placeholder="Add any notes specific to this video"
                      value={metadata[file.id]?.notes || ''}
                      onChange={(e) => updateMetadata(file.id, 'notes', e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Submission-wide required metadata */}
          <div className="rounded-lg border bg-card p-6 space-y-6">
            <h3 className="text-lg font-medium">Submission Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="submission-title" className="text-sm font-medium">
                  Submission Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="submission-title"
                  placeholder="Enter a title for the entire submission"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="submission-description" className="text-sm font-medium">
                  Submission Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="submission-description"
                  placeholder="Describe the purpose of these videos"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="submission-notes" className="text-sm font-medium">
                  Notes for Freelancer <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="submission-notes"
                  placeholder="Provide context and instructions for the freelancer"
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="mt-1 h-24"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Target Date Picker */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium mb-4">Target Calendar Date</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select when you'd like to publish the content. This helps freelancers prioritize urgent videos.
            </p>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Select target date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              Submit {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Video' : 'Videos'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
