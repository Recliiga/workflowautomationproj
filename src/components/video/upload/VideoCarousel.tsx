
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoPreview } from "./VideoPreview";
import { FileWithPreview, FileMetadata, MetadataRecord } from "./types";

interface VideoCarouselProps {
  files: FileWithPreview[];
  metadata: MetadataRecord;
  onRemove: (id: string) => void;
  onMetadataChange: (id: string, field: 'title' | 'description' | 'notes', value: string) => void;
}

export function VideoCarousel({
  files,
  metadata,
  onRemove,
  onMetadataChange
}: VideoCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 300);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const newPosition = scrollPosition + 300;
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="relative">
      {files.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 py-2 px-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300"
        style={{ scrollBehavior: 'smooth' }}
      >
        {files.map((file) => (
          <VideoPreview
            key={file.id}
            file={file}
            metadata={metadata[file.id] || { title: '', description: '', notes: '' }}
            onRemove={onRemove}
            onMetadataChange={onMetadataChange}
          />
        ))}
      </div>
    </div>
  );
}
