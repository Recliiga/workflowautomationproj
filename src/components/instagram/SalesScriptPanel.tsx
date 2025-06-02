
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
  Send
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
}

const mockScriptResponses: { [stage: string]: ScriptResponse[] } = {
  "discovery": [
    {
      id: "disc1",
      stage: "discovery",
      text: "Hi {name}! Thanks for reaching out. I'd love to learn more about your business and video needs. What type of content are you looking to create?",
      context: "Initial engagement and needs assessment"
    },
    {
      id: "disc2", 
      stage: "discovery",
      text: "That sounds exciting! Can you tell me more about your target audience and what goals you have for this video content?",
      context: "Deeper discovery of objectives"
    },
    {
      id: "disc3",
      stage: "discovery", 
      text: "What's your timeline looking like for this project? And do you have a budget range in mind?",
      context: "Timeline and budget qualification"
    }
  ],
  "qualification": [
    {
      id: "qual1",
      stage: "qualification",
      text: "Based on what you've shared, it sounds like our {service_type} package would be perfect for {company}. Have you worked with video production companies before?",
      context: "Service matching and experience assessment"
    },
    {
      id: "qual2",
      stage: "qualification", 
      text: "Great! Our process typically involves {process_overview}. What questions do you have about how we work?",
      context: "Process explanation and objection handling"
    }
  ],
  "presentation": [
    {
      id: "pres1",
      stage: "presentation",
      text: "I'd love to show you some examples of similar work we've done for companies like {company}. Would you be interested in a quick call to discuss your project in detail?",
      context: "Portfolio showcase and meeting request"
    },
    {
      id: "pres2",
      stage: "presentation",
      text: "Perfect! I can walk you through our process, show you some case studies, and create a custom proposal for {company}. When works best for you this week?",
      context: "Meeting scheduling and value proposition"
    }
  ],
  "closing": [
    {
      id: "close1", 
      stage: "closing",
      text: "Based on everything we've discussed, I think we can create something amazing for {company}. Are you ready to move forward with the next steps?",
      context: "Direct close attempt"
    },
    {
      id: "close2",
      stage: "closing",
      text: "I understand you might need to think it over. What specific concerns do you have? I'm happy to address any questions.",
      context: "Objection handling and reassurance"
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

  const stages = [
    { id: "discovery", label: "Discovery", icon: User },
    { id: "qualification", label: "Qualification", icon: Target },
    { id: "presentation", label: "Presentation", icon: MessageCircle },
    { id: "closing", label: "Closing", icon: Calendar }
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
    console.log("Sending response:", personalizedText);
    // This would integrate with the conversation view to send the message
  };

  const handleLeadInfoUpdate = (field: keyof LeadInfo, value: string) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a conversation to view AI sales script</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={currentStage} onValueChange={setCurrentStage} className="flex-1 flex flex-col">
        {/* Stage Navigation */}
        <TabsList className="grid grid-cols-4 mb-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <TabsTrigger key={stage.id} value={stage.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{stage.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Lead Information Card */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Lead Information</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditingLead(!isEditingLead)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingLead ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Name</Label>
                  <Input
                    id="name"
                    value={leadInfo.name}
                    onChange={(e) => handleLeadInfoUpdate('name', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs">Company</Label>
                  <Input
                    id="company"
                    value={leadInfo.company || ''}
                    onChange={(e) => handleLeadInfoUpdate('company', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="budget" className="text-xs">Budget</Label>
                  <Input
                    id="budget"
                    value={leadInfo.budget || ''}
                    onChange={(e) => handleLeadInfoUpdate('budget', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-xs">Notes</Label>
                  <Textarea
                    id="notes"
                    value={leadInfo.notes || ''}
                    onChange={(e) => handleLeadInfoUpdate('notes', e.target.value)}
                    className="h-16 resize-none"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsEditingLead(false)}
                  className="w-full"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {leadInfo.name}</div>
                {leadInfo.company && <div><strong>Company:</strong> {leadInfo.company}</div>}
                {leadInfo.budget && <div><strong>Budget:</strong> {leadInfo.budget}</div>}
                {leadInfo.timeline && <div><strong>Timeline:</strong> {leadInfo.timeline}</div>}
                {leadInfo.notes && <div><strong>Notes:</strong> {leadInfo.notes}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Script Responses for Each Stage */}
        <div className="flex-1 overflow-hidden">
          {stages.map((stage) => (
            <TabsContent key={stage.id} value={stage.id} className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="capitalize">
                      {stage.label} Stage
                    </Badge>
                  </div>
                  
                  {mockScriptResponses[stage.id]?.map((response) => (
                    <Card key={response.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed">
                            {personalizeText(response.text)}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {response.context}
                            </p>
                            <Button 
                              size="sm"
                              onClick={() => handleResponseClick(response)}
                              className="h-7"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Use
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
