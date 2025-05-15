
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface SocialMediaSectionProps {
  initialSocialMedia: { platform: string; handle: string }[];
  onChange: (socialMedia: { platform: string; handle: string }[]) => void;
}

export function SocialMediaSection({ initialSocialMedia, onChange }: SocialMediaSectionProps) {
  const [socialInputs, setSocialInputs] = useState<{ platform: string; handle: string }[]>(
    initialSocialMedia && initialSocialMedia.length > 0 
      ? initialSocialMedia 
      : [{ platform: "", handle: "" }]
  );

  const handleSocialChange = (index: number, field: 'platform' | 'handle', value: string) => {
    const updated = [...socialInputs];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setSocialInputs(updated);
    onChange(updated);
  };

  const addSocialInput = () => {
    const updated = [...socialInputs, { platform: "", handle: "" }];
    setSocialInputs(updated);
    onChange(updated);
  };

  const removeSocialInput = (index: number) => {
    const updated = [...socialInputs];
    updated.splice(index, 1);
    setSocialInputs(updated);
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Social Media
      </label>
      <div className="space-y-2">
        {socialInputs.map((social, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Platform (e.g., Twitter)"
              value={social.platform}
              onChange={e => handleSocialChange(index, 'platform', e.target.value)}
              className="w-1/3"
            />
            <Input
              placeholder="Handle (e.g., @username)"
              value={social.handle}
              onChange={e => handleSocialChange(index, 'handle', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSocialInput(index)}
              disabled={socialInputs.length === 1}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addSocialInput}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Social Media
        </Button>
      </div>
    </div>
  );
}
