
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Client, Freelancer } from "@/types";
import { useNavigate } from "react-router-dom";
import { UserList } from "./UserList";

interface UserManagementProps {
  clients: Client[];
  freelancers: Freelancer[];
  onViewAssignments: (id: string) => void;
  onImpersonate: (role: 'client' | 'freelancer', id: string) => void;
}

export function UserManagement({ 
  clients, 
  freelancers, 
  onViewAssignments, 
  onImpersonate 
}: UserManagementProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/users')}>
          <Users className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </CardHeader>
      <CardContent>
        <UserList 
          clients={clients} 
          freelancers={freelancers} 
          onViewAssignments={onViewAssignments} 
          onImpersonate={onImpersonate} 
        />
      </CardContent>
    </Card>
  );
}
