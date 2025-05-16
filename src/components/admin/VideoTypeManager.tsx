
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { VideoTypeList } from "./video-types/VideoTypeList";
import { VideoTypeForm } from "./video-types/VideoTypeForm";

interface VideoTypeManagerProps {
  initialTypes?: string[];
  onTypesChange?: (types: string[]) => void;
  clientId?: string;
  clientName?: string;
}

export function VideoTypeManager({ 
  initialTypes = [
    "Dialogue",
    "Evergreen Content",
    "Exercises",
    "Huge Client Win",
    "Partnership/Sponsorship",
    "Testimonial"
  ], 
  onTypesChange,
  clientId,
  clientName
}: VideoTypeManagerProps) {
  const [videoTypes, setVideoTypes] = useState<string[]>(
    initialTypes.sort((a, b) => a.localeCompare(b))
  );

  const handleAddType = (newType: string) => {
    if (videoTypes.includes(newType)) {
      toast.error("This video type already exists");
      return;
    }
    
    const updatedTypes = [...videoTypes, newType].sort((a, b) => a.localeCompare(b));
    setVideoTypes(updatedTypes);
    
    if (onTypesChange) {
      onTypesChange(updatedTypes);
    }
    
    toast.success(`Video type added ${clientName ? `for ${clientName}` : ''}`);
  };

  const handleDeleteType = (index: number) => {
    const updatedTypes = videoTypes.filter((_, i) => i !== index);
    setVideoTypes(updatedTypes);
    
    if (onTypesChange) {
      onTypesChange(updatedTypes);
    }
    
    toast.success(`Video type removed ${clientName ? `for ${clientName}` : ''}`);
  };

  const handleEditType = (index: number, newValue: string) => {
    if (!newValue.trim()) {
      toast.error("Video type cannot be empty");
      return;
    }
    
    const updatedTypes = [...videoTypes];
    updatedTypes[index] = newValue.trim();
    const sortedTypes = updatedTypes.sort((a, b) => a.localeCompare(b));
    
    setVideoTypes(sortedTypes);
    
    if (onTypesChange) {
      onTypesChange(sortedTypes);
    }
    
    toast.success(`Video type updated ${clientName ? `for ${clientName}` : ''}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {clientName 
            ? `Manage Video Types for ${clientName}` 
            : "Manage Video Types"}
        </CardTitle>
        <CardDescription>
          {clientName 
            ? `Add, edit, or remove video types available to ${clientName} when uploading videos`
            : "Add, edit, or remove video types available to clients when uploading videos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <VideoTypeForm onAddType={handleAddType} />
          
          <VideoTypeList 
            videoTypes={videoTypes}
            clientName={clientName}
            onDeleteType={handleDeleteType}
            onEditType={handleEditType}
          />
        </div>
      </CardContent>
    </Card>
  );
}
