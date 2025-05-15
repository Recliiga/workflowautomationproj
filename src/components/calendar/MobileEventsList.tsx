
import React from "react";
import { CalendarEvent } from "@/types";
import { format, isSameDay, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getEventColorClass, isToday } from "@/utils/calendarUtils";

interface MobileEventsListProps {
  calendarDates: Date[];
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
}

export function MobileEventsList({
  calendarDates,
  events,
  onEventClick,
}: MobileEventsListProps) {
  // Group events by date for mobile view
  const groupedEvents = calendarDates.reduce<Record<string, CalendarEvent[]>>((acc, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dateEvents = events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, date);
      } catch (error) {
        return false;
      }
    });

    if (dateEvents.length > 0) {
      acc[dateStr] = dateEvents;
    }

    return acc;
  }, {});

  // If no events for any date, show message
  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="md:hidden p-4 text-center text-muted-foreground">
        No events in this period for the selected status filters.
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {Object.entries(groupedEvents).map(([dateStr, dateEvents]) => {
        const date = new Date(dateStr);
        return (
          <div key={dateStr} className="border rounded-md overflow-hidden">
            <div className={`p-2 font-medium text-sm border-b ${isToday(date) ? "bg-primary/10" : ""}`}>
              {format(date, "EEEE, MMMM d")}
              {isToday(date) && <Badge className="ml-2 bg-primary">Today</Badge>}
            </div>
            <div className="divide-y">
              {dateEvents.map(event => (
                <div
                  key={event.id}
                  className="p-2 flex items-center cursor-pointer hover:bg-muted/50"
                  onClick={() => onEventClick(event.id)}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getEventColorClass(event.status)}`}></div>
                  <div className="overflow-hidden">
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    {event.videoType && (
                      <div className="text-xs text-muted-foreground truncate">{event.videoType}</div>
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
