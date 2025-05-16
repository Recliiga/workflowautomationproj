
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Plus } from "lucide-react";
import { Freelancer } from "@/types";

interface AssignFreelancerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  clientName: string;
  freelancers: Freelancer[];
  assignedFreelancerIds: string[];
  onToggleAssignment: (clientId: string, freelancerId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function AssignFreelancerDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  freelancers,
  assignedFreelancerIds,
  onToggleAssignment,
  searchTerm,
  onSearchChange
}: AssignFreelancerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Freelancers to {clientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search freelancers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {freelancers.map((freelancer) => {
              const isAssigned = clientId && 
                assignedFreelancerIds.includes(freelancer.id);
              
              return (
                <div 
                  key={freelancer.id} 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                      <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{freelancer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {freelancer.specialties?.join(', ') || 'No specialties'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={isAssigned ? "default" : "outline"}
                    size="sm"
                    onClick={() => clientId && onToggleAssignment(clientId, freelancer.id)}
                  >
                    {isAssigned ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Assigned
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Assign
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
