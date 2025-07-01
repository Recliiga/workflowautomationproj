
import { Conversation, Message } from "./types";

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    leadName: "Sarah Johnson",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40",
    lastMessage: "I'm interested in your video services",
    timestamp: "2 min ago",
    status: 'contacted',
    unreadCount: 2
  },
  {
    id: "conv2", 
    leadName: "Mike Chen",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
    lastMessage: "What packages do you offer?",
    timestamp: "15 min ago",
    status: 'awaiting_reply',
    unreadCount: 1
  },
  {
    id: "conv3",
    leadName: "Emily Davis",
    lastMessage: "Thanks for the information!",
    timestamp: "1 hour ago",
    status: 'replied',
    unreadCount: 0
  },
  {
    id: "conv4",
    leadName: "Alex Thompson",
    leadAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40",
    lastMessage: "When can we schedule a call?",
    timestamp: "3 hours ago",
    status: 'new',
    unreadCount: 0
  }
];

export const mockMessages: { [key: string]: Message[] } = {
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
