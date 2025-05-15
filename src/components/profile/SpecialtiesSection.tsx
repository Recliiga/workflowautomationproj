
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface SpecialtiesSectionProps {
  initialSpecialties: string[];
  onChange: (specialties: string[]) => void;
}

export function SpecialtiesSection({ initialSpecialties, onChange }: SpecialtiesSectionProps) {
  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties || []);
  const [newSpecialty, setNewSpecialty] = useState("");

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      const updated = [...specialties, newSpecialty.trim()];
      setSpecialties(updated);
      setNewSpecialty("");
      onChange(updated);
    }
  };

  const removeSpecialty = (index: number) => {
    const updated = [...specialties];
    updated.splice(index, 1);
    setSpecialties(updated);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Specialties
      </label>
      <div className="space-y-2">
        {specialties.map((specialty, index) => (
          <div key={index} className="flex items-center">
            <span className="flex-1 bg-secondary rounded-l-md px-3 py-2 text-sm">
              {specialty}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSpecialty(index)}
              className="h-9 w-9 rounded-l-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex">
          <Input
            value={newSpecialty}
            onChange={e => setNewSpecialty(e.target.value)}
            placeholder="Add specialty"
            className="rounded-r-none"
          />
          <Button
            type="button"
            onClick={addSpecialty}
            className="rounded-l-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
