
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratedScript, ScrollSpeed } from "@/types/script";
import { TeleprompterCountdown } from "./TeleprompterCountdown";
import { TeleprompterHeader } from "./TeleprompterHeader";
import { TeleprompterContent } from "./TeleprompterContent";
import { TeleprompterControls } from "./TeleprompterControls";
import { useTeleprompterScroll } from "./useTeleprompterScroll";

interface TeleprompterProps {
  script: GeneratedScript;
  onClose: () => void;
}

export function Teleprompter({ script, onClose }: TeleprompterProps) {
  const [countdown, setCountdown] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<ScrollSpeed>('normal');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`;
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
    setScrollPosition(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    stopAnimation();
  };

  const handleScrollEnd = () => {
    setIsPlaying(false);
  };

  const handleScrollPositionChange = (position: number) => {
    setScrollPosition(position);
  };

  // Calculate current line based on scroll position
  const getCurrentLineIndex = () => {
    if (!contentRef.current || !scrollContainerRef.current) return 0;
    
    const container = scrollContainerRef.current;
    const containerHeight = container.clientHeight;
    const centerPosition = container.scrollTop + (containerHeight / 2);
    
    const lineElements = contentRef.current.children;
    for (let i = 0; i < lineElements.length; i++) {
      const element = lineElements[i] as HTMLElement;
      const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.offsetHeight;
      
      if (centerPosition >= elementTop && centerPosition <= elementBottom) {
        return i;
      }
    }
    
    return 0;
  };

  const currentLineIndex = getCurrentLineIndex();

  const { stopAnimation } = useTeleprompterScroll({
    isPlaying,
    isCountingDown,
    scrollSpeed,
    scrollContainerRef,
    contentRef,
    onScrollEnd: handleScrollEnd,
    onScrollPositionChange: handleScrollPositionChange
  });

  // Start countdown when component mounts
  useEffect(() => {
    startCountdown();
    
    return () => {
      stopAnimation();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <Card className="w-full max-w-5xl h-[95vh] m-4 bg-black border-gray-800">
        <CardContent className="p-0 h-full flex flex-col bg-black">
          <TeleprompterHeader
            scrollSpeed={scrollSpeed}
            onScrollSpeedChange={setScrollSpeed}
            onClose={onClose}
          />

          <TeleprompterCountdown
            countdown={countdown}
            isVisible={isCountingDown}
          />

          <TeleprompterContent
            ref={{ current: { scrollContainer: scrollContainerRef.current, content: contentRef.current } }}
            script={script}
            currentLineIndex={currentLineIndex}
            isPlaying={isPlaying}
            isCountingDown={isCountingDown}
          />

          <TeleprompterControls
            isPlaying={isPlaying}
            isCountingDown={isCountingDown}
            countdown={countdown}
            onTogglePlayPause={togglePlayPause}
            onRestart={restart}
          />
        </CardContent>
      </Card>
    </div>
  );
}
