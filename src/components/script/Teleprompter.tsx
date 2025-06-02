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
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`;
  // Split into lines and filter out empty lines
  const lines = fullScript.split('\n').filter(line => line.trim().length > 0);

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
    setCurrentLineIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Handle line progression based on reading speed
  useEffect(() => {
    if (isPlaying && !isCountingDown && currentLineIndex < lines.length) {
      const wpm = getScrollSpeed(scrollSpeed);
      const wordsPerMinute = wpm;
      
      // Calculate time per line based on word count
      const currentLine = lines[currentLineIndex];
      const wordsInLine = currentLine.split(' ').length;
      const millisecondsPerLine = (wordsInLine / wordsPerMinute) * 60 * 1000;
      
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => {
          const nextIndex = prev + 1;
          
          // Auto-scroll to keep current line in center view
          if (linesRef.current[nextIndex]) {
            const lineElement = linesRef.current[nextIndex];
            const container = scrollContainerRef.current;
            if (container && lineElement) {
              const containerHeight = container.clientHeight;
              const lineTop = lineElement.offsetTop;
              const lineHeight = lineElement.clientHeight;
              
              // Scroll to keep the current line in the center of the view
              const scrollTo = lineTop - (containerHeight / 2) + (lineHeight / 2);
              container.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
              });
            }
          }
          
          if (nextIndex >= lines.length) {
            setIsPlaying(false);
          }
          
          return nextIndex;
        });
      }, millisecondsPerLine);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentLineIndex, lines.length, scrollSpeed, isCountingDown]);

  // Start countdown when component mounts
  useEffect(() => {
    startCountdown();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <Card className="w-full max-w-5xl h-[95vh] m-4 bg-black border-gray-800">
        <CardContent className="p-0 h-full flex flex-col bg-black">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
            <h2 className="text-lg font-semibold text-white">Teleprompter</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Speed:</span>
                <Select value={scrollSpeed} onValueChange={(value: ScrollSpeed) => setScrollSpeed(value)}>
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

          {/* Countdown Overlay */}
          {isCountingDown && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-white text-center">
                <div className="text-9xl font-bold mb-6 text-green-400">{countdown}</div>
                <div className="text-2xl text-gray-300">Get ready to read...</div>
              </div>
            </div>
          )}

          {/* Script Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-auto bg-black text-white p-8 relative"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Top padding for centering */}
            <div className="h-1/2"></div>
            
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              {lines.map((line, index) => (
                <div
                  key={index}
                  ref={el => {
                    if (el) linesRef.current[index] = el;
                  }}
                  className={`text-3xl md:text-4xl lg:text-5xl leading-relaxed font-light transition-all duration-300 py-3 px-6 rounded-lg ${
                    index === currentLineIndex && isPlaying && !isCountingDown
                      ? 'bg-blue-600/20 text-blue-100 border-l-4 border-blue-400 shadow-lg'
                      : index < currentLineIndex
                      ? 'text-gray-500'
                      : 'text-white'
                  }`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '0.01em'
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
            
            {/* Bottom padding for centering */}
            <div className="h-1/2"></div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 p-6 border-t border-gray-800 bg-gray-900">
            <Button
              onClick={togglePlayPause}
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
              onClick={restart}
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
            >
              <RotateCcw className="h-6 w-6 mr-2" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
