
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedDocument } from "../tabs/SharedDocumentsTab";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (document: Omit<SharedDocument, "id" | "createdAt" | "updatedAt">) => void;
}

export function CreateDocumentDialog({ open, onOpenChange, onCreate }: CreateDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [availableFor, setAvailableFor] = useState<"client" | "freelancer" | "both">("client");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      content: content.trim(),
      availableFor,
      assignedUsers: [], // Will be populated later when users are assigned
    });

    // Reset form
    setTitle("");
    setContent("");
    setAvailableFor("client");
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setAvailableFor("client");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
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

          <div className="space-y-2">
            <Label htmlFor="availableFor">Available For</Label>
            <Select value={availableFor} onValueChange={(value: "client" | "freelancer" | "both") => setAvailableFor(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Clients Only</SelectItem>
                <SelectItem value="freelancer">Freelancers Only</SelectItem>
                <SelectItem value="both">Both Clients & Freelancers</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Button type="submit" disabled={!title.trim()}>
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
