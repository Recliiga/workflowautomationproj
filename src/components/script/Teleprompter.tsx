import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { GeneratedScript, ScrollSpeed } from "@/types/script";
import { getScrollSpeed } from "@/utils/scriptGenerator";

interface TeleprompterProps {
  script: GeneratedScript;
  onClose: () => void;
}

export function Teleprompter({ script, onClose }: TeleprompterProps) {
  const [countdown, setCountdown] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<ScrollSpeed>('normal');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`;
  const words = fullScript.split(/(\s+)/).filter(word => word.length > 0);

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          setIsPlaying(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const togglePlayPause = () => {
    if (isCountingDown) return;
    
    if (!isPlaying && countdown === 0) {
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    setIsPlaying(false);
    setIsCountingDown(false);
    setCountdown(5);
    setCurrentWordIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Handle word progression based on reading speed
  useEffect(() => {
    if (isPlaying && !isCountingDown && currentWordIndex < words.length) {
      const wpm = getScrollSpeed(scrollSpeed);
      const wordsPerSecond = wpm / 60;
      const millisecondsPerWord = 1000 / wordsPerSecond;
      
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => {
          const nextIndex = prev + 1;
          
          // Auto-scroll to keep current word visible
          if (wordsRef.current[nextIndex]) {
            const wordElement = wordsRef.current[nextIndex];
            const container = scrollContainerRef.current;
            if (container && wordElement) {
              const containerRect = container.getBoundingClientRect();
              const wordRect = wordElement.getBoundingClientRect();
              
              if (wordRect.bottom > containerRect.bottom - 100) {
                container.scrollTop += wordRect.bottom - containerRect.bottom + 100;
              }
            }
          }
          
          if (nextIndex >= words.length) {
            setIsPlaying(false);
          }
          
          return nextIndex;
        });
      }, millisecondsPerWord);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentWordIndex, words.length, scrollSpeed, isCountingDown]);

  // Start countdown when component mounts
  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[90vh] m-4">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Teleprompter</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <Select value={scrollSpeed} onValueChange={(value: ScrollSpeed) => setScrollSpeed(value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Countdown Overlay */}
          {isCountingDown && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-white text-center">
                <div className="text-8xl font-bold mb-4">{countdown}</div>
                <div className="text-xl">Get ready...</div>
              </div>
            </div>
          )}

          {/* Script Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-auto bg-black text-white p-8"
          >
            <div className="text-center space-y-8">
              <div className="text-2xl md:text-3xl lg:text-4xl leading-relaxed">
                {words.map((word, index) => (
                  <span
                    key={index}
                    ref={el => {
                      if (el) wordsRef.current[index] = el;
                    }}
                    className={`${
                      index === currentWordIndex && isPlaying && !isCountingDown
                        ? 'bg-yellow-400 text-black'
                        : index < currentWordIndex
                        ? 'text-gray-400'
                        : 'text-white'
                    } ${word.includes('\n') ? 'block' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
              <div className="h-screen"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 p-4 border-t">
            <Button
              onClick={togglePlayPause}
              disabled={isCountingDown}
              size="lg"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              onClick={restart}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
