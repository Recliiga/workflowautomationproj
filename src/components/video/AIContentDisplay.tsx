
import { useState } from "react";
import { Check, Copy, Edit, Save, X } from "lucide-react";
import { AIContent } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AIContentDisplayProps {
  content: AIContent;
  videoId: string;
  editable?: boolean;
  onUpdate?: (videoId: string, updatedContent: AIContent) => void;
}

export function AIContentDisplay({ 
  content, 
  videoId,
  editable = false,
  onUpdate
}: AIContentDisplayProps) {
  const [editMode, setEditMode] = useState(false);
  const [localContent, setLocalContent] = useState<AIContent>(content);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setLocalContent(content);
    setEditMode(false);
  };

  const handleSave = () => {
    onUpdate?.(videoId, localContent);
    setEditMode(false);
    toast.success("Content updated successfully!");
  };

  const handleChange = (field: keyof AIContent, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderContentBlock = (
    field: keyof AIContent,
    label: string,
    value: string
  ) => {
    if (editMode) {
      return (
        <div>
          <label className="text-sm font-medium">{label}</label>
          <Textarea
            value={localContent[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mt-1 h-24"
          />
        </div>
      );
    }

    return (
      <div className="p-3 border rounded-md bg-secondary/30">
        <div className="flex justify-between items-center mb-1">
          <h5 className="text-sm font-medium">{label}</h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(value, label)}
            className="h-7 w-7 p-0"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm whitespace-pre-line">{value}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {editMode ? (
        <div className="flex justify-end space-x-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      ) : (
        editable && (
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Content
            </Button>
          </div>
        )
      )}

      {renderContentBlock("hook", "Hook", content.hook)}
      {renderContentBlock("caption", "Caption", content.caption)}
      {renderContentBlock("cta", "Call to Action", content.cta)}
      {renderContentBlock("emailCopy", "Email Copy", content.emailCopy)}
    </div>
  );
}
