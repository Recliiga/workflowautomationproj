
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Client, Freelancer } from "@/types";
import { AssignFreelancerDialog } from "@/components/users/AssignFreelancerDialog";
import { UserSearch } from "@/components/users/UserSearch";
import { UserManagementTabs } from "@/components/users/UserManagementTabs";
import { UserCreationForm } from "@/components/admin/UserCreationForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import mock data
import { MOCK_CLIENTS, MOCK_FREELANCERS } from "@/data/mockUsers";

export default function Users() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [freelancers, setFreelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showCreationForm, setShowCreationForm] = useState(false);
  
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
    }
  };
  
  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };
  
  const getAssignedFreelancers = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.assignedFreelancers || [];
  };

  const handleUserCreated = (newUser: any) => {
    if (newUser.role === "client") {
      setClients(prev => [...prev, newUser]);
    } else if (newUser.role === "freelancer") {
      setFreelancers(prev => [...prev, newUser]);
    }
    setShowCreationForm(false);
  };
  
  return (
    <AppLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage clients and freelancers</p>
        </div>

        <div className="flex justify-between items-center">
          <UserSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
          
          <Button 
            onClick={() => setShowCreationForm(!showCreationForm)}
            variant={showCreationForm ? "outline" : "default"}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {showCreationForm ? "Cancel" : "Create User"}
          </Button>
        </div>
        
        {showCreationForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <UserCreationForm onUserCreated={handleUserCreated} />
            </CardContent>
          </Card>
        )}
        
        <UserManagementTabs 
          clients={clients}
          filteredClients={filteredClients}
          freelancers={freelancers}
          filteredFreelancers={filteredFreelancers}
          onAssignFreelancer={handleAssignFreelancer}
          toggleFreelancerAssignment={toggleFreelancerAssignment}
        />
        
        <AssignFreelancerDialog 
          open={isAssignModalOpen} 
          onOpenChange={setIsAssignModalOpen}
          clientId={selectedClientId}
          clientName={getClientById(selectedClientId || "")?.company || ""}
          freelancers={filteredFreelancers}
          assignedFreelancerIds={selectedClientId ? getAssignedFreelancers(selectedClientId) : []}
          onToggleAssignment={toggleFreelancerAssignment}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </AppLayout>
  );
}
