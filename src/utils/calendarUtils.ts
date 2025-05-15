
import { VideoStatus } from "@/types";
import { isSameDay } from "date-fns";

export function getEventColorClass(status: VideoStatus) {
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
}

// Check if a date is today
export function isToday(date: Date) {
  const today = new Date();
  return isSameDay(date, today);
}

// Check if date is in current month
export function isCurrentMonth(date: Date, currentDate: Date) {
  return date.getMonth() === currentDate.getMonth();
}
