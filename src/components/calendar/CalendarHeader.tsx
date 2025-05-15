
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: "twoWeeks" | "month";
  calendarDates: Date[];
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  calendarDates,
  onPrevPeriod,
  onNextPeriod
}: CalendarHeaderProps) {
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

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        {formatDateRange()}
      </h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevPeriod}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onNextPeriod}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
