
import React, { useState } from "react";
import { CalendarEvent } from "@/types";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { Button } from "@/components/ui/button";
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
  const [calendarViewMode, setCalendarViewMode] = useState<"twoWeeks" | "month">("twoWeeks");
  
  const handleEventDrop = (eventId: string, newDate: Date) => {
    updateVideoSchedules(eventId, newDate);
    toast.success("Content rescheduled successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Content Calendar</h2>
        <div className="space-x-2">
          <Button
            variant={calendarViewMode === "twoWeeks" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarViewMode("twoWeeks")}
          >
            2 Weeks
          </Button>
          <Button
            variant={calendarViewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setCalendarViewMode("month")}
          >
            Month
          </Button>
        </div>
      </div>

      <CalendarContainer
        events={calendarEvents}
        onEventClick={onEventClick}
        onEventDrop={handleEventDrop}
        readOnly={false}
        viewMode={calendarViewMode}
      />
    </div>
  );
}
