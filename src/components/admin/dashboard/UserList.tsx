
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserIcon } from "lucide-react";
import { Client, Freelancer } from "@/types";

interface UserListProps {
  clients: Client[];
  freelancers: Freelancer[];
  onViewAssignments: (id: string) => void;
  onImpersonate: (role: 'client' | 'freelancer', id: string) => void;
}

export function UserList({ clients, freelancers, onViewAssignments, onImpersonate }: UserListProps) {
  return (
    <Tabs defaultValue="clients">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="clients">Clients</TabsTrigger>
        <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
      </TabsList>
      
      <TabsContent value="clients" className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{client.name}</p>
                <p className="text-xs text-muted-foreground">{client.company}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onViewAssignments(client.id)}
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onImpersonate('client', client.id)}
              >
                <UserIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="freelancers" className="space-y-4">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{freelancer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {freelancer.specialties?.join(', ') || 'No specialties'}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onViewAssignments(freelancer.id)}
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onImpersonate('freelancer', freelancer.id)}
              >
                <UserIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
