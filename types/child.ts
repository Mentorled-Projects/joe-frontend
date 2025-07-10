// types/child.ts

export interface ChildPost {
  id: string;
  authorName: string;
  authorAvatar: string; // URL to avatar image
  timeAgo: string;
  edited?: boolean; // Optional, if a post has been edited
  content: string;
  image?: string | null; // Changed to allow null
  tags?: string[]; // Optional array of tags, e.g., ["#ScienceExperiments", "#Volcano"]
}

export interface RecommendationItem {
  id: string;
  title: string;
  author?: string; // Specifically for books, but can be optional for movies too
  imageUrl: string; // URL to the movie poster or book cover
}
