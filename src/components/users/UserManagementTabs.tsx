
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Freelancer } from "@/types";
import { ClientsTab } from "./ClientsTab";
import { FreelancersTab } from "./FreelancersTab";

interface UserManagementTabsProps {
  clients: Client[];
  filteredClients: Client[];
  freelancers: Freelancer[];
  filteredFreelancers: Freelancer[];
  onAssignFreelancer: (clientId: string) => void;
  toggleFreelancerAssignment: (clientId: string, freelancerId: string) => void;
}

export function UserManagementTabs({
  clients,
  filteredClients,
  freelancers,
  filteredFreelancers,
  onAssignFreelancer,
  toggleFreelancerAssignment
}: UserManagementTabsProps) {
  return (
    <Tabs defaultValue="clients">
      <TabsList>
        <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
        <TabsTrigger value="freelancers">Freelancers ({freelancers.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="clients" className="mt-6">
        <ClientsTab 
          clients={filteredClients} 
          onAssignFreelancer={onAssignFreelancer} 
        />
      </TabsContent>
      
      <TabsContent value="freelancers" className="mt-6">
        <FreelancersTab 
          freelancers={filteredFreelancers}
          clients={clients}
          onToggleAssignment={toggleFreelancerAssignment}
        />
      </TabsContent>
    </Tabs>
  );
}
