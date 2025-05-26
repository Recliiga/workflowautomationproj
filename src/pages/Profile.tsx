
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ProfileData } from "@/types";

// Mock additional user data for demonstration
const MOCK_CLIENT_DATA = {
  company: "Acme Inc.",
  socialMedia: [
    { platform: "Twitter", handle: "@acmeinc" },
    { platform: "LinkedIn", handle: "acme-inc" }
  ],
  phone: "+1 (555) 123-4567",
  website: "https://acme-inc.com"
};

const MOCK_FREELANCER_DATA = {
  certifications: ["Adobe Certified Expert", "YouTube Content Creation"],
  specialties: ["Motion Graphics", "Video Editing"],
  socialMedia: [
    { platform: "Instagram", handle: "@videocreator" },
    { platform: "YouTube", handle: "VideoCreatorChannel" }
  ],
  phone: "+1 (555) 987-6543",
  website: "https://portfolio-site.com"
};

export default function Profile() {
  const { user, setCurrentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch user profile data from an API
    if (user) {
      let additionalData = {};
      
      if (user.role === "client") {
        additionalData = MOCK_CLIENT_DATA;
      } else if (user.role === "freelancer") {
        additionalData = MOCK_FREELANCER_DATA;
      }
      
      setProfileData({
        ...user,
        ...additionalData
      });
    }
  }, [user]);
  
  const handleSubmit = (data: ProfileData) => {
    // In a real app, this would update the profile via an API
    setCurrentUser({
      ...user!,
      name: data.name,
      email: data.email,
      avatar: data.avatar
    });
    
    setProfileData(data);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">View and update your profile information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profileData && (
                <ProfileForm 
                  initialData={profileData} 
                  onSubmit={handleSubmit} 
                />
              )}
            </CardContent>
          </Card>
          
          <PasswordChangeSection />
        </div>
      </div>
    </AppLayout>
  );
}
