
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, Clock, MessageCircle, UserPlus, XCircle } from "lucide-react";

export type LeadStatus = "new" | "contacted" | "awaiting_reply" | "replied" | "no_response";

interface LeadStatusManagerProps {
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
  leadName: string;
}

const statusConfig = {
  new: {
    label: "New",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: UserPlus,
  },
  contacted: {
    label: "Contacted", 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: MessageCircle,
  },
  awaiting_reply: {
    label: "Awaiting Reply",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", 
    icon: Clock,
  },
  replied: {
    label: "Replied",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle,
  },
  no_response: {
    label: "No Response",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: XCircle,
  },
};

export function LeadStatusManager({ currentStatus, onStatusChange, leadName }: LeadStatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Badge className={`${currentConfig.color} cursor-pointer hover:opacity-80 transition-opacity`}>
            <CurrentIcon className="h-3 w-3 mr-1" />
            {currentConfig.label}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1">
          <div className="text-sm font-medium mb-2">Update Status for {leadName}</div>
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const isSelected = status === currentStatus;
            
            return (
              <Button
                key={status}
                variant={isSelected ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onStatusChange(status as LeadStatus);
                  setIsOpen(false);
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {config.label}
                {isSelected && <CheckCircle className="h-3 w-3 ml-auto" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
