// types/child.ts

export interface ChildPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  edited?: boolean; 
  content: string;
  image?: string;
  tags?: string[]; 
}

export interface RecommendationItem {
  id: string;
  title: string;
  author?: string; 
  imageUrl: string; 
}
