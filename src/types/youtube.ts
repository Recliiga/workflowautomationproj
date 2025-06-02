
export interface YouTubeContent {
  title: string;
  description: string;
  tags: string[];
  thumbnailText: string[];
}

export interface YouTubeGenerationRequest {
  videoId: string;
  projectTitle: string;
  caption: string;
  hook: string;
  cta: string;
  industry?: string;
  location?: string;
}
