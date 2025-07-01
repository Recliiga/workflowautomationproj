
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Edit3, Send, AlertTriangle, Eye } from "lucide-react";

interface PendingMessage {
  id: string;
  content: string;
  recipientName: string;
  conversationId: string;
  generatedAt: string;
  riskLevel: "low" | "medium" | "high";
  suggestedEdits?: string[];
}

interface MessageApprovalSystemProps {
  conversationId: string;
  onApproveMessage: (messageId: string, content: string) => void;
  onRejectMessage: (messageId: string, reason: string) => void;
}

const mockPendingMessages: PendingMessage[] = [
  {
    id: "msg_pending_1",
    content: "Hi Sarah! I noticed you followed us recently. We'd love to help you create amazing video content for your business. Would you be interested in learning about our video packages?",
    recipientName: "Sarah Johnson",
    conversationId: "conv1",
    generatedAt: "2 min ago",
    riskLevel: "low",
    suggestedEdits: []
  },
  {
    id: "msg_pending_2", 
    content: "Thanks for your interest! Our premium package includes 10 videos per month starting at $2,500. This is a limited-time offer ending soon - would you like to book a call today?",
    recipientName: "Mike Chen",
    conversationId: "conv2", 
    generatedAt: "5 min ago",
    riskLevel: "medium",
    suggestedEdits: ["Consider removing urgency language", "Soften the sales approach"]
  }
];

export function MessageApprovalSystem({ conversationId, onApproveMessage, onRejectMessage }: MessageApprovalSystemProps) {
  const [selectedMessage, setSelectedMessage] = useState<PendingMessage | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const pendingMessages = mockPendingMessages.filter(msg => 
    conversationId ? msg.conversationId === conversationId : true
  );

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditMessage = (message: PendingMessage) => {
    setSelectedMessage(message);
    setEditedContent(message.content);
    setIsEditing(true);
  };

  const handleApprove = (message: PendingMessage) => {
    const finalContent = isEditing ? editedContent : message.content;
    onApproveMessage(message.id, finalContent);
    setIsEditing(false);
    setSelectedMessage(null);
  };

  const handleReject = (message: PendingMessage) => {
    onRejectMessage(message.id, "Manual rejection by reviewer");
    setIsEditing(false);
    setSelectedMessage(null);
  };

  if (pendingMessages.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No pending messages for approval</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Message Approval Queue</h3>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
          {pendingMessages.length} pending
        </Badge>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {pendingMessages.map((message) => (
            <Card key={message.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    To: {message.recipientName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(message.riskLevel)}>
                      {message.riskLevel} risk
                    </Badge>
                    <span className="text-xs text-gray-500">{message.generatedAt}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isEditing && selectedMessage?.id === message.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Edit the message content..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(message)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Approve & Send
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {message.suggestedEdits && message.suggestedEdits.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Suggested Improvements:
                          </span>
                        </div>
                        <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                          {message.suggestedEdits.map((edit, index) => (
                            <li key={index}>• {edit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(message)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMessage(message)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(message)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
