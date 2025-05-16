import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KnowledgeBaseAccordion } from "./KnowledgeBaseAccordion";
import { KnowledgeBaseItem } from "./types";

interface KnowledgeBaseManagerProps {
  clientId: string;
  clientName: string;
}

// Updated knowledge base structure with the new categories
const DEFAULT_KNOWLEDGE_ITEMS: KnowledgeBaseItem[] = [
  { id: "basic", title: "Basic Instructions", content: "Include any fundamental guidelines or instructions for content creation here." },
  { id: "objective", title: "Objective", content: "Define the primary goals and purpose of the content." },
  { id: "structure", title: "Structure", content: "Outline how the content should be organized and formatted." },
  { id: "additional", title: "Additional Information", content: "Any supplementary details or context that would be helpful for content creation." },
  { id: "examples", title: "Examples", content: "Provide sample content or references that demonstrate the desired output." }
];

export function KnowledgeBaseManager({ clientId, clientName }: KnowledgeBaseManagerProps) {
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
