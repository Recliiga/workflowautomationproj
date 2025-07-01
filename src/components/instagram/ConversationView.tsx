
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LeadStatus } from "./LeadStatusManager";
import { NewFollowerDetection } from "./NewFollowerDetection";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { MessageList } from "./conversation/MessageList";
import { MessageInput } from "./conversation/MessageInput";
import { Conversation, Message } from "./conversation/types";
import { mockConversations, mockMessages } from "./conversation/mockData";

interface ConversationViewProps {
  clientId: string;
  conversationId: string;
  onConversationSelect: (conversationId: string) => void;
}

export function ConversationView({ clientId, conversationId, onConversationSelect }: ConversationViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [showNewFollowers, setShowNewFollowers] = useState(false);

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      setSelectedConversation(conversation || null);
      setMessages(mockMessages[conversationId] || []);
      setShowNewFollowers(false);
    }
  }, [conversationId, conversations]);

  const handleSendMessage = (content: string) => {
    if (!conversationId) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "admin",
      senderName: "Admin", 
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromClient: true
    };

    setMessages(prev => [...prev, message]);
  };

  const handleStatusChange = (conversationId: string, newStatus: LeadStatus) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, status: newStatus } : conv
      )
    );
  };

  const handleStartConversation = (followerId: string) => {
    console.log("Starting conversation with follower:", followerId);
    setShowNewFollowers(false);
  };

  const handleViewProfile = (followerId: string) => {
    console.log("Viewing profile:", followerId);
  };

  if (showNewFollowers) {
    return (
      <div className="h-full">
        <div className="p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowNewFollowers(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Conversations
          </Button>
        </div>
        <div className="p-4">
          <NewFollowerDetection
            clientId={clientId}
            onStartConversation={handleStartConversation}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {!conversationId ? (
        <ConversationList
          conversations={conversations}
          onConversationSelect={onConversationSelect}
          onStatusChange={handleStatusChange}
          onShowNewFollowers={() => setShowNewFollowers(true)}
        />
      ) : (
        <>
          {selectedConversation && (
            <ConversationHeader
              conversation={selectedConversation}
              onBack={() => onConversationSelect("")}
              onStatusChange={handleStatusChange}
            />
          )}
          <MessageList
            messages={messages}
            leadAvatar={selectedConversation?.leadAvatar}
          />
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
}
