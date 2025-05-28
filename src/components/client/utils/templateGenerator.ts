
import { Video } from "@/types";

export function generateNewsletterContent(video: Video, instructions: string, revision = 0): string {
  const variations = [
    // Original
    `Subject: ${video.title} - Weekly Update

Hi [First Name],

Hope you're having a great week! I wanted to share something exciting with you.

${video.aiContent?.hook || "Check out our latest content that I think you'll find valuable."}

🎥 ${video.title}

${video.description || "This content covers important insights that can help you in your journey."}

${video.aiContent?.caption || "Here's what makes this special..."}

${video.aiContent?.cta || "Take a look and let me know what you think!"}

Best regards,
[Your Name]

P.S. ${video.aiContent?.emailCopy?.split('\n')[0] || "Don't miss out on this valuable content!"}`,

    // Revision 1
    `Subject: 🚀 ${video.title} - You Won't Want to Miss This

Hey [First Name],

Quick question - ${video.aiContent?.hook || "are you ready for something game-changing?"}

I just dropped new content that I'm really excited about:

"${video.title}"

${video.description || "This dives deep into strategies that can transform your approach."}

Here's the thing: ${video.aiContent?.caption || "this isn't just another piece of content."}

${video.aiContent?.cta || "Check it out and see how it can help you!"}

Talk soon,
[Your Name]`,

    // Revision 2
    `Subject: Personal Note About ${video.title}

[First Name],

I've been working on something that I think you'll really appreciate.

${video.aiContent?.hook || "You know how we're always looking for better ways to approach challenges?"}

Well, I created "${video.title}" specifically with people like you in mind.

What you'll discover:
${video.description || "• Key insights that make a real difference\n• Practical strategies you can implement today\n• A fresh perspective on common challenges"}

${video.aiContent?.caption || "This content represents hours of research and real-world application."}

${video.aiContent?.cta || "I'd love to hear your thoughts after you check it out."}

Best,
[Your Name]

P.S. This is exactly the kind of content that has helped our community achieve remarkable results.`
  ];

  return variations[revision] || variations[0];
}
