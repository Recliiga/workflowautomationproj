
import { ScriptResponse } from "./types";

export const mockScriptResponses: { [stage: string]: ScriptResponse[] } = {
  "discovery": [
    {
      id: "disc1",
      stage: "discovery",
      text: "Hi {name}! Thanks for reaching out. I'd love to learn more about your business and video needs. What type of content are you looking to create?",
      context: "Initial engagement and needs assessment",
      effectiveness: 87
    },
    {
      id: "disc2", 
      stage: "discovery",
      text: "That sounds exciting! Can you tell me more about your target audience and what goals you have for this video content?",
      context: "Deeper discovery of objectives",
      effectiveness: 92
    },
    {
      id: "disc3",
      stage: "discovery", 
      text: "What's your timeline looking like for this project? And do you have a budget range in mind?",
      context: "Timeline and budget qualification",
      effectiveness: 78
    }
  ],
  "qualification": [
    {
      id: "qual1",
      stage: "qualification",
      text: "Based on what you've shared, it sounds like our {service_type} package would be perfect for {company}. Have you worked with video production companies before?",
      context: "Service matching and experience assessment",
      effectiveness: 85
    },
    {
      id: "qual2",
      stage: "qualification", 
      text: "Great! Our process typically involves {process_overview}. What questions do you have about how we work?",
      context: "Process explanation and objection handling",
      effectiveness: 90
    }
  ],
  "presentation": [
    {
      id: "pres1",
      stage: "presentation",
      text: "I'd love to show you some examples of similar work we've done for companies like {company}. Would you be interested in a quick call to discuss your project in detail?",
      context: "Portfolio showcase and meeting request",
      effectiveness: 94
    },
    {
      id: "pres2",
      stage: "presentation",
      text: "Perfect! I can walk you through our process, show you some case studies, and create a custom proposal for {company}. When works best for you this week?",
      context: "Meeting scheduling and value proposition",
      effectiveness: 88
    }
  ],
  "closing": [
    {
      id: "close1", 
      stage: "closing",
      text: "Based on everything we've discussed, I think we can create something amazing for {company}. Are you ready to move forward with the next steps?",
      context: "Direct close attempt",
      effectiveness: 82
    },
    {
      id: "close2",
      stage: "closing",
      text: "I understand you might need to think it over. What specific concerns do you have? I'm happy to address any questions.",
      context: "Objection handling and reassurance",
      effectiveness: 86
    }
  ]
};
