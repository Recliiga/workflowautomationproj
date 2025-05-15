
// We need to update the SubmissionData type to match the new structure
export interface FileWithPreview extends File {
  preview: string;
  id: string;
}

export interface FileMetadata {
  title: string;
  description: string;
}

export interface MetadataRecord {
  [key: string]: FileMetadata;
}

export interface SubmissionData {
  title: string;
  description: string;
  notes?: string; // Make notes optional
  videoType: string;
  targetDate: Date | undefined;
}
