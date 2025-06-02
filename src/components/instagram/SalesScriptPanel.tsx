
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Target, 
  MessageCircle,
  MessageSquare,
  Calendar
} from "lucide-react";
import { LeadInfoCard } from "./sales-script/LeadInfoCard";
import { SalesStageNavigation } from "./sales-script/SalesStageNavigation";
import { ScriptResponseCard } from "./sales-script/ScriptResponseCard";
import { mockScriptResponses } from "./sales-script/mockScriptData";
import { LeadInfo, SalesStage } from "./sales-script/types";

interface SalesScriptPanelProps {
  clientId: string;
  conversationId: string;
}

const stages: SalesStage[] = [
  { id: "discovery", label: "Discovery", icon: User, color: "bg-blue-500" },
  { id: "qualification", label: "Qualify", icon: Target, color: "bg-green-500" },
  { id: "presentation", label: "Present", icon: MessageCircle, color: "bg-purple-500" },
  { id: "closing", label: "Close", icon: Calendar, color: "bg-orange-500" }
];

export function SalesScriptPanel({ clientId, conversationId }: SalesScriptPanelProps) {
  const [currentStage, setCurrentStage] = useState<string>("discovery");
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "Sarah Johnson",
    company: "Johnson Marketing",
    interests: "Social media video content",
    budget: "$5,000-$10,000", 
    timeline: "Next month",
    notes: "Interested in ongoing content creation"
  });

  const handleLeadInfoUpdate = (field: keyof LeadInfo, value: string) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <MessageSquare className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Conversation Selected</h3>
          <p className="text-sm">Select a conversation to view AI-powered sales scripts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <Tabs value={currentStage} onValueChange={setCurrentStage} className="flex-1 flex flex-col">
        <SalesStageNavigation stages={stages} currentStage={currentStage} />
        
        <LeadInfoCard 
          leadInfo={leadInfo}
          onLeadInfoUpdate={handleLeadInfoUpdate}
        />

        <div className="flex-1 overflow-hidden">
          {stages.map((stage) => (
            <TabsContent key={stage.id} value={stage.id} className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="capitalize border-2">
                      {stage.label} Stage
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {mockScriptResponses[stage.id]?.length || 0} scripts
                    </Badge>
                  </div>
                  
                  {mockScriptResponses[stage.id]?.map((response) => (
                    <ScriptResponseCard 
                      key={response.id}
                      response={response}
                      leadInfo={leadInfo}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
