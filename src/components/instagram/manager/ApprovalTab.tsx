
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { MessageApprovalSystem } from "../MessageApprovalSystem";

interface ApprovalTabProps {
  selectedConversationId: string;
  onApproveMessage: (messageId: string, content: string) => void;
  onRejectMessage: (messageId: string, reason: string) => void;
}

export function ApprovalTab({ 
  selectedConversationId, 
  onApproveMessage, 
  onRejectMessage 
}: ApprovalTabProps) {
  return (
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
          onApproveMessage={onApproveMessage}
          onRejectMessage={onRejectMessage}
        />
      </CardContent>
    </Card>
  );
}
