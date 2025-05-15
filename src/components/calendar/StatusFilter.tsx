
import React from "react";
import { VideoStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  selectedStatuses: VideoStatus[];
  onChange: (statuses: VideoStatus[]) => void;
  className?: string;
}

export function StatusFilter({ selectedStatuses, onChange, className }: StatusFilterProps) {
  const allStatuses: VideoStatus[] = ["in-progress", "submitted", "approved", "rejected"];
  
  const toggleStatus = (status: VideoStatus) => {
    if (selectedStatuses.includes(status)) {
      // If all would be deselected, select all instead
      if (selectedStatuses.length === 1) {
        onChange(allStatuses);
      } else {
        onChange(selectedStatuses.filter(s => s !== status));
      }
    } else {
      onChange([...selectedStatuses, status]);
    }
  };

  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-indigo-500 hover:bg-indigo-600";
      case "submitted":
        return "bg-amber-500 hover:bg-amber-600";
      case "approved":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusLabel = (status: VideoStatus) => {
    switch (status) {
      case "in-progress": return "In Progress";
      case "submitted": return "Submitted";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      default: return status;
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {allStatuses.map((status) => {
        const isSelected = selectedStatuses.includes(status);
        return (
          <Badge
            key={status}
            variant="secondary"
            className={cn(
              "cursor-pointer px-2 py-1 text-xs font-medium flex items-center gap-1.5 border",
              isSelected ? getStatusColor(status) + " text-white" : "text-muted-foreground"
            )}
            onClick={() => toggleStatus(status)}
          >
            {isSelected && <Check className="h-3 w-3" />}
            {getStatusLabel(status)}
          </Badge>
        );
      })}
    </div>
  );
}
