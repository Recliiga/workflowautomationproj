
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ClientSelector } from "@/components/admin/ClientSelector";
import { MOCK_CLIENTS } from "@/data/mockUsers";
import { ManagerHeader } from "./manager/ManagerHeader";
import { ManagerTabs } from "./manager/ManagerTabs";
import { ConversationsTab } from "./manager/ConversationsTab";
import { AnalyticsTab } from "./manager/AnalyticsTab";
import { ApprovalTab } from "./manager/ApprovalTab";
import { ScriptsTab } from "./manager/ScriptsTab";

export function InstagramDMManager() {
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0]?.id || "");
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedConversationId(""); // Reset conversation selection
  };

  const handleApproveMessage = (messageId: string, content: string) => {
    console.log("Approving message:", messageId, content);
    // Developer will implement actual sending logic
  };

  const handleRejectMessage = (messageId: string, reason: string) => {
    console.log("Rejecting message:", messageId, reason);
    // Developer will implement rejection logic
  };

  const mockAnalyticsData = {
    newFollowers: 28,
    messagesSent: 156,
    replyRate: 42,
    leadsBooked: 12,
    conversionRate: 18,
    totalConversations: 45,
    activeConversations: 18,
    responseTime: "12 min"
  };

  return (
    <div className="space-y-6">
      <ManagerHeader analyticsData={mockAnalyticsData} />

      {/* Client Selection */}
      <ClientSelector 
        clients={MOCK_CLIENTS}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
      />

      {selectedClientId && (
        <Tabs defaultValue="conversations" className="space-y-4">
          <ManagerTabs />

          <TabsContent value="conversations" className="space-y-4">
            <ConversationsTab
              selectedClientId={selectedClientId}
              selectedConversationId={selectedConversationId}
              onConversationSelect={setSelectedConversationId}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab
              selectedClientId={selectedClientId}
              analyticsData={mockAnalyticsData}
            />
          </TabsContent>

          <TabsContent value="approval" className="space-y-4">
            <ApprovalTab
              selectedConversationId={selectedConversationId}
              onApproveMessage={handleApproveMessage}
              onRejectMessage={handleRejectMessage}
            />
          </TabsContent>

          <TabsContent value="scripts" className="space-y-4">
            <ScriptsTab
              selectedClientId={selectedClientId}
              selectedConversationId={selectedConversationId}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
