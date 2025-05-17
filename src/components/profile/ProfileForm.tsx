
import { useState } from "react";
import { ProfileData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProfileHeader } from "./ProfileHeader";
import { SocialMediaSection } from "./SocialMediaSection";
import { CertificationsSection } from "./CertificationsSection";
import { SpecialtiesSection } from "./SpecialtiesSection";

interface ProfileFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (socialMedia: { platform: string; handle: string }[]) => {
    setFormData(prev => ({
      ...prev,
      socialMedia
    }));
  };

  const handleCertificationsChange = (certifications: string[]) => {
    setFormData(prev => ({
      ...prev,
      certifications
    }));
  };

  const handleSpecialtiesChange = (specialties: string[]) => {
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty social media entries
    const filteredSocial = formData.socialMedia?.filter(
      item => item.platform.trim() && item.handle.trim()
    );
    
    const submitData = {
      ...formData,
      socialMedia: filteredSocial?.length ? filteredSocial : undefined,
      certifications: formData.role === 'freelancer' ? formData.certifications : undefined,
      specialties: formData.role === 'freelancer' ? formData.specialties : undefined,
    };
    
    onSubmit(submitData);
    toast.success("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileHeader profile={formData} />
      
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
            <CertificationsSection 
              initialCertifications={formData.certifications || []} 
              onChange={handleCertificationsChange}
            />
            
            <SpecialtiesSection
              initialSpecialties={formData.specialties || []}
              onChange={handleSpecialtiesChange}
            />
          </>
        )}

        <SocialMediaSection 
          initialSocialMedia={formData.socialMedia || []} 
          onChange={handleSocialMediaChange}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Save Profile
        </Button>
      </div>
    </form>
  );
}
