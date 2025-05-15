
export interface FileWithPreview extends File {
  id: string;
  previewUrl: string;
}

export interface FileMetadata {
  title: string;
  description: string;
  notes: string;
}

export interface SubmissionData {
  title: string;
  description: string;
  notes: string;
  videoType: string;
  targetDate: Date | undefined;
}

export interface MetadataRecord {
  [key: string]: FileMetadata;
}
