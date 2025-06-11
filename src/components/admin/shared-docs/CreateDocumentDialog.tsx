
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SharedDocument } from "../tabs/SharedDocumentsTab";
import { UserSelector } from "./UserSelector";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (document: Omit<SharedDocument, "id" | "createdAt" | "updatedAt">) => void;
}

export function CreateDocumentDialog({ open, onOpenChange, onCreate }: CreateDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || assignedUserIds.length === 0) return;

    onCreate({
      title: title.trim(),
      content: content.trim(),
      assignedUserIds,
    });

    // Reset form
    setTitle("");
    setContent("");
    setAssignedUserIds([]);
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setAssignedUserIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Shared Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              required
            />
          </div>

          <UserSelector
            selectedUserIds={assignedUserIds}
            onSelectionChange={setAssignedUserIds}
          />

          <div className="space-y-2">
            <Label htmlFor="content">Initial Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter initial document content..."
              className="min-h-[200px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || assignedUserIds.length === 0}>
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
