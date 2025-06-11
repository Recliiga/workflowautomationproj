
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { SOPChecklist, SOPItem, SOPSection } from "@/types/sop";
import { toast } from "sonner";

interface SOPModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sopData: SOPChecklist;
  onComplete: () => void;
}

export function SOPModal({ isOpen, onOpenChange, sopData, onComplete }: SOPModalProps) {
  const [checklist, setChecklist] = useState<SOPChecklist>(sopData);

  const toggleItem = (sectionId: string, itemId: string, subItemId?: string) => {
    setChecklist(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id === itemId) {
                if (subItemId && item.subItems) {
                  const updatedSubItems = item.subItems.map(subItem =>
                    subItem.id === subItemId
                      ? { ...subItem, completed: !subItem.completed }
                      : subItem
                  );
                  return { ...item, subItems: updatedSubItems };
                } else {
                  return { ...item, completed: !item.completed };
                }
              }
              return item;
            })
          };
        }
        return section;
      })
    }));
  };

  const isAllCompleted = () => {
    return checklist.sections.every(section =>
      section.items.every(item => {
        const itemCompleted = item.completed;
        const subItemsCompleted = item.subItems ? item.subItems.every(sub => sub.completed) : true;
        return itemCompleted && subItemsCompleted;
      })
    );
  };

  const handleComplete = () => {
    if (isAllCompleted()) {
      onComplete();
      toast.success("SOP checklist completed!");
      onOpenChange(false);
    } else {
      toast.error("Please complete all items before marking as complete");
    }
  };

  const getCompletionStats = () => {
    let totalItems = 0;
    let completedItems = 0;

    checklist.sections.forEach(section => {
      section.items.forEach(item => {
        totalItems++;
        if (item.completed) completedItems++;
        
        if (item.subItems) {
          item.subItems.forEach(subItem => {
            totalItems++;
            if (subItem.completed) completedItems++;
          });
        }
      });
    });

    return { totalItems, completedItems };
  };

  const { totalItems, completedItems } = getCompletionStats();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{checklist.title} - Standard Operating Procedure</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Progress: {completedItems}/{totalItems} completed</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(completedItems / totalItems) * 100}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-muted-foreground mb-4">
            <strong>Reel Structure & Style Guide:</strong>
          </div>

          {checklist.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(section.id, item.id)}
                        className="mt-0.5"
                      />
                      <label 
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                    </div>
                    
                    {item.subItems && (
                      <div className="ml-6 space-y-2">
                        {item.subItems.map((subItem) => (
                          <div key={subItem.id} className="flex items-start gap-3">
                            <Checkbox
                              id={subItem.id}
                              checked={subItem.completed}
                              onCheckedChange={() => toggleItem(section.id, item.id, subItem.id)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={subItem.id}
                              className={`text-sm cursor-pointer ${subItem.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {subItem.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {isAllCompleted() ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm">
                {isAllCompleted() ? "All items completed!" : "Complete all items to finish"}
              </span>
            </div>
            <Button 
              onClick={handleComplete}
              disabled={!isAllCompleted()}
              className="min-w-24"
            >
              Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
