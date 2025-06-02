
export interface ScriptInput {
  topic: string;
  duration: number; // in seconds
}

export interface GeneratedScript {
  id: string;
  topic: string;
  duration: number;
  hook: string;
  body: string;
  cta: string;
  createdAt: string;
}

export type ScrollSpeed = 'slow' | 'normal' | 'fast';

export interface TeleprompterSettings {
  scrollSpeed: ScrollSpeed;
  isPlaying: boolean;
  countdown: number;
}
