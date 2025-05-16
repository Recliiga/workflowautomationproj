
import { useState } from "react";
import { Client, Freelancer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";
import { UserManagement } from "@/components/admin/UserManagement";
import { MOCK_CLIENTS, MOCK_FREELANCERS } from "@/data/mockUsers";

export default function AdminDashboard() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [freelancers] = useState<Freelancer[]>(MOCK_FREELANCERS);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage clients, settings, and content</p>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="pt-6">
          <SettingsTab clients={clients} />
        </TabsContent>
        
        <TabsContent value="users" className="pt-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
