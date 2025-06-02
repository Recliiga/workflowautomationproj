
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { SalesStage } from "./types";

interface SalesStageNavigationProps {
  stages: SalesStage[];
  currentStage: string;
}

export function SalesStageNavigation({ stages, currentStage }: SalesStageNavigationProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sales Journey</h3>
      </div>
      <TabsList className="grid grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-gray-800">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          return (
            <TabsTrigger 
              key={stage.id} 
              value={stage.id} 
              className={`flex flex-col items-center gap-2 p-3 relative ${
                isActive 
                  ? 'bg-white dark:bg-gray-700 shadow-md' 
                  : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? stage.color : 'bg-gray-400'} text-white transition-colors`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{stage.label}</span>
              {index < stages.length - 1 && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
}
