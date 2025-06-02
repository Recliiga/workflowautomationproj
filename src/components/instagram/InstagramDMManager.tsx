
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSelector } from "@/components/admin/ClientSelector";
import { ConversationView } from "./ConversationView";
import { SalesScriptPanel } from "./SalesScriptPanel";
import { Client } from "@/types";
import { MOCK_CLIENTS } from "@/data/mockUsers";
import { Instagram, MessageSquare } from "lucide-react";

export function InstagramDMManager() {
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0]?.id || "");
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedConversationId(""); // Reset conversation selection
  };

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <ClientSelector 
        clients={MOCK_CLIENTS}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
      />

      {selectedClientId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
          {/* Left Side - Live Conversation */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <Instagram className="h-5 w-5 text-pink-500" />
              <CardTitle>Live Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ConversationView 
                clientId={selectedClientId}
                conversationId={selectedConversationId}
                onConversationSelect={setSelectedConversationId}
              />
            </CardContent>
          </Card>

          {/* Right Side - AI Sales Script */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <CardTitle>AI Sales Script</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <SalesScriptPanel 
                clientId={selectedClientId}
                conversationId={selectedConversationId}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
