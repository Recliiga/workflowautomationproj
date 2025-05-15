
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent, VideoStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
  readOnly?: boolean;
}

export function CalendarView({
  events,
  onEventClick,
  onDateClick,
  onEventDrop,
  readOnly = false
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

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

  const getEventColorClass = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500";
      case "submitted":
        return "bg-amber-500";
      case "approved":
        return "bg-emerald-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Generate an array of 7 days starting from the week start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {format(weekDays[0], "MMMM d")} - {format(weekDays[6], "MMMM d, yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Calendar View */}
      <div className="hidden md:grid grid-cols-7 gap-2 max-w-full overflow-hidden">
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <div key={i} className="text-sm font-medium text-center">
            <div>{format(day, "EEE")}</div>
            <div className={cn(
              "inline-flex items-center justify-center rounded-full w-7 h-7",
              isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Calendar cells */}
        {weekDays.map((day, i) => {
          const dayEvents = events.filter(
            (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          );

          return (
            <div
              key={i}
              className={cn(
                "border rounded-md min-h-[140px] p-1 overflow-y-auto",
                isToday(day) ? "border-primary/50" : "border-border",
                !readOnly ? "cursor-pointer" : ""
              )}
              onClick={() => onDateClick && !readOnly && onDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
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
        })}
      </div>

      {/* Mobile Calendar View */}
      <div className="md:hidden space-y-4">
        {weekDays.map((day, idx) => {
          const dayEvents = events.filter(
            (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          );

          if (dayEvents.length === 0) return null;

          return (
            <div key={idx} className="border rounded-md p-2">
              <div className={cn(
                "flex items-center gap-2 font-medium mb-2",
                isToday(day) ? "text-primary" : ""
              )}>
                <div className={cn(
                  "flex items-center justify-center rounded-full w-7 h-7",
                  isToday(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {format(day, "d")}
                </div>
                <span>{format(day, "EEEE")}</span>
              </div>

              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-2 p-2 bg-background border rounded-md"
                    onClick={() => onEventClick(event.id)}
                  >
                    <Badge variant="outline" className={cn(
                      "w-2 h-2 rounded-full p-0",
                      getEventColorClass(event.status)
                    )} />
                    <div className="flex-1 truncate">
                      <div className="font-medium text-sm truncate">{event.title}</div>
                      {event.videoType && (
                        <div className="text-xs text-muted-foreground">{event.videoType}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
