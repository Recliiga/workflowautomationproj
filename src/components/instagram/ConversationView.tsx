
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, ArrowLeft, Clock, MessageSquare, Phone, Video } from "lucide-react";

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
  },
  {
    id: "conv4",
    leadName: "Alex Thompson",
    leadAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40",
    lastMessage: "When can we schedule a call?",
    timestamp: "3 hours ago",
    status: 'active',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!conversationId ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Conversations</h3>
            <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
              {mockConversations.length} total
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockConversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-950/20 dark:hover:to-purple-950/20 transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-pink-400"
                onClick={() => onConversationSelect(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.leadAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      {conversation.status === 'active' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{conversation.leadName}</p>
                        <Badge 
                          className={getStatusColor(conversation.status)}
                        >
                          {conversation.status}
                        </Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{conversation.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Enhanced Conversation Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onConversationSelect("")}
              className="hover:bg-white/50 dark:hover:bg-black/20"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation?.leadAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedConversation?.leadName}</p>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isFromClient && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConversation?.leadAvatar} />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.isFromClient ? 'order-first' : ''}`}>
                    <div 
                      className={`rounded-2xl p-3 ${
                        message.isFromClient 
                          ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white ml-auto shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                      {message.timestamp}
                    </p>
                  </div>
                  {message.isFromClient && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Enhanced Message Input */}
          <div className="border-t p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex gap-3">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-pink-400 dark:focus:border-pink-500"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
