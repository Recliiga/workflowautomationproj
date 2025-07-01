
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSelector } from "@/components/admin/ClientSelector";
import { ConversationView } from "./ConversationView";
import { SalesScriptPanel } from "./SalesScriptPanel";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { MessageApprovalSystem } from "./MessageApprovalSystem";
import { Client } from "@/types";
import { MOCK_CLIENTS } from "@/data/mockUsers";
import { Instagram, MessageSquare, Zap, Users, BarChart3, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg text-white">
              <Instagram className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Instagram DM Manager
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered lead management for Instagram
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>New Followers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{mockAnalyticsData.newFollowers}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4" />
                <span>Conversion Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{mockAnalyticsData.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Selection */}
      <ClientSelector 
        clients={MOCK_CLIENTS}
        selectedClientId={selectedClientId}
        onClientChange={handleClientChange}
      />

      {selectedClientId && (
        <Tabs defaultValue="conversations" className="space-y-4">
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

          <TabsContent value="conversations" className="space-y-4">
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
                    onConversationSelect={setSelectedConversationId}
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsDashboard 
                      clientId={selectedClientId}
                      data={mockAnalyticsData}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Advanced analytics charts will be implemented by the developer</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approval" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Message Approval System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MessageApprovalSystem
                  conversationId={selectedConversationId}
                  onApproveMessage={handleApproveMessage}
                  onRejectMessage={handleRejectMessage}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scripts" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
