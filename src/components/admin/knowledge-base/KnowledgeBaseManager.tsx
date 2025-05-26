
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KnowledgeBaseAccordion } from "./KnowledgeBaseAccordion";
import { KnowledgeBaseItem } from "./types";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  
  // Track which accordion items are expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  const handleToggleItem = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleExpandAll = () => {
    // Extract all item IDs
    const allItemIds = selectedClientKnowledge.map(item => item.id);
    setExpandedItems(allItemIds);
  };

  const handleCollapseAll = () => {
    setExpandedItems([]);
  };
  
  // Check if all items are currently expanded
  const allExpanded = selectedClientKnowledge.length > 0 && 
    expandedItems.length === selectedClientKnowledge.length;

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
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            >
              {allExpanded ? (
                <>
                  <ChevronUp className="mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1" />
                  Expand All
                </>
              )}
            </Button>
          </div>
          
          <KnowledgeBaseAccordion 
            knowledgeItems={selectedClientKnowledge}
            clientId={clientId}
            clientName={clientName}
            expandedItems={expandedItems}
            onContentChange={handleContentChange}
            onToggleItem={handleToggleItem}
          />
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
