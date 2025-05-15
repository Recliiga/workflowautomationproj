
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Pencil, Plus, Search, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Client, Freelancer } from "@/types";
import { toast } from "sonner";

// Mock users for demonstration
const MOCK_CLIENTS: Client[] = [
  {
    id: "2",
    name: "Client User",
    email: "client@company.com",
    role: "client",
    company: "Acme Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3"]
  },
  {
    id: "4",
    name: "Jane Cooper",
    email: "jane@example.com",
    role: "client",
    company: "Globex Corp",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3", "5"]
  }
];

const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: "3",
    name: "Freelancer User",
    email: "freelancer@creator.com",
    role: "freelancer",
    certifications: ["Adobe Certified Expert", "YouTube Content Creation"],
    specialties: ["Motion Graphics", "Video Editing"],
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["2", "4"]
  },
  {
    id: "5",
    name: "Michael Johnson",
    email: "michael@creator.com",
    role: "freelancer",
    certifications: ["Final Cut Pro Certified"],
    specialties: ["Commercial Editing", "Sound Design"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["4"]
  }
];

export default function Users() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [freelancers, setFreelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const filteredClients = clients.filter(
    client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFreelancers = freelancers.filter(
    freelancer => 
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (freelancer.specialties && freelancer.specialties.some(
        s => s.toLowerCase().includes(searchTerm.toLowerCase())
      ))
  );
  
  const handleAssignFreelancer = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsAssignModalOpen(true);
  };
  
  const toggleFreelancerAssignment = (clientId: string, freelancerId: string) => {
    // Find the client to update
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Check if freelancer is already assigned
    const isAssigned = client.assignedFreelancers?.includes(freelancerId);
    
    if (isAssigned) {
      // Remove assignment
      setClients(prev => 
        prev.map(c => 
          c.id === clientId 
            ? {
                ...c, 
                assignedFreelancers: c.assignedFreelancers?.filter(id => id !== freelancerId)
              }
            : c
        )
      );
      
      setFreelancers(prev => 
        prev.map(f => 
          f.id === freelancerId 
            ? {
                ...f, 
                assignedClients: f.assignedClients?.filter(id => id !== clientId)
              }
            : f
        )
      );
      
      toast.success("Freelancer unassigned from client");
    } else {
      // Add assignment
      setClients(prev => 
        prev.map(c => 
          c.id === clientId 
            ? {
                ...c, 
                assignedFreelancers: [...(c.assignedFreelancers || []), freelancerId]
              }
            : c
        )
      );
      
      setFreelancers(prev => 
        prev.map(f => 
          f.id === freelancerId 
            ? {
                ...f, 
                assignedClients: [...(f.assignedClients || []), clientId]
              }
            : f
        )
      );
      
      toast.success("Freelancer assigned to client");
    }
  };
  
  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };
  
  const getFreelancerById = (freelancerId: string) => {
    return freelancers.find(f => f.id === freelancerId);
  };
  
  const getAssignedFreelancers = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.assignedFreelancers || [];
  };
  
  return (
    <AppLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage clients and freelancers</p>
        </div>
        
        <div className="flex items-center max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="clients">
          <TabsList>
            <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
            <TabsTrigger value="freelancers">Freelancers ({freelancers.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients" className="mt-6">
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
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No clients found</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
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
                            onClick={() => handleAssignFreelancer(client.id)}
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
          </TabsContent>
          
          <TabsContent value="freelancers" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Freelancers</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Freelancer
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {filteredFreelancers.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No freelancers found</p>
                    </div>
                  ) : (
                    filteredFreelancers.map((freelancer) => (
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
                                  onClick={() => toggleFreelancerAssignment(client.id, freelancer.id)}
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
          </TabsContent>
        </Tabs>
        
        {/* Assign Freelancers Modal */}
        <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Assign Freelancers to {getClientById(selectedClientId || "")?.company}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input
                placeholder="Search freelancers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredFreelancers.map((freelancer) => {
                  const isAssigned = selectedClientId && 
                    getAssignedFreelancers(selectedClientId).includes(freelancer.id);
                  
                  return (
                    <div 
                      key={freelancer.id} 
                      className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50"
                    >
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
                      <Button
                        variant={isAssigned ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectedClientId && toggleFreelancerAssignment(selectedClientId, freelancer.id)}
                      >
                        {isAssigned ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
