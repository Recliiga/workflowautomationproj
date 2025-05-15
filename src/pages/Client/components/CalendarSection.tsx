
import React from "react";
import { CalendarEvent } from "@/types";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { toast } from "sonner";

interface CalendarSectionProps {
  calendarEvents: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  updateVideoSchedules: (eventId: string, newDate: Date) => void;
}

export function CalendarSection({ 
  calendarEvents, 
  onEventClick, 
  updateVideoSchedules 
}: CalendarSectionProps) {
  const handleEventDrop = (eventId: string, newDate: Date) => {
    updateVideoSchedules(eventId, newDate);
    toast.success("Content rescheduled successfully!");
  };

  return (
    <CalendarContainer
      events={calendarEvents}
      onEventClick={onEventClick}
      onEventDrop={handleEventDrop}
      readOnly={false}
    />
  );
}
