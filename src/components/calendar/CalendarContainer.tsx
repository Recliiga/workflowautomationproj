
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarView } from "./CalendarView";
import { CalendarEvent } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface CalendarContainerProps {
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
  onDateClick?: (date: Date) => void;
  readOnly: boolean;
}

export function CalendarContainer({
  events,
  onEventClick,
  onEventDrop,
  onDateClick,
  readOnly
}: CalendarContainerProps) {
  const [viewMode, setViewMode] = useState<"twoWeeks" | "month">("twoWeeks");

  const handleEventDrop = (eventId: string, newDate: Date) => {
    if (readOnly) return;
    
    if (onEventDrop) {
      onEventDrop(eventId, newDate);
      toast.success("Content rescheduled successfully!");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Content Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={viewMode === "twoWeeks" ? "default" : "outline"} 
            onClick={() => setViewMode("twoWeeks")}
          >
            2 Weeks
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarView
          events={events}
          onEventClick={onEventClick}
          onDateClick={onDateClick}
          onEventDrop={handleEventDrop}
          readOnly={readOnly}
          viewMode={viewMode}
        />
      </CardContent>
    </Card>
  );
}
