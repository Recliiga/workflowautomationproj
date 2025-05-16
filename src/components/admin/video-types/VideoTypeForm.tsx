
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface VideoTypeFormProps {
  onAddType: (type: string) => void;
}

export function VideoTypeForm({ onAddType }: VideoTypeFormProps) {
  const [newType, setNewType] = useState("");

  const handleAddType = () => {
    if (!newType.trim()) {
      toast.error("Video type cannot be empty");
      return;
    }
    
    onAddType(newType.trim());
    setNewType("");
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
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
  );
}
