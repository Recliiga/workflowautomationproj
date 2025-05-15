
import React from "react";

export function CalendarDaysHeader() {
  return (
    <div className="grid grid-cols-7 gap-2 max-w-full overflow-hidden">
      {/* Day headers - Monday to Sunday */}
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
        <div key={i} className="text-sm font-medium text-center py-1">
          {day}
        </div>
      ))}
    </div>
  );
}
