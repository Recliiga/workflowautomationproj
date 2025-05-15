
import { useState, useMemo } from "react";
import { addWeeks, subWeeks, startOfWeek, addDays, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface UseCalendarDatesProps {
  viewMode: "twoWeeks" | "month";
}

export function useCalendarDates({ viewMode }: UseCalendarDatesProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate dates based on view mode
  const calendarDates = useMemo(() => {
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
  }, [currentDate, viewMode]);

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

  // For month view, we need to generate week rows
  const weeks = viewMode === "month" 
    ? Array.from({ length: 6 }, (_, i) => i) // 6 weeks max
    : Array.from({ length: 2 }, (_, i) => i); // 2 weeks for two-week view

  return {
    currentDate,
    calendarDates,
    handlePrevPeriod,
    handleNextPeriod,
    weeks
  };
}
