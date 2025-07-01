
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Instagram, BarChart3, CheckCircle, MessageSquare } from "lucide-react";

export function ManagerTabs() {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="conversations" className="flex items-center gap-2">
        <Instagram className="h-4 w-4" />
        Conversations
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="approval" className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Message Approval
        <Badge variant="destructive" className="text-xs px-1 py-0 h-4">2</Badge>
      </TabsTrigger>
      <TabsTrigger value="scripts" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        AI Scripts
      </TabsTrigger>
    </TabsList>
  );
}
