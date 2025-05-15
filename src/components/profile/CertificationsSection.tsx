
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface CertificationsSectionProps {
  initialCertifications: string[];
  onChange: (certifications: string[]) => void;
}

export function CertificationsSection({ initialCertifications, onChange }: CertificationsSectionProps) {
  const [certifications, setCertifications] = useState<string[]>(initialCertifications || []);
  const [newCertification, setNewCertification] = useState("");

  const addCertification = () => {
    if (newCertification.trim()) {
      const updated = [...certifications, newCertification.trim()];
      setCertifications(updated);
      setNewCertification("");
      onChange(updated);
    }
  };

  const removeCertification = (index: number) => {
    const updated = [...certifications];
    updated.splice(index, 1);
    setCertifications(updated);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Certifications
      </label>
      <div className="space-y-2">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-center">
            <span className="flex-1 bg-secondary rounded-l-md px-3 py-2 text-sm">
              {cert}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCertification(index)}
              className="h-9 w-9 rounded-l-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex">
          <Input
            value={newCertification}
            onChange={e => setNewCertification(e.target.value)}
            placeholder="Add certification"
            className="rounded-r-none"
          />
          <Button
            type="button"
            onClick={addCertification}
            className="rounded-l-none"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
