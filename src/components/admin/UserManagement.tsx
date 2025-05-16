
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch } from "@/components/users/UserSearch";
import { UserCreationForm } from "./UserCreationForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Client, Freelancer } from "@/types";
import { MOCK_CLIENTS, MOCK_FREELANCERS } from "@/data/mockUsers";
import { UserList } from "./dashboard/UserList";

export function UserManagement() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [freelancers, setFreelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleUserCreated = (newUser: any) => {
    if (newUser.role === "client") {
      setClients(prev => [...prev, newUser]);
    } else if (newUser.role === "freelancer") {
      setFreelancers(prev => [...prev, newUser]);
    }
    setShowCreationForm(false);
  };

  const handleViewAssignments = (userId: string) => {
    console.log("View assignments for user:", userId);
  };

  const handleImpersonate = (role: 'client' | 'freelancer', id: string) => {
    console.log(`Impersonate ${role} with ID: ${id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button 
          onClick={() => setShowCreationForm(!showCreationForm)}
          variant={showCreationForm ? "outline" : "default"}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {showCreationForm ? "Cancel" : "Create User"}
        </Button>
      </CardHeader>
      <CardContent>
        {showCreationForm ? (
          <div className="mb-6">
            <UserCreationForm onUserCreated={handleUserCreated} />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <UserSearch 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm}
                placeholder="Search users by name, email, company..."
              />
            </div>
            
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="clients">Clients ({filteredClients.length})</TabsTrigger>
                <TabsTrigger value="freelancers">Freelancers ({filteredFreelancers.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clients">
                <UserList 
                  clients={filteredClients} 
                  freelancers={[]} 
                  onViewAssignments={handleViewAssignments} 
                  onImpersonate={handleImpersonate} 
                />
              </TabsContent>
              
              <TabsContent value="freelancers">
                <UserList 
                  clients={[]} 
                  freelancers={filteredFreelancers} 
                  onViewAssignments={handleViewAssignments} 
                  onImpersonate={handleImpersonate} 
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
