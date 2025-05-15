
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent, VideoStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";

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

      <div className="grid grid-cols-7 gap-4">
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <div key={i} className="text-sm font-medium text-center">
            <div>{format(day, "EEEE")}</div>
            <div className="text-muted-foreground">{format(day, "d")}</div>
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
              className={`calendar-day ${!readOnly ? "cursor-pointer" : ""}`}
              onClick={() => onDateClick && !readOnly && onDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div className="calendar-day-header">
                {format(day, "d")}
              </div>

              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`calendar-item ${getEventColorClass(event.status)} ${
                      draggingEventId === event.id ? "opacity-50" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event.id);
                    }}
                    draggable={!readOnly}
                    onDragStart={(e) => handleDragStart(e, event.id)}
                  >
                    {event.title}
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
