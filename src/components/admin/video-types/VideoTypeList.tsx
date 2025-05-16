
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, X, Check } from "lucide-react";

interface VideoTypeListProps {
  videoTypes: string[];
  clientName?: string;
  onDeleteType: (index: number) => void;
  onEditType: (index: number, newValue: string) => void;
}

export function VideoTypeList({
  videoTypes,
  clientName,
  onDeleteType,
  onEditType
}: VideoTypeListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(videoTypes[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      onEditType(editingIndex, editValue);
      setEditingIndex(null);
    }
  };

  return (
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
                    onClick={() => onDeleteType(index)}
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
  );
}
