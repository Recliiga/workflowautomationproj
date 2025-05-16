
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Edit, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
  const [newType, setNewType] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddType = () => {
    if (!newType.trim()) {
      toast.error("Video type cannot be empty");
      return;
    }
    
    if (videoTypes.includes(newType.trim())) {
      toast.error("This video type already exists");
      return;
    }
    
    const updatedTypes = [...videoTypes, newType.trim()].sort((a, b) => a.localeCompare(b));
    setVideoTypes(updatedTypes);
    setNewType("");
    
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

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(videoTypes[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast.error("Video type cannot be empty");
      return;
    }
    
    if (editingIndex !== null) {
      const updatedTypes = [...videoTypes];
      updatedTypes[editingIndex] = editValue.trim();
      const sortedTypes = updatedTypes.sort((a, b) => a.localeCompare(b));
      
      setVideoTypes(sortedTypes);
      setEditingIndex(null);
      
      if (onTypesChange) {
        onTypesChange(sortedTypes);
      }
      
      toast.success(`Video type updated ${clientName ? `for ${clientName}` : ''}`);
    }
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
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new video type"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddType} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b font-medium text-sm">
              Available Video Types
              {clientName && <span className="ml-1 text-muted-foreground">for {clientName}</span>}
            </div>
            <ul className="divide-y">
              {videoTypes.map((type, index) => (
                <li key={`${type}-${index}`} className="px-4 py-2 flex items-center justify-between">
                  {editingIndex === index ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleSaveEdit}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{type}</span>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStartEdit(index)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteType(index)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {videoTypes.length === 0 && (
                <li className="px-4 py-6 text-center text-muted-foreground">
                  No video types available. Add one above.
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
