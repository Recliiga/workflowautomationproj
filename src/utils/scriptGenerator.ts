
import { ScriptInput, GeneratedScript } from "@/types/script";

export function generateScript(input: ScriptInput): GeneratedScript {
  const { topic, duration } = input;
  
  // Mock script generation based on duration and topic
  const scripts = {
    15: {
      hook: `Did you know ${topic.toLowerCase()} could change everything?`,
      body: `Here's the game-changing insight about ${topic.toLowerCase()} that most people miss. This simple approach can transform your results in just minutes.`,
      cta: `Ready to try this? Link in bio!`
    },
    30: {
      hook: `The secret about ${topic.toLowerCase()} nobody talks about...`,
      body: `Let me break down exactly how ${topic.toLowerCase()} works and why it's so powerful. Most people get this wrong, but when you understand this key principle, everything changes. Here's what you need to know to get started today.`,
      cta: `Want to learn more? Check the link in my bio!`
    },
    45: {
      hook: `Think you know everything about ${topic.toLowerCase()}? Think again.`,
      body: `I've spent years studying ${topic.toLowerCase()}, and here's what I've discovered. The conventional wisdom is completely wrong. Let me show you the three key strategies that actually work. First, you need to understand the foundation. Second, timing is everything. Third, consistency beats perfection every time.`,
      cta: `Ready to master this? Book a free consultation!`
    }
  };

  // Default to 30 seconds if exact duration not found
  let scriptContent = scripts[30];
  if (duration <= 20) {
    scriptContent = scripts[15];
  } else if (duration <= 35) {
    scriptContent = scripts[30];
  } else {
    scriptContent = scripts[45];
  }

  // For custom durations over 45 seconds, extend the body
  if (duration > 45) {
    scriptContent = {
      ...scripts[45],
      body: `${scripts[45].body} Additionally, here are some advanced techniques that can take your ${topic.toLowerCase()} skills to the next level. Remember, the key is to start small and build momentum. Don't try to do everything at once.`
    };
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    topic,
    duration,
    hook: scriptContent.hook,
    body: scriptContent.body,
    cta: scriptContent.cta,
    createdAt: new Date().toISOString()
  };
}

export function getScrollSpeed(speed: 'slow' | 'normal' | 'fast'): number {
  const speeds = {
    slow: 120,    // words per minute
    normal: 150,
    fast: 180
  };
  return speeds[speed];
}
