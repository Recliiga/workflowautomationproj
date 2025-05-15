
import { useState } from "react";
import { ProfileData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus } from "lucide-react";

interface ProfileFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [socialInputs, setSocialInputs] = useState<{ platform: string; handle: string }[]>(
    initialData.socialMedia || [{ platform: "", handle: "" }]
  );

  const [certifications, setCertifications] = useState<string[]>(
    initialData.certifications || []
  );
  
  const [specialties, setSpecialties] = useState<string[]>(
    initialData.specialties || []
  );
  
  const [newCertification, setNewCertification] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (index: number, field: 'platform' | 'handle', value: string) => {
    const updated = [...socialInputs];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setSocialInputs(updated);
  };

  const addSocialInput = () => {
    setSocialInputs([...socialInputs, { platform: "", handle: "" }]);
  };

  const removeSocialInput = (index: number) => {
    const updated = [...socialInputs];
    updated.splice(index, 1);
    setSocialInputs(updated);
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const updated = [...certifications];
    updated.splice(index, 1);
    setCertifications(updated);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    const updated = [...specialties];
    updated.splice(index, 1);
    setSpecialties(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty social media entries
    const filteredSocial = socialInputs.filter(
      item => item.platform.trim() && item.handle.trim()
    );
    
    const submitData = {
      ...formData,
      socialMedia: filteredSocial.length > 0 ? filteredSocial : undefined,
      certifications: formData.role === 'freelancer' ? certifications : undefined,
      specialties: formData.role === 'freelancer' ? specialties : undefined,
    };
    
    onSubmit(submitData);
    toast.success("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={formData.avatar} alt={formData.name} />
          <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{formData.name}</h2>
          <p className="text-sm text-muted-foreground capitalize">{formData.role}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {formData.role === 'client' && (
          <div>
            <label htmlFor="company" className="block text-sm font-medium">
              Company/Brand Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company || ''}
              onChange={handleInputChange}
              required={formData.role === 'client'}
            />
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium">
            Website
          </label>
          <Input
            id="website"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
          />
        </div>

        {formData.role === 'freelancer' && (
          <>
            {/* Certifications */}
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

            {/* Specialties */}
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
          </>
        )}

        {/* Social Media */}
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
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Save Profile
        </Button>
      </div>
    </form>
  );
}
