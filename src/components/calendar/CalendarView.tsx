import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent, VideoStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

  const formatDateRange = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy");
    } else {
      const startDate = calendarDates[0];
      const endDate = calendarDates[calendarDates.length - 1];
      
      if (startDate.getMonth() === endDate.getMonth()) {
        // Same month
        return `${format(startDate, "MMMM d")} - ${format(endDate, "d, yyyy")}`;
      } else {
        // Different months
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
      }
    }
  };
  
  // For month view, we need to generate week rows
  const weeks = viewMode === "month" 
    ? Array.from({ length: 6 }, (_, i) => i) // 6 weeks max
    : Array.from({ length: 2 }, (_, i) => i); // 2 weeks for two-week view

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {formatDateRange()}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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
                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = events.filter(
                      (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                    );

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={cn(
                          "border rounded-md p-1 overflow-y-auto",
                          isToday(day) ? "border-primary/50" : "border-border",
                          !isCurrentMonth(day) ? "opacity-50 bg-muted/20" : "",
                          !readOnly ? "cursor-pointer" : "",
                          "min-h-[80px]"
                        )}
                        onClick={() => onDateClick && !readOnly && onDateClick(day)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day)}
                      >
                        <div className={cn(
                          "text-xs font-medium mb-1 flex items-center justify-center rounded-full w-5 h-5 mx-auto",
                          isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {format(day, "d")}
                        </div>
                        
                        {/* Events for this day */}
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "p-1 rounded text-xs text-white flex flex-col",
                                getEventColorClass(event.status),
                                draggingEventId === event.id ? "opacity-50" : "",
                                "hover:opacity-80 transition-opacity cursor-pointer"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(event.id);
                              }}
                              draggable={!readOnly}
                              onDragStart={(e) => handleDragStart(e, event.id)}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              {event.videoType && (
                                <div className="text-[10px] opacity-90 truncate">{event.videoType}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })
          ) : (
            // Two-week view - simpler layout
            calendarDates.map((day, i) => {
              const dayEvents = events.filter(
                (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              );

              return (
                <div
                  key={i}
                  className={cn(
                    "border rounded-md min-h-[140px] p-1 overflow-y-auto",
                    isToday(day) ? "border-primary/50" : "border-border",
                    !readOnly ? "cursor-pointer" : ""
                  )}
                  onClick={() => onDateClick && !readOnly && onDateClick(day)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className={cn(
                    "text-center text-sm font-medium",
                    isToday(day) ? "text-primary" : "text-muted-foreground"
                  )}>
                    <div>{format(day, "EEE")}</div>
                    <div className={cn(
                      "inline-flex items-center justify-center rounded-full w-7 h-7",
                      isToday(day) ? "bg-primary text-primary-foreground" : ""
                    )}>
                      {format(day, "d")}
                    </div>
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-1 rounded text-xs text-white flex flex-col",
                          getEventColorClass(event.status),
                          draggingEventId === event.id ? "opacity-50" : "",
                          "hover:opacity-80 transition-opacity cursor-pointer"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event.id);
                        }}
                        draggable={!readOnly}
                        onDragStart={(e) => handleDragStart(e, event.id)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        {event.videoType && (
                          <div className="text-[10px] opacity-90 truncate">{event.videoType}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile Calendar View */}
      <div className="md:hidden space-y-4">
        {calendarDates.map((day, idx) => {
          const dayEvents = events.filter(
            (event) => format(new Date(event.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          );

          if (dayEvents.length === 0) return null;

          return (
            <div key={idx} className="border rounded-md p-2">
              <div className={cn(
                "flex items-center gap-2 font-medium mb-2",
                isToday(day) ? "text-primary" : ""
              )}>
                <div className={cn(
                  "flex items-center justify-center rounded-full w-7 h-7",
                  isToday(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {format(day, "d")}
                </div>
                <span>{format(day, "EEEE")}</span>
              </div>

              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-2 p-2 bg-background border rounded-md"
                    onClick={() => onEventClick(event.id)}
                  >
                    <Badge variant="outline" className={cn(
                      "w-2 h-2 rounded-full p-0",
                      getEventColorClass(event.status)
                    )} />
                    <div className="flex-1 truncate">
                      <div className="font-medium text-sm truncate">{event.title}</div>
                      {event.videoType && (
                        <div className="text-xs text-muted-foreground">{event.videoType}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
