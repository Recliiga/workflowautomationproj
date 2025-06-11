
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedDocument } from "../tabs/SharedDocumentsTab";

interface EditDocumentDialogProps {
  document: SharedDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (document: SharedDocument) => void;
}

export function EditDocumentDialog({ document, open, onOpenChange, onUpdate }: EditDocumentDialogProps) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [availableFor, setAvailableFor] = useState<"client" | "freelancer" | "both">(document.availableFor);

  useEffect(() => {
    setTitle(document.title);
    setContent(document.content);
    setAvailableFor(document.availableFor);
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onUpdate({
      ...document,
      title: title.trim(),
      content: content.trim(),
      availableFor,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
            <Button type="submit" disabled={!title.trim()}>
              Update Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
