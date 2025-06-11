
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Users } from "lucide-react";
import { MOCK_CLIENTS, MOCK_FREELANCERS } from "@/data/mockUsers";

interface UserSelectorProps {
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
}

export function UserSelector({ selectedUserIds, onSelectionChange }: UserSelectorProps) {
  const [selectAll, setSelectAll] = useState(false);

  const allUsers = [
    ...MOCK_CLIENTS.map(client => ({ ...client, type: 'client' as const })),
    ...MOCK_FREELANCERS.map(freelancer => ({ ...freelancer, type: 'freelancer' as const }))
  ];

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUserIds, userId]);
    } else {
      onSelectionChange(selectedUserIds.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange(allUsers.map(user => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const selectedClients = MOCK_CLIENTS.filter(client => selectedUserIds.includes(client.id));
  const selectedFreelancers = MOCK_FREELANCERS.filter(freelancer => selectedUserIds.includes(freelancer.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Select Users</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm">Select All</label>
        </div>
      </div>

      {selectedUserIds.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Selected Users:</span>
          <div className="flex flex-wrap gap-1">
            {selectedClients.map(client => (
              <Badge key={client.id} variant="secondary" className="text-xs">
                {client.name} (Client)
              </Badge>
            ))}
            {selectedFreelancers.map(freelancer => (
              <Badge key={freelancer.id} variant="outline" className="text-xs">
                {freelancer.name} (Freelancer)
              </Badge>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="h-48 border rounded-md p-2">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Clients</h4>
            <div className="space-y-2">
              {MOCK_CLIENTS.map(client => (
                <div key={client.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`client-${client.id}`}
                    checked={selectedUserIds.includes(client.id)}
                    onCheckedChange={(checked) => handleUserToggle(client.id, checked as boolean)}
                  />
                  <User className="h-3 w-3 text-muted-foreground" />
                  <label htmlFor={`client-${client.id}`} className="text-sm">
                    {client.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Freelancers</h4>
            <div className="space-y-2">
              {MOCK_FREELANCERS.map(freelancer => (
                <div key={freelancer.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`freelancer-${freelancer.id}`}
                    checked={selectedUserIds.includes(freelancer.id)}
                    onCheckedChange={(checked) => handleUserToggle(freelancer.id, checked as boolean)}
                  />
                  <User className="h-3 w-3 text-muted-foreground" />
                  <label htmlFor={`freelancer-${freelancer.id}`} className="text-sm">
                    {freelancer.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
