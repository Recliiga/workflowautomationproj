
import { LeadStatus } from "../LeadStatusManager";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromClient: boolean;
}

export interface Conversation {
  id: string;
  leadName: string;
  leadAvatar?: string;
  lastMessage: string;
  timestamp: string;
  status: LeadStatus;
  unreadCount: number;
}
