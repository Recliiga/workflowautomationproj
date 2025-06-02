
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSelector } from "@/components/admin/ClientSelector";
import { ConversationView } from "./ConversationView";
import { SalesScriptPanel } from "./SalesScriptPanel";
import { Client } from "@/types";
import { MOCK_CLIENTS } from "@/data/mockUsers";
import { Instagram, MessageSquare, Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function InstagramDMManager() {
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0]?.id || "");
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedConversationId(""); // Reset conversation selection
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
                AI-powered sales conversations for Instagram
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>Active Leads</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4" />
                <span>Conversion Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">24%</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
          {/* Left Side - Live Conversation */}
          <Card className="flex flex-col border-2 border-pink-100 dark:border-pink-900/30">
            <CardHeader className="flex flex-row items-center gap-2 pb-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30">
              <div className="p-2 bg-pink-500 rounded-md text-white">
                <Instagram className="h-4 w-4" />
              </div>
              <CardTitle className="text-pink-900 dark:text-pink-100">Live Conversation</CardTitle>
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
      )}
    </div>
  );
}
