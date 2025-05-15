
export type UserRole = 'admin' | 'client' | 'freelancer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client extends User {
  role: 'client';
  company: string;
  socialMedia?: {
    platform: string;
    handle: string;
  }[];
  phone?: string;
  website?: string;
  assignedFreelancers?: string[]; // freelancer IDs
}

export interface Freelancer extends User {
  role: 'freelancer';
  certifications?: string[];
  specialties?: string[];
  socialMedia?: {
    platform: string;
    handle: string;
  }[];
  phone?: string;
  website?: string;
  assignedClients?: string[]; // client IDs
}

export interface Admin extends User {
  role: 'admin';
}

// New interface that avoids type conflicts
export interface ProfileData extends User {
  // Common fields that can be shared by all roles
  company?: string;
  certifications?: string[];
  specialties?: string[];
  socialMedia?: {
    platform: string;
    handle: string;
  }[];
  phone?: string;
  website?: string;
  // Role-specific fields can be accessed conditionally
  assignedFreelancers?: string[];
  assignedClients?: string[];
}

export type VideoStatus = 'in-progress' | 'submitted' | 'approved' | 'rejected';

export interface AIContent {
  caption: string;
  hook: string;
  cta: string;
  emailCopy: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  videoType?: string; // Added for video type classification
  clientId: string;
  freelancerId?: string;
  originalUrl: string;
  editedUrl?: string;
  resubmittedUrl?: string;
  thumbnailUrl?: string;
  status: VideoStatus;
  uploadDate: string;
  dueDate?: string;
  publishDate?: string;
  aiContent?: AIContent;
}

export interface CalendarEvent {
  id: string;
  videoId: string;
  title: string;
  date: string;
  status: VideoStatus;
}

export interface DashboardStats {
  totalVideos: number;
  inProgress: number;
  submitted: number;
  approved: number;
  rejected: number;
}
