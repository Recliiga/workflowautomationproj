
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, MessageSquare, Eye, Clock } from "lucide-react";

interface NewFollower {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  followedAt: string;
  followerCount: number;
  isVerified: boolean;
  hasStory: boolean;
  lastPostAt: string;
  accountType: "personal" | "business" | "creator";
}

interface NewFollowerDetectionProps {
  clientId: string;
  onStartConversation: (followerId: string) => void;
  onViewProfile: (followerId: string) => void;
}

const mockNewFollowers: NewFollower[] = [
  {
    id: "follower_1",
    username: "sarah_marketing",
    displayName: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40",
    followedAt: "2 min ago",
    followerCount: 1250,
    isVerified: false,
    hasStory: true,
    lastPostAt: "1 day ago",
    accountType: "business"
  },
  {
    id: "follower_2", 
    username: "mike.creative",
    displayName: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
    followedAt: "15 min ago",
    followerCount: 850,
    isVerified: false,
    hasStory: false,
    lastPostAt: "3 hours ago",
    accountType: "creator"
  },
  {
    id: "follower_3",
    username: "emily.davis.co",
    displayName: "Emily Davis",
    followedAt: "1 hour ago",
    followerCount: 2100,
    isVerified: true,
    hasStory: true,
    lastPostAt: "30 min ago",
    accountType: "business"
  },
  {
    id: "follower_4",
    username: "alex_thompson",
    displayName: "Alex Thompson", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40",
    followedAt: "3 hours ago",
    followerCount: 450,
    isVerified: false,
    hasStory: false,
    lastPostAt: "2 days ago",
    accountType: "personal"
  }
];

export function NewFollowerDetection({ clientId, onStartConversation, onViewProfile }: NewFollowerDetectionProps) {
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "business": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "creator": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "personal": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">New Followers</h3>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {mockNewFollowers.length} new today
        </Badge>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {mockNewFollowers.map((follower) => (
            <Card key={follower.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                        {follower.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {follower.hasStory && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {follower.displayName}
                      </p>
                      {follower.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                      @{follower.username}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getAccountTypeColor(follower.accountType)}>
                        {follower.accountType}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatFollowerCount(follower.followerCount)} followers
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mb-3">
                      <Clock className="h-3 w-3" />
                      <span>Followed {follower.followedAt}</span>
                      <span>•</span>
                      <span>Last post {follower.lastPostAt}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onStartConversation(follower.id)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Start Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewProfile(follower.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
