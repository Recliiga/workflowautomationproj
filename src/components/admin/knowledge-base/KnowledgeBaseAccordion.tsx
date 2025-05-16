
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { KnowledgeBaseItem } from "./types";

interface KnowledgeBaseAccordionProps {
  knowledgeItems: KnowledgeBaseItem[];
  clientId: string;
  clientName: string;
  onContentChange: (itemId: string, newContent: string) => void;
}

export function KnowledgeBaseAccordion({
  knowledgeItems,
  clientId,
  clientName,
  onContentChange
}: KnowledgeBaseAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {knowledgeItems.map(item => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label htmlFor={`${clientId}-${item.id}`} className="text-sm">
                {item.title} for {clientName}
              </Label>
              <Textarea
                id={`${clientId}-${item.id}`}
                value={item.content}
                onChange={(e) => onContentChange(item.id, e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
