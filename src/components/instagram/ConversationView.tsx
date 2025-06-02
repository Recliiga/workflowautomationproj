
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromClient: boolean;
}

interface Conversation {
  id: string;
  leadName: string;
  leadAvatar?: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'pending' | 'closed';
  unreadCount: number;
}

interface ConversationViewProps {
  clientId: string;
  conversationId: string;
  onConversationSelect: (conversationId: string) => void;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    leadName: "Sarah Johnson",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40",
    lastMessage: "I'm interested in your video services",
    timestamp: "2 min ago",
    status: 'active',
    unreadCount: 2
  },
  {
    id: "conv2", 
    leadName: "Mike Chen",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
    lastMessage: "What packages do you offer?",
    timestamp: "15 min ago",
    status: 'pending',
    unreadCount: 1
  },
  {
    id: "conv3",
    leadName: "Emily Davis",
    lastMessage: "Thanks for the information!",
    timestamp: "1 hour ago",
    status: 'closed',
    unreadCount: 0
  }
];

const mockMessages: { [key: string]: Message[] } = {
  "conv1": [
    {
      id: "msg1",
      senderId: "lead1",
      senderName: "Sarah Johnson",
      content: "Hi! I saw your video work and I'm really impressed.",
      timestamp: "2:30 PM",
      isFromClient: false
    },
    {
      id: "msg2",
      senderId: "admin",
      senderName: "Admin",
      content: "Thank you! I'd love to learn more about your project needs.",
      timestamp: "2:32 PM",
      isFromClient: true
    },
    {
      id: "msg3",
      senderId: "lead1", 
      senderName: "Sarah Johnson",
      content: "I'm interested in your video services for my business",
      timestamp: "2:35 PM",
      isFromClient: false
    }
  ]
};

export function ConversationView({ clientId, conversationId, onConversationSelect }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (conversationId) {
      const conversation = mockConversations.find(c => c.id === conversationId);
      setSelectedConversation(conversation || null);
      setMessages(mockMessages[conversationId] || []);
    }
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "admin",
      senderName: "Admin", 
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromClient: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      {!conversationId ? (
        <div className="space-y-2">
          <h3 className="font-medium mb-4">Active Conversations</h3>
          {mockConversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onConversationSelect(conversation.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.leadAvatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{conversation.leadName}</p>
                      <Badge 
                        variant={conversation.status === 'active' ? 'default' : 
                               conversation.status === 'pending' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Conversation Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onConversationSelect("")}
            >
              ← Back
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedConversation?.leadAvatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedConversation?.leadName}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isFromClient && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.isFromClient ? 'order-first' : ''}`}>
                    <div 
                      className={`rounded-lg p-3 ${
                        message.isFromClient 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp}
                    </p>
                  </div>
                  {message.isFromClient && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
