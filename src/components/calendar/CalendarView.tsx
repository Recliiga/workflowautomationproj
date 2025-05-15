
import React from "react";
import { CalendarEvent, VideoStatus } from "@/types";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDayCell } from "./CalendarDayCell";
import { MobileEventsList } from "./MobileEventsList";
import { StatusFilter } from "./StatusFilter";
import { useCalendarDates } from "@/hooks/useCalendarDates";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { getEventColorClass, isToday, isCurrentMonth } from "@/utils/calendarUtils";
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
          <div className="grid grid-cols-7 gap-2 max-w-full overflow-hidden">
            {/* Day headers - Monday to Sunday */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={i} className="text-sm font-medium text-center py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 max-w-full overflow-hidden">
            {viewMode === "month" ? (
              // Month view - up to 6 weeks of days
              weeks.map((week, weekIndex) => {
                const weekStart = weekIndex * 7;
                const weekDays = calendarDates.slice(weekStart, weekStart + 7);
                
                // Skip rendering empty weeks at the end
                if (weekDays.length === 0) return null;
                
                return (
                  <React.Fragment key={weekIndex}>
                    {weekDays.map((day, dayIndex) => (
                      <CalendarDayCell 
                        key={`${weekIndex}-${dayIndex}`}
                        day={day}
                        events={filteredEvents}
                        isCurrentMonth={isCurrentMonth(day, currentDate)}
                        isToday={isToday(day)}
                        onDateClick={onDateClick}
                        onEventClick={onEventClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        handleDragStart={handleDragStart}
                        draggingEventId={draggingEventId}
                        readOnly={readOnly}
                        getEventColorClass={getEventColorClass}
                      />
                    ))}
                  </React.Fragment>
                );
              })
            ) : (
              // Two-week view - simpler layout
              calendarDates.map((day, i) => (
                <CalendarDayCell 
                  key={i}
                  day={day}
                  events={filteredEvents}
                  isCurrentMonth={true}
                  isToday={isToday(day)}
                  onDateClick={onDateClick}
                  onEventClick={onEventClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  handleDragStart={handleDragStart}
                  draggingEventId={draggingEventId}
                  readOnly={readOnly}
                  getEventColorClass={getEventColorClass}
                />
              ))
            )}
          </div>
        </div>

        {/* Mobile Calendar View */}
        <MobileEventsList
          calendarDates={calendarDates}
          events={filteredEvents}
          onEventClick={onEventClick}
          getEventColorClass={getEventColorClass}
          isToday={isToday}
        />
      </div>
    </ViewModeProvider>
  );
}
