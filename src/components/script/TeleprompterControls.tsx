
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TeleprompterControlsProps {
  isPlaying: boolean;
  isCountingDown: boolean;
  countdown: number;
  onTogglePlayPause: () => void;
  onRestart: () => void;
}

export function TeleprompterControls({ 
  isPlaying, 
  isCountingDown, 
  countdown, 
  onTogglePlayPause, 
  onRestart 
}: TeleprompterControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 p-6 border-t border-gray-800 bg-gray-900">
      <Button
        onClick={onTogglePlayPause}
        disabled={isCountingDown}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
      >
        {isPlaying ? (
          <>
            <Pause className="h-6 w-6 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-6 w-6 mr-2" />
            {countdown === 0 ? 'Resume' : 'Start'}
          </>
        )}
      </Button>
      <Button
        onClick={onRestart}
        variant="outline"
        size="lg"
        className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
      >
        <RotateCcw className="h-6 w-6 mr-2" />
        Restart
      </Button>
    </div>
  );
}
