

import { existing types file content }

// Add videoType to CalendarEvent interface
export interface CalendarEvent {
  id: string;
  videoId?: string;
  title: string;
  date: string;
  status: VideoStatus;
  videoType?: string;
  videos?: Video[];
}

