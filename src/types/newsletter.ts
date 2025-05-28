
export interface NewsletterTemplate {
  id: string;
  videoId: string;
  clientId: string;
  content: string;
  revisions: string[];
  revisionsUsed: number;
  createdAt: string;
  monthYear: string; // Format: "2025-01"
}

export interface NewsletterSettings {
  basicInstructions: string;
  examples: string[];
  monthlyCredits: number;
}

export interface ClientNewsletterUsage {
  clientId: string;
  monthYear: string;
  creditsUsed: number;
  templates: NewsletterTemplate[];
}
