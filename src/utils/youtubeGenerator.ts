
import { YouTubeContent, YouTubeGenerationRequest } from "@/types/youtube";

export function generateYouTubeContent(request: YouTubeGenerationRequest): YouTubeContent {
  const { projectTitle, caption, hook, cta, industry, location } = request;

  // Generate YouTube-optimized title
  const title = generateTitle(projectTitle, hook, industry, location);
  
  // Generate comprehensive description
  const description = generateDescription(caption, hook, cta, industry, location);
  
  // Generate SEO tags
  const tags = generateTags(caption, hook, industry, location);
  
  // Generate thumbnail text suggestions
  const thumbnailText = generateThumbnailText(hook, caption);

  return {
    title,
    description,
    tags,
    thumbnailText
  };
}

function generateTitle(projectTitle: string, hook: string, industry?: string, location?: string): string {
  // Extract key phrases from hook and project title
  const hookWords = hook.toLowerCase();
  
  let title = "";
  
  // Start with a compelling hook-based title
  if (hookWords.includes("secret") || hookWords.includes("hack")) {
    title = `The Secret That Changed Everything`;
  } else if (hookWords.includes("mistake") || hookWords.includes("wrong")) {
    title = `Don't Make This HUGE Mistake`;
  } else if (hookWords.includes("transform") || hookWords.includes("change")) {
    title = `How I Transformed My Life in 30 Days`;
  } else if (hookWords.includes("easy") || hookWords.includes("simple")) {
    title = `The Simple Trick Everyone Should Know`;
  } else {
    // Fallback to a generic but engaging title
    title = `This Changes Everything`;
  }
  
  // Add industry/location context if provided
  if (industry) {
    title += ` (${industry})`;
  }
  if (location) {
    title += ` | ${location}`;
  }
  
  // Add engagement elements
  const engagementWords = ["SHOCKING", "AMAZING", "INCREDIBLE", "MUST WATCH"];
  const randomEngagement = engagementWords[Math.floor(Math.random() * engagementWords.length)];
  
  return `${title} - ${randomEngagement} Results! #Shorts`;
}

function generateDescription(caption: string, hook: string, cta: string, industry?: string, location?: string): string {
  const locationText = location ? ` in ${location}` : "";
  const industryText = industry ? ` for ${industry}` : "";
  
  return `🔥 ${hook}

${caption}

In this video, you'll discover:
✅ The strategy that actually works${industryText}
✅ Real results from real people${locationText}
✅ How to get started today

${cta}

📞 Ready to take action? Book a free consultation: [YOUR-BOOKING-LINK]

FOLLOW FOR MORE:
👍 Like this video if it helped you
🔔 Subscribe for daily tips${industryText}
📤 Share with someone who needs to see this

${generateHashtags(industry, location)}

---
⚠️ DISCLAIMER: Results may vary. This content is for educational purposes only.

#Shorts #${industry || 'Business'}Tips #Success${location ? ` #${location.replace(/\s+/g, '')}` : ''}`;
}

function generateTags(caption: string, hook: string, industry?: string, location?: string): string[] {
  const baseTags = [
    "shorts",
    "viral",
    "trending",
    "success",
    "motivation",
    "tips",
    "howto"
  ];
  
  const industryTags = industry ? [
    industry.toLowerCase(),
    `${industry.toLowerCase()} tips`,
    `${industry.toLowerCase()} success`
  ] : [];
  
  const locationTags = location ? [
    location.toLowerCase().replace(/\s+/g, ''),
    `${location.toLowerCase()} business`
  ] : [];
  
  // Extract key words from caption and hook
  const contentWords = `${caption} ${hook}`.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'your', 'their'].includes(word))
    .slice(0, 3);
  
  return [...baseTags, ...industryTags, ...locationTags, ...contentWords].slice(0, 7);
}

function generateThumbnailText(hook: string, caption: string): string[] {
  const suggestions = [];
  
  // Extract emotional/action words from hook
  const hookLower = hook.toLowerCase();
  if (hookLower.includes('secret')) suggestions.push('SECRET REVEALED');
  if (hookLower.includes('mistake')) suggestions.push('HUGE MISTAKE');
  if (hookLower.includes('transform')) suggestions.push('LIFE CHANGED');
  if (hookLower.includes('easy')) suggestions.push('SO EASY!');
  
  // Add generic powerful phrases
  suggestions.push(
    'WATCH THIS',
    'MIND BLOWN',
    'GAME CHANGER',
    'YOU WON\'T BELIEVE'
  );
  
  // Return unique suggestions
  return [...new Set(suggestions)].slice(0, 4);
}

function generateHashtags(industry?: string, location?: string): string {
  const baseHashtags = ['#success', '#motivation', '#entrepreneur', '#mindset', '#growth'];
  
  const industryHashtags = industry ? [
    `#${industry.toLowerCase().replace(/\s+/g, '')}`,
    `#${industry.toLowerCase().replace(/\s+/g, '')}tips`
  ] : [];
  
  const locationHashtags = location ? [
    `#${location.toLowerCase().replace(/\s+/g, '')}`,
    `#${location.toLowerCase().replace(/\s+/g, '')}business`
  ] : [];
  
  return [...baseHashtags, ...industryHashtags, ...locationHashtags]
    .slice(0, 8)
    .join(' ');
}
