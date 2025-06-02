
import { useEffect, useRef } from "react";
import { ScrollSpeed } from "@/types/script";
import { getScrollSpeed } from "@/utils/scriptGenerator";

interface UseTeleprompterScrollProps {
  isPlaying: boolean;
  isCountingDown: boolean;
  scrollSpeed: ScrollSpeed;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  onScrollEnd: () => void;
  onScrollPositionChange: (position: number) => void;
}

export function useTeleprompterScroll({
  isPlaying,
  isCountingDown,
  scrollSpeed,
  scrollContainerRef,
  contentRef,
  onScrollEnd,
  onScrollPositionChange
}: UseTeleprompterScrollProps) {
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && !isCountingDown && scrollContainerRef.current) {
      const wpm = getScrollSpeed(scrollSpeed);
      // Convert WPM to pixels per second (adjust multiplier for desired speed)
      const pixelsPerSecond = wpm * 0.8;
      
      const animate = () => {
        if (scrollContainerRef.current && contentRef.current) {
          const container = scrollContainerRef.current;
          const content = contentRef.current;
          const maxScroll = content.offsetHeight - container.clientHeight;
          
          if (container.scrollTop < maxScroll) {
            container.scrollTop += pixelsPerSecond / 60; // 60fps
            onScrollPositionChange(container.scrollTop);
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Reached the end
            onScrollEnd();
          }
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, scrollSpeed, isCountingDown, scrollContainerRef, contentRef, onScrollEnd, onScrollPositionChange]);

  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return { stopAnimation };
}
