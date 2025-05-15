
import React from "react";
import { CalendarEvent } from "@/types";
import { CalendarContainer } from "@/components/calendar/CalendarContainer";
import { Button } from "@/components/ui/button";

interface FreelancerCalendarSectionProps {
  calendarEvents: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  calendarViewMode: "twoWeeks" | "month";
  setCalendarViewMode: React.Dispatch<React.SetStateAction<"twoWeeks" | "month">>;
}

export function FreelancerCalendarSection({
  calendarEvents,
  onEventClick,
  calendarViewMode,
  setCalendarViewMode
}: FreelancerCalendarSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Content Schedule</h2>
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
        readOnly={true}
        viewMode={calendarViewMode}
      />
    </div>
  );
}
