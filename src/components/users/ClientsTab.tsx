
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Plus } from "lucide-react";
import { Client } from "@/types";

interface ClientsTabProps {
  clients: Client[];
  onAssignFreelancer: (clientId: string) => void;
}

export function ClientsTab({ clients, onAssignFreelancer }: ClientsTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clients</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No clients found</p>
            </div>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm">
                      {client.assignedFreelancers?.length || 0} freelancers
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAssignFreelancer(client.id)}
                  >
                    Assign
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
