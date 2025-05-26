
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client, Freelancer } from "@/types";

interface FreelancersTabProps {
  freelancers: Freelancer[];
  clients: Client[];
  onToggleAssignment: (clientId: string, freelancerId: string) => void;
}

export function FreelancersTab({ freelancers, clients, onToggleAssignment }: FreelancersTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Freelancers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {freelancers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No freelancers found</p>
            </div>
          ) : (
            freelancers.map((freelancer) => (
              <div key={freelancer.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{freelancer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {freelancer.specialties?.join(', ') || 'No specialties listed'}
                    </p>
                    <p className="text-xs text-muted-foreground">{freelancer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm">
                      {freelancer.assignedClients?.length || 0} clients
                    </p>
                  </div>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Assign to client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem 
                          key={client.id} 
                          value={client.id}
                          onClick={() => onToggleAssignment(client.id, freelancer.id)}
                        >
                          {client.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
