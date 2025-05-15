
import React from "react";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";

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
  getEventColorClass: (status: string) => string;
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
  const dayEvents = events.filter(
    (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
  );

  return (
    <div
      className={cn(
        "border rounded-md p-1 overflow-y-auto",
        isToday ? "border-primary/50" : "border-border",
        !isCurrentMonth ? "opacity-50 bg-muted/20" : "",
        !readOnly ? "cursor-pointer" : "",
        "min-h-[80px]"
      )}
      onClick={() => onDateClick && !readOnly && onDateClick(day)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day)}
    >
      <div className={cn(
        "text-xs font-medium mb-1 flex items-center justify-center rounded-full w-5 h-5 mx-auto",
        isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      )}>
        {format(day, "d")}
      </div>
      
      {/* Events for this day */}
      <div className="space-y-1">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              "p-1 rounded text-xs text-white flex flex-col",
              getEventColorClass(event.status),
              draggingEventId === event.id ? "opacity-50" : "",
              "hover:opacity-80 transition-opacity cursor-pointer"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event.id);
            }}
            draggable={!readOnly}
            onDragStart={(e) => handleDragStart(e, event.id)}
          >
            <div className="font-medium truncate">{event.title}</div>
            {event.videoType && (
              <div className="text-[10px] opacity-90 truncate">{event.videoType}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
