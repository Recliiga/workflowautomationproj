
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
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
  );
}
