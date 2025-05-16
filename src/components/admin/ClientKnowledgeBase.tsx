
import { KnowledgeBaseManager } from "./knowledge-base/KnowledgeBaseManager";

interface ClientKnowledgeBaseProps {
  clientId: string;
  clientName: string;
  clients?: {
    id: string;
    name: string;
  }[];
}

export function ClientKnowledgeBase({ 
  clientId,
  clientName
}: ClientKnowledgeBaseProps) {
  return <KnowledgeBaseManager clientId={clientId} clientName={clientName} />;
}
