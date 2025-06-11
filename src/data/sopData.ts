
import { SOPChecklist } from "@/types/sop";

export const REELS_EDITING_SOP: SOPChecklist = {
  id: "reels-editing",
  title: "Reels Editing",
  completed: false,
  sections: [
    {
      id: "edits",
      title: "EDITS",
      items: [
        {
          id: "trim-clips",
          text: "Trim Clips & use Jump Cuts",
          completed: false
        }
      ]
    },
    {
      id: "captions",
      title: "CAPTIONS",
      items: [
        {
          id: "text-position",
          text: "Text in the middle 1/3rd of the screen (unless covering a key visual)",
          completed: false
        },
        {
          id: "contrast",
          text: "Contrast with background colour",
          completed: false
        },
        {
          id: "visual-elements",
          text: "Add Visual Elements (emojis/underline/colour text)",
          completed: false
        },
        {
          id: "consistent-captions",
          text: "Add consistent Captions",
          completed: false
        },
        {
          id: "relatable",
          text: "Keep relatable & emotional",
          completed: false
        },
        {
          id: "hook",
          text: "Start with the Hook",
          completed: false,
          subItems: [
            { id: "negative-spin", text: "Negative Spin > \"You Should Never\"", completed: false },
            { id: "positive-spin", text: "Positive Spin > \"This is the Best\"", completed: false },
            { id: "ask-question", text: "Ask ? > \"Have You Ever\"", completed: false },
            { id: "experience", text: "Experience > \"I Almost Gave Up Golf\"", completed: false },
            { id: "call-out", text: "Call Out View > \"If You … Try This\"", completed: false },
            { id: "tell-how", text: "Tell Them How > \"Here's How You Can\"", completed: false },
            { id: "social-proof", text: "Social Proof > Real Example/Story", completed: false }
          ]
        },
        {
          id: "cta-first",
          text: "Call-to-action (CTA) in the first 3 seconds",
          completed: false,
          subItems: [
            { id: "cta-switching", text: "If switching CTAs mid-video, break up text boxes for clarity", completed: false }
          ]
        },
        {
          id: "cta-second",
          text: "Can have the 2nd CTA near the end",
          completed: false
        }
      ]
    },
    {
      id: "subtitles",
      title: "SUBTITLES",
      items: [
        {
          id: "add-subtitles",
          text: "Add Subtitle Captions for speaking videos",
          completed: false
        },
        {
          id: "subtitle-position",
          text: "Put Subtitle Captions below chin/above chest",
          completed: false
        },
        {
          id: "check-subtitles",
          text: "Check Subtitles for spacing and spelling amendments (ex. goingto)",
          completed: false
        }
      ]
    },
    {
      id: "music",
      title: "MUSIC",
      items: [
        {
          id: "add-music",
          text: "Add appropriate Music",
          completed: false
        },
        {
          id: "trending-music",
          text: "trending music with high usage",
          completed: false
        },
        {
          id: "instrumental",
          text: "instrumental for talking videos (turn volume down to level 3)",
          completed: false
        }
      ]
    },
    {
      id: "cover-photo",
      title: "COVER PHOTO",
      items: [
        {
          id: "add-cover",
          text: "Add Cover Photo with Hook as Caption in the middle of the page or top or bottom 1/3",
          completed: false
        }
      ]
    }
  ]
};
