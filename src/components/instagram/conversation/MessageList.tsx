
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromClient: boolean;
}

interface MessageListProps {
  messages: Message[];
  leadAvatar?: string;
}

export function MessageList({ messages, leadAvatar }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex gap-3 ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isFromClient && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={leadAvatar} />
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
  );
}
