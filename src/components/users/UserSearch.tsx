
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function UserSearch({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search users..." 
}: UserSearchProps) {
  return (
    <div className="flex items-center max-w-sm">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mr-2"
      />
      <Button variant="ghost" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
