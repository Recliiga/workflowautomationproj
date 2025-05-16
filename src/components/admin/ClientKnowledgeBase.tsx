
import { useState } from "react";
import { Client } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
}

interface ClientKnowledgeBaseProps {
  clients: Client[];
}

export function ClientKnowledgeBase({ clients }: ClientKnowledgeBaseProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "");
  const [knowledgeBase, setKnowledgeBase] = useState<{ [clientId: string]: KnowledgeBaseItem[] }>({
    // Initialize with mock data for the first client
    [clients[0]?.id || ""]: [
      { id: "voice", title: "Brand Voice & Tone", content: "Friendly, professional, and approachable. Use conversational language that avoids jargon." },
      { id: "products", title: "Product/Service Descriptions", content: "Our software helps businesses streamline their workflow and increase productivity. Focus on time-saving features and user-friendly interface." },
      { id: "pillars", title: "Messaging Pillars", content: "1. Efficiency\n2. Reliability\n3. Support\n4. Innovation" },
      { id: "objections", title: "Objections/Pain Points", content: "1. \"It's too expensive\" - Focus on ROI and long-term value\n2. \"It's too complicated\" - Emphasize ease of use and training" },
      { id: "cta", title: "CTA Library", content: "1. \"Start your free trial today\"\n2. \"Book a demo\"\n3. \"Join thousands of satisfied customers\"\n4. \"See how it works in 2 minutes\"" },
      { id: "keywords", title: "Keywords/Themes", content: "productivity, efficiency, time-saving, automation, workflow, business solution" }
    ]
  });

  const selectedClientKnowledge = knowledgeBase[selectedClientId] || [];

  const handleContentChange = (itemId: string, newContent: string) => {
    setKnowledgeBase(prev => ({
      ...prev,
      [selectedClientId]: prev[selectedClientId].map(item => 
        item.id === itemId ? { ...item, content: newContent } : item
      )
    }));
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    toast.success("Knowledge base updated successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client Knowledge Base</CardTitle>
        <CardDescription>
          Manage AI guidance data for each client to improve content generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedClientId} onValueChange={setSelectedClientId}>
          <TabsList className="mb-4">
            {clients.map(client => (
              <TabsTrigger key={client.id} value={client.id}>
                {client.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {clients.map(client => (
            <TabsContent key={client.id} value={client.id} className="space-y-4">
              <Accordion type="multiple" className="w-full">
                {selectedClientKnowledge.map(item => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor={`${client.id}-${item.id}`} className="text-sm">
                          {item.title} for {client.name}
                        </Label>
                        <Textarea
                          id={`${client.id}-${item.id}`}
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
