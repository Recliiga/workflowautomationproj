
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KnowledgeBaseAccordion } from "./knowledge-base/KnowledgeBaseAccordion";
import { KnowledgeBaseItem } from "./knowledge-base/types";

interface ClientKnowledgeBaseProps {
  clientId: string;
  clientName: string;
  clients?: {
    id: string;
    name: string;
  }[];
}

// Default knowledge base structure
const DEFAULT_KNOWLEDGE_ITEMS: KnowledgeBaseItem[] = [
  { id: "voice", title: "Brand Voice & Tone", content: "Friendly, professional, and approachable. Use conversational language that avoids jargon." },
  { id: "products", title: "Product/Service Descriptions", content: "Our software helps businesses streamline their workflow and increase productivity. Focus on time-saving features and user-friendly interface." },
  { id: "pillars", title: "Messaging Pillars", content: "1. Efficiency\n2. Reliability\n3. Support\n4. Innovation" },
  { id: "objections", title: "Objections/Pain Points", content: "1. \"It's too expensive\" - Focus on ROI and long-term value\n2. \"It's too complicated\" - Emphasize ease of use and training" },
  { id: "cta", title: "CTA Library", content: "1. \"Start your free trial today\"\n2. \"Book a demo\"\n3. \"Join thousands of satisfied customers\"\n4. \"See how it works in 2 minutes\"" },
  { id: "keywords", title: "Keywords/Themes", content: "productivity, efficiency, time-saving, automation, workflow, business solution" }
];

export function ClientKnowledgeBase({ 
  clientId,
  clientName,
  clients
}: ClientKnowledgeBaseProps) {
  // Initialize knowledge base with mock data for the selected client
  const [knowledgeBase, setKnowledgeBase] = useState<{ [clientId: string]: KnowledgeBaseItem[] }>({
    [clientId]: [...DEFAULT_KNOWLEDGE_ITEMS]
  });

  const selectedClientKnowledge = knowledgeBase[clientId] || [...DEFAULT_KNOWLEDGE_ITEMS];

  const handleContentChange = (itemId: string, newContent: string) => {
    setKnowledgeBase(prev => {
      const clientKnowledge = prev[clientId] || [...DEFAULT_KNOWLEDGE_ITEMS];
      
      return {
        ...prev,
        [clientId]: clientKnowledge.map(item => 
          item.id === itemId ? { ...item, content: newContent } : item
        )
      };
    });
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    toast.success(`Knowledge base updated for ${clientName}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base for {clientName}</CardTitle>
        <CardDescription>
          Manage content guidance data for {clientName} to improve content generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <KnowledgeBaseAccordion 
            knowledgeItems={selectedClientKnowledge}
            clientId={clientId}
            clientName={clientName}
            onContentChange={handleContentChange}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
