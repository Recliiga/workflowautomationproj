
import React from "react";
import { CalendarEvent, VideoStatus } from "@/types";
import { format, isSameDay, parseISO } from "date-fns";

interface CalendarDayCellProps {
  day: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onDateClick?: (date: Date) => void;
  onEventClick: (eventId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  handleDragStart: (e: React.DragEvent, eventId: string) => void;
  draggingEventId: string | null;
  readOnly: boolean;
  getEventColorClass: (status: VideoStatus) => string;
}

export function CalendarDayCell({
  day,
  events,
  isCurrentMonth,
  isToday,
  onDateClick,
  onEventClick,
  onDragOver,
  onDrop,
  handleDragStart,
  draggingEventId,
  readOnly,
  getEventColorClass
}: CalendarDayCellProps) {
  // Get events for this day
  const dayEvents = events.filter(event => {
    try {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day);
    } catch (error) {
      console.error("Error parsing date", event.date, error);
      return false;
    }
  });

  return (
    <div
      className={`border rounded-md h-24 p-1 overflow-hidden transition-colors flex flex-col ${
        isToday ? "border-primary" : isCurrentMonth ? "border-border" : "border-muted bg-muted/20"
      }`}
      onClick={() => onDateClick && onDateClick(day)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day)}
    >
      <div className={`text-xs text-right mb-1 ${isCurrentMonth ? "" : "text-muted-foreground"}`}>
        {format(day, "d")}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={`text-xs p-1 rounded cursor-pointer truncate ${
              draggingEventId === event.id ? "opacity-50" : ""
            } ${getEventColorClass(event.status)} text-white`}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event.id);
            }}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, event.id)}
          >
            {event.title}
            {event.videoType && <span className="text-[0.65rem] ml-1 opacity-80">[{event.videoType}]</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
