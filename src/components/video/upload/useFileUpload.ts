
import { useState } from "react";
import { FileWithPreview, MetadataRecord } from "./types";

export function useFileUpload(maxFiles: number) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataRecord>({});
  
  const handleFiles = (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const validFiles = Array.from(files).filter(
      file => file.type.startsWith('video/') || file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      setError('Only video and image files are allowed.');
      return;
    }

    const newFiles = validFiles.map(file => {
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

  return {
    uploadedFiles,
    metadata,
    error,
    setError,
    handleFiles,
    removeFile,
    updateMetadata
  };
}
