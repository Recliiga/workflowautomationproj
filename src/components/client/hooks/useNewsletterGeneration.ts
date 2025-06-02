
import { useState } from "react";
import { Video } from "@/types";
import { NewsletterTemplate } from "@/types/newsletter";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateNewsletterContent } from "../utils/templateGenerator";
import { saveTemplate, getTemplateByVideoId } from "../utils/templateStorage";

export function useNewsletterGeneration(
  approvedVideos: Video[],
  monthlyCredits: number,
  creditsUsed: number,
  basicInstructions: string
) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<NewsletterTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentCreditsUsed, setCurrentCreditsUsed] = useState(creditsUsed);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const canGenerate = currentCreditsUsed < monthlyCredits;
  const canRevise = currentTemplate && currentTemplate.revisionsUsed < 2;

  const handleGenerateClick = () => {
    if (!selectedVideo || !canGenerate) return;
    setShowConfirmDialog(true);
  };

  const handleVideoSelect = (video: Video) => {
    if (selectedVideo?.id === video.id) {
      setIsContentExpanded(!isContentExpanded);
    } else {
      setSelectedVideo(video);
      setIsContentExpanded(true);
      
      // Load existing template if available
      const existingTemplate = getTemplateByVideoId(video.id);
      if (existingTemplate) {
        setCurrentTemplate(existingTemplate);
        setSelectedRevision(0);
      } else {
        setCurrentTemplate(null);
      }
    }
  };

  const loadExistingTemplate = (videoId: string) => {
    const template = getTemplateByVideoId(videoId);
    if (template) {
      const video = approvedVideos.find(v => v.id === videoId);
      if (video) {
        setSelectedVideo(video);
        setCurrentTemplate(template);
        setSelectedRevision(0);
        setIsContentExpanded(true);
      }
    }
  };

  const confirmGenerate = async () => {
    if (!selectedVideo) return;
    
    setShowConfirmDialog(false);
    setIsGenerating(true);
    
    setCurrentCreditsUsed(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template: NewsletterTemplate = {
      id: `template-${Date.now()}`,
      videoId: selectedVideo.id,
      clientId: selectedVideo.clientId,
      content: generateNewsletterContent(selectedVideo, basicInstructions),
      revisions: [],
      revisionsUsed: 0,
      createdAt: new Date().toISOString(),
      monthYear: format(new Date(), "yyyy-MM")
    };
    
    // Save template to localStorage
    saveTemplate(template);
    
    setCurrentTemplate(template);
    setSelectedRevision(0);
    setIsGenerating(false);
    toast.success("Newsletter template generated successfully! 1 credit has been used.");
  };

  const generateRevision = async () => {
    if (!currentTemplate || !canRevise) return;
    
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRevision = generateNewsletterContent(
      approvedVideos.find(v => v.id === currentTemplate.videoId)!,
      basicInstructions,
      currentTemplate.revisionsUsed + 1
    );
    
    const updatedTemplate = {
      ...currentTemplate,
      revisions: [...currentTemplate.revisions, newRevision],
      revisionsUsed: currentTemplate.revisionsUsed + 1
    };
    
    // Save updated template
    saveTemplate(updatedTemplate);
    
    setCurrentTemplate(updatedTemplate);
    setSelectedRevision(updatedTemplate.revisions.length);
    setIsGenerating(false);
    
    if (updatedTemplate.revisionsUsed === 2) {
      toast.success("Final revision generated! No additional credits used for revisions.");
    } else {
      toast.success("New revision generated!");
    }
  };

  const getCurrentContent = () => {
    if (!currentTemplate) return "";
    if (selectedRevision === 0) return currentTemplate.content;
    return currentTemplate.revisions[selectedRevision - 1];
  };

  return {
    selectedVideo,
    currentTemplate,
    isGenerating,
    selectedRevision,
    showConfirmDialog,
    currentCreditsUsed,
    isContentExpanded,
    canGenerate,
    canRevise,
    handleGenerateClick,
    handleVideoSelect,
    confirmGenerate,
    generateRevision,
    getCurrentContent,
    loadExistingTemplate,
    setShowConfirmDialog,
    setSelectedRevision
  };
}
