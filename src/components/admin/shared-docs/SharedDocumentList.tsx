
import { SharedDocument } from "../tabs/SharedDocumentsTab";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";

interface SharedDocumentListProps {
  documents: SharedDocument[];
  onEdit: (document: SharedDocument) => void;
  onDelete: (documentId: string) => void;
}

export function SharedDocumentList({ documents, onEdit, onDelete }: SharedDocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No shared documents</h3>
        <p className="text-muted-foreground">Create your first shared document to get started.</p>
      </div>
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Available For</TableHead>
            <TableHead>Assigned Users</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.title}</TableCell>
              <TableCell>{getAvailabilityBadge(doc.availableFor)}</TableCell>
              <TableCell>{doc.assignedUsers.length} users</TableCell>
              <TableCell>{format(doc.updatedAt, "MMM dd, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(doc)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
