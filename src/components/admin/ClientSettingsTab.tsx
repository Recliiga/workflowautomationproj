
import { Client } from "@/types";
import { useState } from "react";
import { ClientSelector } from "./ClientSelector";
import { VideoTypeManager } from "./VideoTypeManager";
import { ClientKnowledgeBase } from "./ClientKnowledgeBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedClientView from "@/pages/Client/UnifiedClientView";

interface ClientSettingsTabProps {
  clients: Client[];
}

export function ClientSettingsTab({ clients }: ClientSettingsTabProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "");
  const [videoTypes, setVideoTypes] = useState<{ [clientId: string]: string[] }>({});

  // Get client specific video types (in a real app, this would come from a database)
  const getClientVideoTypes = (clientId: string) => {
    return videoTypes[clientId] || [
      "Dialogue",
      "Evergreen Content",
      "Exercises",
      "Huge Client Win",
      "Partnership/Sponsorship",
      "Testimonial"
    ];
  };
  
  // Handle client selection change
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
  };
  
  const handleVideoTypesChange = (clientId: string, newTypes: string[]) => {
    setVideoTypes(prev => ({
      ...prev,
      [clientId]: newTypes
    }));
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <ClientSelector 
        clients={clients} 
        selectedClientId={selectedClientId} 
        onClientChange={handleClientChange} 
      />
      
      {selectedClientId && (
        <Tabs defaultValue="settings" className="w-full">
          <TabsList>
            <TabsTrigger value="settings">Client Settings</TabsTrigger>
            <TabsTrigger value="content">Client Content View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <VideoTypeManager 
              initialTypes={getClientVideoTypes(selectedClientId)} 
              onTypesChange={(newTypes) => handleVideoTypesChange(selectedClientId, newTypes)}
              clientId={selectedClientId}
              clientName={clients.find(c => c.id === selectedClientId)?.name || ""}
            />
            
            <ClientKnowledgeBase 
              clientId={selectedClientId}
              clientName={clients.find(c => c.id === selectedClientId)?.name || ""}
            />
          </TabsContent>
          
          <TabsContent value="content" className="pt-6">
            <UnifiedClientView adminView={true} clientId={selectedClientId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
