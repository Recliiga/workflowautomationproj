
import React, { useState } from "react";
import { ProfileData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { SocialMediaSection } from "./SocialMediaSection";
import { SpecialtiesSection } from "./SpecialtiesSection";
import { CertificationsSection } from "./CertificationsSection";

interface ProfileFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSpecialtiesChange = (specialties: string[]) => {
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };
  
  const handleCertificationsChange = (certifications: string[]) => {
    setFormData(prev => ({
      ...prev,
      certifications
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarPreview || ""} alt={formData.name} />
          <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Upload className="h-4 w-4" />
            <span>Upload profile picture</span>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name" 
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="your.email@example.com" 
            />
          </div>
          
          {formData.role === "client" && (
            <div>
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                name="company" 
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company" 
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Your phone number" 
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              name="website" 
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="Your website" 
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <SocialMediaSection 
            initialSocialMedia={formData.socialMedia || []}
            onChange={handleSocialMediaChange}
          />
          
          {formData.role === "freelancer" && (
            <>
              <SpecialtiesSection 
                initialSpecialties={formData.specialties || []}
                onChange={handleSpecialtiesChange}
              />
              
              <CertificationsSection 
                initialCertifications={formData.certifications || []}
                onChange={handleCertificationsChange}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Save Profile</Button>
      </div>
    </form>
  );
}
