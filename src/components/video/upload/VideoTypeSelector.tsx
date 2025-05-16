
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VideoTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  videoTypes: string[];
  disabled?: boolean;
}

export function VideoTypeSelector({ 
  value, 
  onChange, 
  videoTypes,
  disabled = false
}: VideoTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="video-type">Content Type</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="video-type" className="w-full">
          <SelectValue placeholder="Select a content type" />
        </SelectTrigger>
        <SelectContent>
          {videoTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
