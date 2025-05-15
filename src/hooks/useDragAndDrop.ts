
import { useState } from "react";

export function useDragAndDrop(readOnly: boolean, onEventDrop?: (eventId: string, newDate: Date) => void) {
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    if (readOnly) return;
    e.dataTransfer.setData("eventId", eventId);
    setDraggingEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    if (readOnly) return;
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (eventId && onEventDrop) {
      onEventDrop(eventId, date);
    }
    setDraggingEventId(null);
  };

  return {
    draggingEventId,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}
