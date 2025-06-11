
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { SharedDocumentList } from "../shared-docs/SharedDocumentList";
import { CreateDocumentDialog } from "../shared-docs/CreateDocumentDialog";
import { EditDocumentDialog } from "../shared-docs/EditDocumentDialog";
import { SharedDocument } from "../tabs/SharedDocumentsTab";

export function SharedDocumentsTab() {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<SharedDocument | null>(null);

  const handleCreateDocument = (newDoc: Omit<SharedDocument, "id" | "createdAt" | "updatedAt">) => {
    const document: SharedDocument = {
      ...newDoc,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments(prev => [...prev, document]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateDocument = (updatedDoc: SharedDocument) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === updatedDoc.id 
          ? { ...updatedDoc, updatedAt: new Date() }
          : doc
      )
    );
    setEditingDocument(null);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Shared Documents
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage shared documents with specific users
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Document
          </Button>
        </CardHeader>
        <CardContent>
          <SharedDocumentList 
            documents={documents}
            onEdit={setEditingDocument}
            onDelete={handleDeleteDocument}
          />
        </CardContent>
      </Card>

      <CreateDocumentDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateDocument}
      />

      {editingDocument && (
        <EditDocumentDialog 
          document={editingDocument}
          open={!!editingDocument}
          onOpenChange={(open) => !open && setEditingDocument(null)}
          onUpdate={handleUpdateDocument}
        />
      )}
    </div>
  );
}
