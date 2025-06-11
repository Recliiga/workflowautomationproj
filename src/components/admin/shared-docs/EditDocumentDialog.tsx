
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SharedDocument } from "../tabs/SharedDocumentsTab";
import { UserSelector } from "./UserSelector";

interface EditDocumentDialogProps {
  document: SharedDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (document: SharedDocument) => void;
}

export function EditDocumentDialog({ document, open, onOpenChange, onUpdate }: EditDocumentDialogProps) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(document.assignedUserIds);

  useEffect(() => {
    setTitle(document.title);
    setContent(document.content);
    setAssignedUserIds(document.assignedUserIds);
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || assignedUserIds.length === 0) return;

    onUpdate({
      ...document,
      title: title.trim(),
      content: content.trim(),
      assignedUserIds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Shared Document</DialogTitle>
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter document content..."
              className="min-h-[300px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || assignedUserIds.length === 0}>
              Update Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
