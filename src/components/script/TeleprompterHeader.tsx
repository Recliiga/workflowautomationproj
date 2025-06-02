
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ScrollSpeed } from "@/types/script";

interface TeleprompterHeaderProps {
  scrollSpeed: ScrollSpeed;
  onScrollSpeedChange: (speed: ScrollSpeed) => void;
  onClose: () => void;
}

export function TeleprompterHeader({ scrollSpeed, onScrollSpeedChange, onClose }: TeleprompterHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
      <h2 className="text-lg font-semibold text-white">Teleprompter</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">Speed:</span>
          <Select value={scrollSpeed} onValueChange={onScrollSpeedChange}>
            <SelectTrigger className="w-24 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="slow" className="text-white hover:bg-gray-700">Slow</SelectItem>
              <SelectItem value="normal" className="text-white hover:bg-gray-700">Normal</SelectItem>
              <SelectItem value="fast" className="text-white hover:bg-gray-700">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-800">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
