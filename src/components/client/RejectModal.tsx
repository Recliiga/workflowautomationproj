
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export function RejectModal({ 
  isOpen, 
  onClose, 
  rejectionReason, 
  onReasonChange, 
  onConfirm 
}: RejectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Video</DialogTitle>
          <DialogDescription>
            Please provide detailed feedback explaining why this video requires amendments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="required">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please explain what needs to be fixed..."
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="min-h-[100px]"
              required
            />
            {rejectionReason.trim().length === 0 && (
              <p className="text-xs text-red-500">This field is required</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={rejectionReason.trim().length === 0}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
