
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Target, 
  MessageCircle, 
  Calendar,
  Edit,
  Send,
  Sparkles,
  Copy,
  CheckCircle
} from "lucide-react";

interface LeadInfo {
  name: string;
  company?: string;
  interests?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}

interface SalesScriptPanelProps {
  clientId: string;
  conversationId: string;
}

interface ScriptResponse {
  id: string;
  stage: string;
  text: string;
  context: string;
  effectiveness: number;
}

const mockScriptResponses: { [stage: string]: ScriptResponse[] } = {
  "discovery": [
    {
      id: "disc1",
      stage: "discovery",
      text: "Hi {name}! Thanks for reaching out. I'd love to learn more about your business and video needs. What type of content are you looking to create?",
      context: "Initial engagement and needs assessment",
      effectiveness: 87
    },
    {
      id: "disc2", 
      stage: "discovery",
      text: "That sounds exciting! Can you tell me more about your target audience and what goals you have for this video content?",
      context: "Deeper discovery of objectives",
      effectiveness: 92
    },
    {
      id: "disc3",
      stage: "discovery", 
      text: "What's your timeline looking like for this project? And do you have a budget range in mind?",
      context: "Timeline and budget qualification",
      effectiveness: 78
    }
  ],
  "qualification": [
    {
      id: "qual1",
      stage: "qualification",
      text: "Based on what you've shared, it sounds like our {service_type} package would be perfect for {company}. Have you worked with video production companies before?",
      context: "Service matching and experience assessment",
      effectiveness: 85
    },
    {
      id: "qual2",
      stage: "qualification", 
      text: "Great! Our process typically involves {process_overview}. What questions do you have about how we work?",
      context: "Process explanation and objection handling",
      effectiveness: 90
    }
  ],
  "presentation": [
    {
      id: "pres1",
      stage: "presentation",
      text: "I'd love to show you some examples of similar work we've done for companies like {company}. Would you be interested in a quick call to discuss your project in detail?",
      context: "Portfolio showcase and meeting request",
      effectiveness: 94
    },
    {
      id: "pres2",
      stage: "presentation",
      text: "Perfect! I can walk you through our process, show you some case studies, and create a custom proposal for {company}. When works best for you this week?",
      context: "Meeting scheduling and value proposition",
      effectiveness: 88
    }
  ],
  "closing": [
    {
      id: "close1", 
      stage: "closing",
      text: "Based on everything we've discussed, I think we can create something amazing for {company}. Are you ready to move forward with the next steps?",
      context: "Direct close attempt",
      effectiveness: 82
    },
    {
      id: "close2",
      stage: "closing",
      text: "I understand you might need to think it over. What specific concerns do you have? I'm happy to address any questions.",
      context: "Objection handling and reassurance",
      effectiveness: 86
    }
  ]
};

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
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [copiedId, setCopiedId] = useState<string>("");

  const stages = [
    { id: "discovery", label: "Discovery", icon: User, color: "bg-blue-500" },
    { id: "qualification", label: "Qualify", icon: Target, color: "bg-green-500" },
    { id: "presentation", label: "Present", icon: MessageCircle, color: "bg-purple-500" },
    { id: "closing", label: "Close", icon: Calendar, color: "bg-orange-500" }
  ];

  const personalizeText = (text: string): string => {
    return text
      .replace(/{name}/g, leadInfo.name || "[Name]")
      .replace(/{company}/g, leadInfo.company || "[Company]")
      .replace(/{service_type}/g, "premium video production")
      .replace(/{process_overview}/g, "discovery call → proposal → production → delivery");
  };

  const handleResponseClick = (response: ScriptResponse) => {
    const personalizedText = personalizeText(response.text);
    navigator.clipboard.writeText(personalizedText);
    setCopiedId(response.id);
    setTimeout(() => setCopiedId(""), 2000);
    console.log("Copied to clipboard:", personalizedText);
  };

  const handleLeadInfoUpdate = (field: keyof LeadInfo, value: string) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return "text-green-600 dark:text-green-400";
    if (effectiveness >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
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
        {/* Enhanced Stage Navigation */}
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

        {/* Enhanced Lead Information Card */}
        <Card className="mb-6 border-2 border-gray-100 dark:border-gray-800">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Lead Information
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditingLead(!isEditingLead)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isEditingLead ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                    <Input
                      id="name"
                      value={leadInfo.name}
                      onChange={(e) => handleLeadInfoUpdate('name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-xs font-medium">Company</Label>
                    <Input
                      id="company"
                      value={leadInfo.company || ''}
                      onChange={(e) => handleLeadInfoUpdate('company', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget" className="text-xs font-medium">Budget</Label>
                    <Input
                      id="budget"
                      value={leadInfo.budget || ''}
                      onChange={(e) => handleLeadInfoUpdate('budget', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-xs font-medium">Timeline</Label>
                    <Input
                      id="timeline"
                      value={leadInfo.timeline || ''}
                      onChange={(e) => handleLeadInfoUpdate('timeline', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
                  <Textarea
                    id="notes"
                    value={leadInfo.notes || ''}
                    onChange={(e) => handleLeadInfoUpdate('notes', e.target.value)}
                    className="h-20 resize-none"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsEditingLead(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong className="text-gray-600 dark:text-gray-400">Name:</strong> {leadInfo.name}</div>
                {leadInfo.company && <div><strong className="text-gray-600 dark:text-gray-400">Company:</strong> {leadInfo.company}</div>}
                {leadInfo.budget && <div><strong className="text-gray-600 dark:text-gray-400">Budget:</strong> {leadInfo.budget}</div>}
                {leadInfo.timeline && <div><strong className="text-gray-600 dark:text-gray-400">Timeline:</strong> {leadInfo.timeline}</div>}
                {leadInfo.notes && (
                  <div className="col-span-2">
                    <strong className="text-gray-600 dark:text-gray-400">Notes:</strong> {leadInfo.notes}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Script Responses */}
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
                    <Card key={response.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-400">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1 pr-4">
                              {personalizeText(response.text)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getEffectivenessColor(response.effectiveness)}`}
                              >
                                {response.effectiveness}%
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex-1">
                              {response.context}
                            </p>
                            <Button 
                              size="sm"
                              onClick={() => handleResponseClick(response)}
                              className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm group-hover:shadow-md transition-all duration-200"
                            >
                              {copiedId === response.id ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
