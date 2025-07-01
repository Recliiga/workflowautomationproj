
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MessageSquare, Reply, Calendar, Target } from "lucide-react";

interface AnalyticsData {
  newFollowers: number;
  messagesSent: number;
  replyRate: number;
  leadsBooked: number;
  conversionRate: number;
  totalConversations: number;
  activeConversations: number;
  responseTime: string;
}

interface AnalyticsDashboardProps {
  clientId: string;
  data: AnalyticsData;
}

export function AnalyticsDashboard({ clientId, data }: AnalyticsDashboardProps) {
  const metrics = [
    {
      title: "New Followers",
      value: data.newFollowers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      change: "+12%",
      period: "this week"
    },
    {
      title: "Messages Sent", 
      value: data.messagesSent,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      change: "+8%",
      period: "today"
    },
    {
      title: "Reply Rate",
      value: `${data.replyRate}%`,
      icon: Reply,
      color: "text-green-600", 
      bgColor: "bg-green-50 dark:bg-green-950/20",
      change: "+3%",
      period: "this month"
    },
    {
      title: "Leads Booked",
      value: data.leadsBooked,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20", 
      change: "+15%",
      period: "this week"
    },
    {
      title: "Conversion Rate",
      value: `${data.conversionRate}%`,
      icon: Target,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
      change: "+5%", 
      period: "overall"
    },
    {
      title: "Avg Response Time",
      value: data.responseTime,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      change: "-2min",
      period: "improvement"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics Overview</h3>
        <Badge variant="outline" className="text-xs">
          Real-time
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-green-600 font-medium">{metric.change}</span>
                      <span className="text-gray-500">{metric.period}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">
                  {metric.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active Conversations</span>
            <span className="font-medium">{data.activeConversations}/{data.totalConversations}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
