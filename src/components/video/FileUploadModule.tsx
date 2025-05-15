
import { useState } from "react";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { cn } from "@/lib/utils";
import { VideoTypeSelector } from "./upload/VideoTypeSelector";
import { FileUploadZone } from "./upload/FileUploadZone";
import { VideoCarousel } from "./upload/VideoCarousel";
import { SubmissionForm } from "./upload/SubmissionForm";

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
  videoTypes?: string[];
}

// Default video types (if not provided)
const DEFAULT_VIDEO_TYPES = [
  "Dialogue",
  "Evergreen Content",
  "Exercises", 
  "Huge Client Win",
  "Partnership/Sponsorship",
  "Testimonial"
].sort();

export function FileUploadModule({ 
  maxFiles = 5, 
  onFilesSelected,
  className,
  videoTypes = DEFAULT_VIDEO_TYPES
}: FileUploadModuleProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ [key: string]: { title: string; description: string; notes: string } }>({});
  
  // Submission-wide metadata
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [videoType, setVideoType] = useState<string>(videoTypes[0] || "");
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);

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
      setError('Video context is required.');
      return;
    }
    
    if (!submissionNotes) {
      setError('Submission notes for the freelancer are required.');
      return;
    }
    
    if (!videoType) {
      setError('Please select a video type.');
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
      <VideoTypeSelector
        value={videoType}
        onChange={setVideoType}
        videoTypes={videoTypes}
      />
      
      {/* File Upload Area */}
      <FileUploadZone
        onFilesSelected={handleFiles}
        maxFiles={maxFiles}
      />
      
      {/* List of uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Uploaded Videos ({uploadedFiles.length}/{maxFiles})</h3>
          
          <VideoCarousel
            files={uploadedFiles}
            metadata={metadata}
            onRemove={removeFile}
            onMetadataChange={updateMetadata}
          />
          
          <SubmissionForm
            title={submissionTitle}
            description={submissionDescription}
            notes={submissionNotes}
            targetDate={targetDate}
            onTitleChange={setSubmissionTitle}
            onDescriptionChange={setSubmissionDescription}
            onNotesChange={setSubmissionNotes}
            onTargetDateChange={setTargetDate}
            onSubmit={handleSubmit}
            filesCount={uploadedFiles.length}
          />
        </div>
      )}
    </div>
  );
}
