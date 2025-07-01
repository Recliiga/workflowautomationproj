
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, ExternalLink, User } from "lucide-react";
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

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onStatusChange: (conversationId: string, newStatus: LeadStatus) => void;
}

export function ConversationHeader({ conversation, onBack, onStatusChange }: ConversationHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onBack}
        className="hover:bg-white/50 dark:hover:bg-black/20"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.leadAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{conversation.leadName}</p>
          <LeadStatusManager
            currentStatus={conversation.status}
            onStatusChange={(newStatus) => onStatusChange(conversation.id, newStatus)}
            leadName={conversation.leadName}
          />
        </div>
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
        <Button variant="outline" size="sm" className="flex items-center gap-1 px-3">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">Open Instagram</span>
        </Button>
      </div>
    </div>
  );
}
