
import { useState } from "react";
import { Client, Freelancer } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";

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

export default function AdminDashboard() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage clients, settings, and content</p>
      </div>

      <SettingsTab clients={clients} />
    </div>
  );
}
