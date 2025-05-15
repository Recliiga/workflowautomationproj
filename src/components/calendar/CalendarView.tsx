
import React from "react";
import { CalendarEvent, VideoStatus } from "@/types";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { MobileEventsList } from "./MobileEventsList";
import { StatusFilter } from "./StatusFilter";
import { useCalendarDates } from "@/hooks/useCalendarDates";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { ViewModeProvider } from "./ViewModeContext";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (eventId: string) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (eventId: string, newDate: Date) => void;
  readOnly?: boolean;
  viewMode?: "twoWeeks" | "month";
}

export function CalendarView({
  events,
  onEventClick,
  onDateClick,
  onEventDrop,
  readOnly = false,
  viewMode = "twoWeeks"
}: CalendarViewProps) {
  const [selectedStatuses, setSelectedStatuses] = React.useState<VideoStatus[]>(["in-progress", "submitted", "approved", "rejected"]);

  // Filter events based on selected statuses
  const filteredEvents = events.filter(event => 
    selectedStatuses.includes(event.status)
  );

  // Use custom hooks for calendar functionality
  const { 
    currentDate, 
    calendarDates, 
    handlePrevPeriod, 
    handleNextPeriod,
    weeks
  } = useCalendarDates({ viewMode });

  const {
    draggingEventId,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useDragAndDrop(readOnly || false, onEventDrop);

  return (
    <ViewModeProvider viewMode={viewMode}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CalendarHeader 
            currentDate={currentDate}
            viewMode={viewMode}
            calendarDates={calendarDates}
            onPrevPeriod={handlePrevPeriod}
            onNextPeriod={handleNextPeriod}
          />
          
          <StatusFilter
            selectedStatuses={selectedStatuses}
            onChange={setSelectedStatuses}
            className="ml-auto"
          />
        </div>

        {/* Desktop Calendar View */}
        <div className="hidden md:block">
          <CalendarGrid
            viewMode={viewMode}
            calendarDates={calendarDates}
            weeks={weeks}
            filteredEvents={filteredEvents}
            currentDate={currentDate}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            handleDragStart={handleDragStart}
            draggingEventId={draggingEventId}
            readOnly={readOnly}
          />
        </div>

        {/* Mobile Calendar View */}
        <MobileEventsList
          calendarDates={calendarDates}
          events={filteredEvents}
          onEventClick={onEventClick}
        />
      </div>
    </ViewModeProvider>
  );
}
