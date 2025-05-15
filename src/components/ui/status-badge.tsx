
import { cn } from "@/lib/utils";
import { VideoStatus } from "@/types";

interface StatusBadgeProps {
  status: VideoStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusMap = {
    "in-progress": {
      label: "In Progress",
      className: "status-badge in-progress",
    },
    "submitted": {
      label: "Submitted",
      className: "status-badge submitted",
    },
    "approved": {
      label: "Approved",
      className: "status-badge approved",
    },
    "rejected": {
      label: "Rejected",
      className: "status-badge rejected",
    },
  };

  const { label, className: statusClassName } = statusMap[status];

  return (
    <span className={cn(statusClassName, className)}>
      {label}
    </span>
  );
}
