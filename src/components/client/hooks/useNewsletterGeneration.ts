
import { useState } from "react";
import { Video } from "@/types";
import { NewsletterTemplate } from "@/types/newsletter";
import { toast } from "sonner";
import { format } from "date-fns";
import { generateNewsletterContent } from "../utils/templateGenerator";

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
  const [generatedTemplates, setGeneratedTemplates] = useState<{ [videoId: string]: NewsletterTemplate }>({});
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [selectedNewsletterVideoId, setSelectedNewsletterVideoId] = useState<string | null>(null);

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
    }
  };

  const handleViewNewsletter = (videoId: string) => {
    setSelectedNewsletterVideoId(videoId);
    setShowNewsletterModal(true);
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
    
    setCurrentTemplate(template);
    setGeneratedTemplates(prev => ({ ...prev, [selectedVideo.id]: template }));
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
    
    setCurrentTemplate(updatedTemplate);
    setGeneratedTemplates(prev => ({ ...prev, [currentTemplate.videoId]: updatedTemplate }));
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
    generatedTemplates,
    showNewsletterModal,
    selectedNewsletterVideoId,
    handleGenerateClick,
    handleVideoSelect,
    handleViewNewsletter,
    confirmGenerate,
    generateRevision,
    getCurrentContent,
    setShowConfirmDialog,
    setSelectedRevision,
    setShowNewsletterModal
  };
}
