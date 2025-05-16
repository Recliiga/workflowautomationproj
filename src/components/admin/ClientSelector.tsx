
import { Client } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
}

export function ClientSelector({ 
  clients, 
  selectedClientId, 
  onClientChange 
}: ClientSelectorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="h-5 w-5" />
        <CardTitle>Select Client</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedClientId} onValueChange={onClientChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} ({client.company})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
