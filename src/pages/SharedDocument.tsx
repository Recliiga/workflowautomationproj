
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Mock data - in a real app, this would come from an API
const mockDocuments = [
  {
    id: "1",
    title: "Project Guidelines",
    content: "This document contains the project guidelines and best practices for all team members.\n\nPlease follow these guidelines when working on any project:\n\n1. Always communicate clearly\n2. Meet deadlines\n3. Ask questions when uncertain\n\nFeel free to add your own notes and suggestions below:",
    availableFor: "both" as const,
  },
  {
    id: "2", 
    title: "Brand Standards",
    content: "Brand guidelines and standards for client projects.\n\nColors:\n- Primary: #1a365d\n- Secondary: #2d3748\n\nFonts:\n- Headers: Inter\n- Body: Open Sans\n\nPlease ensure all deliverables follow these standards.",
    availableFor: "client" as const,
  },
  {
    id: "3",
    title: "Technical Requirements",
    content: "Technical specifications and requirements for development projects.\n\nFrameworks:\n- React for frontend\n- Node.js for backend\n\nCode standards:\n- Use TypeScript\n- Follow ESLint rules\n- Write unit tests\n\nAdd your technical notes here:",
    availableFor: "freelancer" as const,
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

  const getAvailabilityBadge = (availableFor: string) => {
    switch (availableFor) {
      case "client":
        return <Badge variant="secondary">Clients</Badge>;
      case "freelancer":
        return <Badge variant="outline">Freelancers</Badge>;
      case "both":
        return <Badge>Both</Badge>;
      default:
        return <Badge variant="secondary">{availableFor}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-muted-foreground">Available for:</span>
              {getAvailabilityBadge(document.availableFor)}
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
                This document is shared between admin and {document.availableFor === "both" ? "all users" : document.availableFor + "s"}. 
                Changes made here will be visible to all authorized users.
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
