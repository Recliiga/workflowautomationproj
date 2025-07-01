
import { Instagram, Users, Zap } from "lucide-react";

interface AnalyticsData {
  newFollowers: number;
  conversionRate: number;
}

interface ManagerHeaderProps {
  analyticsData: AnalyticsData;
}

export function ManagerHeader({ analyticsData }: ManagerHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-6 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg text-white">
            <Instagram className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Instagram DM Manager
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered lead management for Instagram
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>New Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analyticsData.newFollowers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4" />
              <span>Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{analyticsData.conversionRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
