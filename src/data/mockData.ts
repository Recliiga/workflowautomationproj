
import { Video } from "@/types";

// Mock data for demonstration
export const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Brand Introduction Video",
    description: "A short introduction to our brand values and mission.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-01T12:00:00Z",
    dueDate: "2023-05-10T12:00:00Z",
    videoType: "Evergreen Content"
  },
  {
    id: "2",
    title: "Product Demo - New Feature",
    description: "Walkthrough of our latest product feature.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original2.mp4",
    editedUrl: "https://example.com/videos/edited2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=300",
    status: "submitted",
    uploadDate: "2023-05-02T12:00:00Z",
    dueDate: "2023-05-12T12:00:00Z",
    videoType: "Tutorial"
  },
  {
    id: "3",
    title: "Customer Testimonial - Johnson Inc.",
    description: "Interview with the CEO of Johnson Inc. about their experience.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original3.mp4",
    editedUrl: "https://example.com/videos/edited3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=300",
    status: "approved",
    uploadDate: "2023-04-20T12:00:00Z",
    publishDate: "2023-05-15T12:00:00Z",
    videoType: "Testimonial",
    aiContent: {
      caption: "Hear how Johnson Inc. increased productivity by 35% using our platform.",
      hook: "Johnson Inc. was struggling with efficiency. Then they found us.",
      cta: "Join hundreds of satisfied customers - book a call today!",
      emailCopy: "Hello [Name],\n\nSuccess stories speak louder than features. That's why we wanted to share this testimonial from Johnson Inc., who saw a 35% increase in productivity within just 2 months of implementing our solution.\n\nWatch the full story in the video below.\n\nCheers,\nCustomer Success Team"
    }
  },
  {
    id: "4",
    title: "How-To Guide: Advanced Features",
    description: "Step by step tutorial on using advanced features.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original4.mp4",
    editedUrl: "https://example.com/videos/edited4.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=300",
    status: "approved",
    uploadDate: "2023-04-25T12:00:00Z",
    dueDate: "2023-05-05T12:00:00Z",
    publishDate: "2023-05-24T12:00:00Z",
    videoType: "Tutorial"
  },
  {
    id: "5",
    title: "Product Announcement - New Mobile App",
    description: "Announcing our new mobile app launch.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original5.mp4",
    editedUrl: "https://example.com/videos/edited5.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=300",
    status: "approved",
    uploadDate: "2023-03-15T12:00:00Z",
    publishDate: "2023-06-01T12:00:00Z",
    videoType: "Product Launch",
    aiContent: {
      caption: "Introducing our all-new mobile app! Download now for free.",
      hook: "Your pocket just got a lot more powerful.",
      cta: "Get it now on iOS and Android!",
      emailCopy: "Hi [Name],\n\nWe're thrilled to announce the launch of our mobile app! Now you can access all your favorite features on the go.\n\nDownload it today and enjoy these exclusive mobile features:\n- Offline mode\n- Push notifications\n- Quick access dashboard\n\nAvailable now on iOS and Android.\n\nBest,\nThe Product Team"
    }
  },
  {
    id: "6",
    title: "Annual Conference Highlights",
    description: "Highlights from our annual user conference.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original6.mp4",
    editedUrl: "https://example.com/videos/edited6.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=300",
    status: "approved",
    uploadDate: "2023-02-20T12:00:00Z",
    publishDate: "2023-05-30T12:00:00Z",
    videoType: "Event",
    aiContent: {
      caption: "Missed our conference? Here are all the highlights in 3 minutes!",
      hook: "The biggest announcements from our biggest event of the year.",
      cta: "Register now for next year's conference at early bird rates!",
      emailCopy: "Hello [Name],\n\nWhat an amazing conference we had last month! For those who couldn't make it (and those who want to relive the experience), we've put together a highlights video.\n\nIn just 3 minutes, you'll see all the major announcements, product reveals, and inspiring moments from our biggest event of the year.\n\nAnd don't forget - early bird registration is now open for next year!\n\nBest regards,\nEvents Team"
    }
  },
  // Adding more videos for upcoming content
  {
    id: "7",
    title: "Summer Product Line Introduction",
    description: "Showcasing our new summer product collection.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original7.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-05T14:00:00Z",
    dueDate: "2023-05-15T14:00:00Z",
    publishDate: "2023-06-05T12:00:00Z",
    videoType: "Product Launch"
  },
  {
    id: "8",
    title: "Behind the Scenes - Product Design",
    description: "A look at how our design team creates our products.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original8.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-07T10:30:00Z",
    dueDate: "2023-05-17T10:30:00Z",
    publishDate: "2023-06-10T12:00:00Z",
    videoType: "Behind the Scenes"
  },
  {
    id: "9",
    title: "Customer Success Story - TechCorp",
    description: "How TechCorp improved their workflow using our platform.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original9.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300",
    status: "submitted",
    uploadDate: "2023-05-03T09:15:00Z",
    dueDate: "2023-05-13T09:15:00Z",
    publishDate: "2023-06-15T12:00:00Z",
    videoType: "Testimonial"
  },
  {
    id: "10",
    title: "Expert Tips: Maximizing Productivity",
    description: "Industry experts share their top productivity hacks.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original10.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300",
    status: "in-progress",
    uploadDate: "2023-05-08T16:45:00Z",
    dueDate: "2023-05-18T16:45:00Z",
    publishDate: "2023-06-20T12:00:00Z",
    videoType: "Evergreen Content"
  },
  {
    id: "11",
    title: "Quick Tip: Hidden Feature",
    description: "A 30-second tutorial on a little-known but powerful feature.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original11.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=300",
    status: "submitted",
    uploadDate: "2023-05-04T11:20:00Z",
    dueDate: "2023-05-14T11:20:00Z",
    publishDate: "2023-06-25T12:00:00Z",
    videoType: "Tutorial"
  },
  {
    id: "12",
    title: "Partnership Announcement - GlobalBrand",
    description: "Announcing our strategic partnership with GlobalBrand.",
    clientId: "2",
    freelancerId: "3",
    originalUrl: "https://example.com/videos/original12.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=300",
    status: "rejected",
    uploadDate: "2023-05-02T13:10:00Z",
    dueDate: "2023-05-12T13:10:00Z",
    notes: "Please add more emphasis on the mutual benefits of the partnership. The current version focuses too much on our brand.",
    videoType: "Partnership/Sponsorship"
  }
];

// Video Types - these would typically be fetched from the server
export const VIDEO_TYPES = [
  "Behind the Scenes",
  "Dialogue",
  "Event",
  "Evergreen Content",
  "Exercises",
  "Huge Client Win",
  "Partnership/Sponsorship",
  "Product Launch",
  "Testimonial",
  "Tutorial"
].sort((a, b) => a.localeCompare(b));
