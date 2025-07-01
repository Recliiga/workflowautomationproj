
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Clock } from "lucide-react";
import { LeadStatusManager, LeadStatus } from "../LeadStatusManager";

interface Conversation {
  id: string;
  leadName: string;
  leadAvatar?: string;
  lastMessage: string;
  timestamp: string;
  status: LeadStatus;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
  onStatusChange: (conversationId: string, newStatus: LeadStatus) => void;
  onShowNewFollowers: () => void;
}

export function ConversationList({ 
  conversations, 
  onConversationSelect, 
  onStatusChange, 
  onShowNewFollowers 
}: ConversationListProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lead Conversations</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onShowNewFollowers}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <User className="h-4 w-4 mr-1" />
            New Followers
          </Button>
          <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
            {conversations.length} total
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {conversations.map((conversation) => (
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
                  {conversation.status === 'replied' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{conversation.leadName}</p>
                    <LeadStatusManager
                      currentStatus={conversation.status}
                      onStatusChange={(newStatus) => onStatusChange(conversation.id, newStatus)}
                      leadName={conversation.leadName}
                    />
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
  );
}
