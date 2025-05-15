
import React from "react";
import { CalendarEvent } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar/CalendarView";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Content Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={calendarViewMode === "twoWeeks" ? "default" : "outline"} 
            onClick={() => setCalendarViewMode("twoWeeks")}
          >
            2 Weeks
          </Button>
          <Button 
            size="sm" 
            variant={calendarViewMode === "month" ? "default" : "outline"}
            onClick={() => setCalendarViewMode("month")}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarView
          events={calendarEvents}
          onEventClick={onEventClick}
          readOnly={true}
          viewMode={calendarViewMode}
        />
      </CardContent>
    </Card>
  );
}
