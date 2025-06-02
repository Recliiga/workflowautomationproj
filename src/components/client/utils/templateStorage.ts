
import { NewsletterTemplate } from "@/types/newsletter";

const STORAGE_KEY = 'newsletter_templates';

export function saveTemplate(template: NewsletterTemplate): void {
  const existingTemplates = getStoredTemplates();
  const updatedTemplates = existingTemplates.filter(t => t.videoId !== template.videoId);
  updatedTemplates.push(template);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
}

export function getStoredTemplates(): NewsletterTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getTemplateByVideoId(videoId: string): NewsletterTemplate | null {
  const templates = getStoredTemplates();
  return templates.find(t => t.videoId === videoId) || null;
}

export function deleteTemplate(videoId: string): void {
  const templates = getStoredTemplates().filter(t => t.videoId !== videoId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
