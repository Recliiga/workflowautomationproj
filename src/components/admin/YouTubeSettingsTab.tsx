
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Youtube, Save } from "lucide-react";
import { toast } from "sonner";

interface YouTubeSettingsTabProps {
  clientId: string;
  clientName: string;
}

interface YouTubeClientSettings {
  industry: string;
  location: string;
  city: string;
  bookingLink: string;
  businessType: string;
  targetAudience: string;
  brandVoice: string;
  keywords: string;
}

export function YouTubeSettingsTab({ clientId, clientName }: YouTubeSettingsTabProps) {
  const [settings, setSettings] = useState<YouTubeClientSettings>({
    industry: "",
    location: "",
    city: "",
    bookingLink: "",
    businessType: "",
    targetAudience: "",
    brandVoice: "",
    keywords: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`YouTube settings saved for ${clientName}`);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof YouTubeClientSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const businessTypes = [
    "Real Estate",
    "Fitness & Health",
    "Marketing Agency",
    "Restaurant",
    "E-commerce",
    "Consulting",
    "Technology",
    "Education",
    "Healthcare",
    "Finance",
    "Other"
  ];

  const brandVoices = [
    "Professional",
    "Casual & Friendly",
    "Energetic & Motivational",
    "Educational & Informative",
    "Luxury & Premium",
    "Fun & Playful",
    "Authoritative & Expert"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube Repurposing Settings for {clientName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Real Estate, Fitness, Marketing"
              value={settings.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={settings.businessType}
              onValueChange={(value) => handleInputChange("businessType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/State</Label>
            <Input
              id="location"
              placeholder="e.g., California, New York, Florida"
              value={settings.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., Los Angeles, Miami, New York"
              value={settings.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bookingLink">Booking/Contact Link</Label>
            <Input
              id="bookingLink"
              placeholder="https://calendly.com/yourlink or https://yourwebsite.com/contact"
              value={settings.bookingLink}
              onChange={(e) => handleInputChange("bookingLink", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Young professionals, Home buyers, Fitness enthusiasts"
              value={settings.targetAudience}
              onChange={(e) => handleInputChange("targetAudience", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandVoice">Brand Voice</Label>
            <Select
              value={settings.brandVoice}
              onValueChange={(value) => handleInputChange("brandVoice", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand voice" />
              </SelectTrigger>
              <SelectContent>
                {brandVoices.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="keywords">Keywords & Hashtags</Label>
            <Textarea
              id="keywords"
              placeholder="Enter relevant keywords and hashtags separated by commas (e.g., #realestate, #Miami, #homebuying, luxury homes, property investment)"
              value={settings.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How these settings work:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Industry & Business Type:</strong> Helps generate relevant content and keywords</li>
            <li>• <strong>Location & City:</strong> Adds local SEO targeting to titles and descriptions</li>
            <li>• <strong>Booking Link:</strong> Automatically included in video descriptions for lead generation</li>
            <li>• <strong>Target Audience:</strong> Tailors content tone and messaging</li>
            <li>• <strong>Brand Voice:</strong> Ensures consistent communication style</li>
            <li>• <strong>Keywords:</strong> Optimizes content for YouTube search and discovery</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
