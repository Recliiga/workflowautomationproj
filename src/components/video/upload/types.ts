
// We need to update the SubmissionData type to match the new structure
export interface FileWithPreview extends File {
  preview: string;
  id: string;
}

export interface SubmissionData {
  title: string;
  description: string;
  notes: string; // Kept for backward compatibility
  videoType: string;
  targetDate: Date | undefined;
}
