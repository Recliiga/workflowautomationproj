
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VideoTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  videoTypes: string[];
}

export function VideoTypeSelector({ value, onChange, videoTypes }: VideoTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Video Type</h3>
      <p className="text-sm text-muted-foreground">
        Please select what type of video you want created.
      </p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[250px]">
          <SelectValue placeholder="Select a video type" />
        </SelectTrigger>
        <SelectContent>
          {videoTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
