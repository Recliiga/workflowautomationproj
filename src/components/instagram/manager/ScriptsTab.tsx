
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { SalesScriptPanel } from "../SalesScriptPanel";

interface ScriptsTabProps {
  selectedClientId: string;
  selectedConversationId: string;
}

export function ScriptsTab({ selectedClientId, selectedConversationId }: ScriptsTabProps) {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Sales Scripts
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-hidden p-0">
        <SalesScriptPanel 
          clientId={selectedClientId}
          conversationId={selectedConversationId}
        />
      </CardContent>
    </Card>
  );
}
