
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CLIENTS, MOCK_FREELANCERS } from "@/data/mockUsers";

// Mock data - in a real app, this would come from an API
const mockDocuments = [
  {
    id: "1",
    title: "Project Guidelines",
    content: "This document contains the project guidelines and best practices for all team members.\n\nPlease follow these guidelines when working on any project:\n\n1. Always communicate clearly\n2. Meet deadlines\n3. Ask questions when uncertain\n\nFeel free to add your own notes and suggestions below:",
    assignedUserIds: ["client1", "client2", "freelancer1"],
  },
  {
    id: "2", 
    title: "Brand Standards",
    content: "Brand guidelines and standards for client projects.\n\nColors:\n- Primary: #1a365d\n- Secondary: #2d3748\n\nFonts:\n- Headers: Inter\n- Body: Open Sans\n\nPlease ensure all deliverables follow these standards.",
    assignedUserIds: ["client1", "client3"],
  },
  {
    id: "3",
    title: "Technical Requirements",
    content: "Technical specifications and requirements for development projects.\n\nFrameworks:\n- React for frontend\n- Node.js for backend\n\nCode standards:\n- Use TypeScript\n- Follow ESLint rules\n- Write unit tests\n\nAdd your technical notes here:",
    assignedUserIds: ["freelancer1", "freelancer2"],
  },
];

export default function SharedDocument() {
  const { documentId } = useParams<{ documentId: string }>();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [document, setDocument] = useState<typeof mockDocuments[0] | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Find the document by ID
    const foundDoc = mockDocuments.find(doc => doc.id === documentId);
    if (foundDoc) {
      setDocument(foundDoc);
      setContent(foundDoc.content);
    }
  }, [documentId]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Document saved successfully!");
    setIsSaving(false);
  };

  const getUserName = (userId: string) => {
    const client = MOCK_CLIENTS.find(c => c.id === userId);
    const freelancer = MOCK_FREELANCERS.find(f => f.id === userId);
    return client?.name || freelancer?.name || "Unknown User";
  };

  const getUserType = (userId: string) => {
    const isClient = MOCK_CLIENTS.some(c => c.id === userId);
    return isClient ? "Client" : "Freelancer";
  };

  if (!document) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Document not found</h2>
            <p className="text-muted-foreground">The requested document could not be found.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Shared with:</span>
              <div className="flex gap-1">
                {document.assignedUserIds.map((userId) => (
                  <Badge 
                    key={userId}
                    variant={getUserType(userId) === "Client" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {getUserName(userId)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Shared Document
            </CardTitle>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                This document is shared with specific users. 
                Changes made here will be visible to all assigned collaborators.
              </div>
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your content here..."
                className="min-h-[500px] font-mono text-sm"
              />
              
              <div className="text-xs text-muted-foreground">
                Last edited by: {user?.name || "Unknown"} • Just now
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
