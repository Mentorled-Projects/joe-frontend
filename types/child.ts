

export interface ChildPost {
  id: string;
  authorName: string;
  authorAvatar: string; 
  timeAgo: string;
  edited?: boolean; 
  content: string;
  image?: string | null; 
  tags?: string[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  author?: string; 
  imageUrl: string; 
}


export interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  ageRange: string;
  level: string;
  tags: string[]; // e.g., ["Science", "Adventure"]
  rating: number; // e.g., 4.5
  reviewsCount: number; // e.g., 125
  summary: string;
  learningOutcomes: string;
  whyRecommend: string;
  ratingsBreakdown: { // For the detailed rating bar chart
    5: number; 
    4: number; 
    3: number; 
    2: number; 
    1: number; 
  };
}

// NEW: Feedback interface
export interface Feedback {
  bookId: string;
  content: string;
  rating?: number; 
}
