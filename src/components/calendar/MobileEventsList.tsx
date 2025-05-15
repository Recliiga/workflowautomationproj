
import React from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MobileEventsListProps {
  calendarDates: Date[];
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  getEventColorClass: (status: string) => string;
  isToday: (date: Date) => boolean;
}

export function MobileEventsList({
  calendarDates,
  events,
  onEventClick,
  getEventColorClass,
  isToday
}: MobileEventsListProps) {
  return (
    <div className="md:hidden space-y-4">
      {calendarDates.map((day, idx) => {
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
  );
}
