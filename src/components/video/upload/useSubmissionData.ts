
import { useState } from "react";

export function useSubmissionData(defaultVideoType: string) {
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [videoType, setVideoType] = useState<string>(defaultVideoType);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const validateSubmission = () => {
    if (!submissionTitle) {
      setError('Submission title is required.');
      return false;
    }
    
    if (!submissionDescription) {
      setError('Video context is required.');
      return false;
    }
    
    if (!videoType) {
      setError('Please select a video type.');
      return false;
    }
    
    if (!targetDate) {
      setError('Please select a target content calendar date.');
      return false;
    }

    return true;
  };

  return {
    submissionTitle,
    setSubmissionTitle,
    submissionDescription,
    setSubmissionDescription,
    submissionNotes,
    setSubmissionNotes,
    videoType,
    setVideoType,
    targetDate,
    setTargetDate,
    error,
    setError,
    validateSubmission
  };
}
