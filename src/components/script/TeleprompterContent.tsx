
import { forwardRef } from "react";
import { GeneratedScript } from "@/types/script";

interface TeleprompterContentProps {
  script: GeneratedScript;
  currentLineIndex: number;
  isPlaying: boolean;
  isCountingDown: boolean;
}

export const TeleprompterContent = forwardRef<
  { scrollContainer: HTMLDivElement | null; content: HTMLDivElement | null },
  TeleprompterContentProps
>(({ script, currentLineIndex, isPlaying, isCountingDown }, ref) => {
  const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`;
  const lines = fullScript.split('\n').filter(line => line.trim().length > 0);

  return (
    <div 
      ref={(el) => {
        if (ref && typeof ref === 'object' && ref.current) {
          ref.current.scrollContainer = el;
        }
      }}
      className="flex-1 overflow-hidden bg-black text-white relative"
      style={{ scrollBehavior: 'auto' }}
    >
      {/* Reading line indicator - shows center position */}
      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-yellow-400 opacity-50 z-10 pointer-events-none"></div>
      
      {/* Top padding for initial positioning */}
      <div className="h-screen"></div>
      
      <div 
        ref={(el) => {
          if (ref && typeof ref === 'object' && ref.current) {
            ref.current.content = el;
          }
        }}
        className="text-center space-y-8 max-w-4xl mx-auto px-8"
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={`text-3xl md:text-4xl lg:text-5xl leading-relaxed font-light transition-all duration-300 py-4 px-6 rounded-lg ${
              index === currentLineIndex && isPlaying && !isCountingDown
                ? 'text-yellow-300 font-normal shadow-lg'
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
      
      {/* Bottom padding to allow content to scroll past the center */}
      <div className="h-screen"></div>
    </div>
  );
});

TeleprompterContent.displayName = "TeleprompterContent";
