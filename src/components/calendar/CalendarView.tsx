
import React, { useState } from "react";
import { CalendarEvent, VideoStatus } from "@/types";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDayCell } from "./CalendarDayCell";
import { MobileEventsList } from "./MobileEventsList";

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);

  // Generate dates based on view mode
  const getDatesForView = () => {
    if (viewMode === "month") {
      // Get all days in the month
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // Start from the Monday before or on monthStart
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
      
      // Get all days to display (including potentially some days from previous/next months)
      return eachDayOfInterval({ 
        start: startDate, 
        end: addDays(endOfMonth(currentDate), 7) // add extra week to ensure we have enough rows
      }).slice(0, 42); // maximum 6 weeks (6*7=42 days) to display
    } else {
      // Two week view
      const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 14 }, (_, i) => addDays(startDate, i));
    }
  };

  const calendarDates = getDatesForView();

  const handlePrevPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 2));
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 2));
    }
  };

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    if (readOnly) return;
    e.dataTransfer.setData("eventId", eventId);
    setDraggingEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    if (readOnly) return;
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (eventId && onEventDrop) {
      onEventDrop(eventId, date);
    }
    setDraggingEventId(null);
  };

  const getEventColorClass = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500";
      case "submitted":
        return "bg-amber-500";
      case "approved":
        return "bg-emerald-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };
  
  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };
  
  // For month view, we need to generate week rows
  const weeks = viewMode === "month" 
    ? Array.from({ length: 6 }, (_, i) => i) // 6 weeks max
    : Array.from({ length: 2 }, (_, i) => i); // 2 weeks for two-week view

  return (
    <div className="space-y-4">
      <CalendarHeader 
        currentDate={currentDate}
        viewMode={viewMode}
        calendarDates={calendarDates}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
      />

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
                      events={events}
                      isCurrentMonth={isCurrentMonth(day)}
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
                events={events}
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
        events={events}
        onEventClick={onEventClick}
        getEventColorClass={getEventColorClass}
        isToday={isToday}
      />
    </div>
  );
}
