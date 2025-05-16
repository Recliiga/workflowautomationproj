
import { Client, Freelancer } from "@/types";

// Mock clients for demonstration
export const MOCK_CLIENTS: Client[] = [
  {
    id: "2",
    name: "Client User",
    email: "client@company.com",
    role: "client",
    company: "Acme Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3"]
  },
  {
    id: "4",
    name: "Jane Cooper",
    email: "jane@example.com",
    role: "client",
    company: "Globex Corp",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedFreelancers: ["3", "5"]
  }
];

// Mock freelancers for demonstration
export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: "3",
    name: "Freelancer User",
    email: "freelancer@creator.com",
    role: "freelancer",
    certifications: ["Adobe Certified Expert", "YouTube Content Creation"],
    specialties: ["Motion Graphics", "Video Editing"],
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["2", "4"]
  },
  {
    id: "5",
    name: "Michael Johnson",
    email: "michael@creator.com",
    role: "freelancer",
    certifications: ["Final Cut Pro Certified"],
    specialties: ["Commercial Editing", "Sound Design"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    assignedClients: ["4"]
  }
];
