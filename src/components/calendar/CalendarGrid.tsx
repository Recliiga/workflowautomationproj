
import React from "react";
import { CalendarEvent } from "@/types";
import { CalendarDayCell } from "./CalendarDayCell";
import { CalendarDaysHeader } from "./CalendarDaysHeader";
import { isCurrentMonth, isToday, getEventColorClass } from "@/utils/calendarUtils";

interface CalendarGridProps {
  viewMode: "twoWeeks" | "month";
  calendarDates: Date[];
  weeks: number[];
  filteredEvents: CalendarEvent[];
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  onEventClick: (eventId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  handleDragStart: (e: React.DragEvent, eventId: string) => void;
  draggingEventId: string | null;
  readOnly: boolean;
}

export function CalendarGrid({
  viewMode,
  calendarDates,
  weeks,
  filteredEvents,
  currentDate,
  onDateClick,
  onEventClick,
  onDragOver,
  onDrop,
  handleDragStart,
  draggingEventId,
  readOnly
}: CalendarGridProps) {
  return (
    <>
      <CalendarDaysHeader />
      
      <div className="grid grid-cols-7 gap-2 max-w-full overflow-hidden">
        {viewMode === "month" ? (
          // Month view - up to 6 weeks of days
          weeks.map((weekIndex) => {
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
                    onDragOver={onDragOver}
                    onDrop={onDrop}
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
              onDragOver={onDragOver}
              onDrop={onDrop}
              handleDragStart={handleDragStart}
              draggingEventId={draggingEventId}
              readOnly={readOnly}
              getEventColorClass={getEventColorClass}
            />
          ))
        )}
      </div>
    </>
  );
}
