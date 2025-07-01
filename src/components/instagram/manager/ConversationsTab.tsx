
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, MessageSquare } from "lucide-react";
import { ConversationView } from "../ConversationView";
import { SalesScriptPanel } from "../SalesScriptPanel";

interface ConversationsTabProps {
  selectedClientId: string;
  selectedConversationId: string;
  onConversationSelect: (conversationId: string) => void;
}

export function ConversationsTab({ 
  selectedClientId, 
  selectedConversationId, 
  onConversationSelect 
}: ConversationsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
      {/* Left Side - Live Conversation */}
      <Card className="flex flex-col border-2 border-pink-100 dark:border-pink-900/30">
        <CardHeader className="flex flex-row items-center gap-2 pb-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30">
          <div className="p-2 bg-pink-500 rounded-md text-white">
            <Instagram className="h-4 w-4" />
          </div>
          <CardTitle className="text-pink-900 dark:text-pink-100">Lead Conversations</CardTitle>
          {selectedConversationId && (
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Connected
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ConversationView 
            clientId={selectedClientId}
            conversationId={selectedConversationId}
            onConversationSelect={onConversationSelect}
          />
        </CardContent>
      </Card>

      {/* Right Side - AI Sales Script */}
      <Card className="flex flex-col border-2 border-blue-100 dark:border-blue-900/30">
        <CardHeader className="flex flex-row items-center gap-2 pb-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
          <div className="p-2 bg-blue-500 rounded-md text-white">
            <MessageSquare className="h-4 w-4" />
          </div>
          <CardTitle className="text-blue-900 dark:text-blue-100">AI Sales Script</CardTitle>
          <Badge variant="outline" className="ml-auto border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
            AI Powered
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <SalesScriptPanel 
            clientId={selectedClientId}
            conversationId={selectedConversationId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
