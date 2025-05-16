
import { GlobalSettingsTab } from "../GlobalSettingsTab";
import { ClientSettingsTab } from "../ClientSettingsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/types";

interface SettingsTabProps {
  clients: Client[];
}

export function SettingsTab({ clients }: SettingsTabProps) {
  return (
    <Tabs defaultValue="global">
      <TabsList>
        <TabsTrigger value="global">Global Settings</TabsTrigger>
        <TabsTrigger value="clients">Client Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="global" className="pt-6">
        <GlobalSettingsTab />
      </TabsContent>
      
      <TabsContent value="clients" className="pt-6">
        <ClientSettingsTab clients={clients} />
      </TabsContent>
    </Tabs>
  );
}
