
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { AnalyticsDashboard } from "../AnalyticsDashboard";

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

interface AnalyticsTabProps {
  selectedClientId: string;
  analyticsData: AnalyticsData;
}

export function AnalyticsTab({ selectedClientId, analyticsData }: AnalyticsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard 
              clientId={selectedClientId}
              data={analyticsData}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Advanced analytics charts will be implemented by the developer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
