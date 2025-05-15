
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBannerProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // in milliseconds, 0 for no auto-dismiss
  className?: string;
  onDismiss?: () => void;
}

export function NotificationBanner({
  message,
  type = "info",
  duration = 5000,
  className,
  onDismiss,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border p-4 animate-fade-in",
        typeStyles[type],
        className
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={handleDismiss}
        className="ml-4 rounded-md p-1 hover:bg-white/20"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
