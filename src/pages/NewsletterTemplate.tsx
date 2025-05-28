
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NewsletterTemplateGenerator } from "@/components/client/NewsletterTemplateGenerator";
import { Video } from "@/types";
import { MOCK_VIDEOS } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

export default function NewsletterTemplate() {
  const { user } = useAuth();
  
  // Filter for approved videos for the current client
  const approvedVideos = MOCK_VIDEOS.filter(
    video => video.status === "approved" && video.clientId === user?.id
  );

  // Mock settings - in a real app, these would come from the database
  const [monthlyCredits] = useState(2);
  const [creditsUsed] = useState(0);
  const [basicInstructions] = useState(
    "Create engaging email newsletter templates based on approved video content. Focus on compelling subject lines, clear value propositions, and strong calls-to-action."
  );

  return (
    <AppLayout>
      <NewsletterTemplateGenerator
        approvedVideos={approvedVideos}
        monthlyCredits={monthlyCredits}
        creditsUsed={creditsUsed}
        basicInstructions={basicInstructions}
      />
    </AppLayout>
  );
}
