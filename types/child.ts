// types/child.ts

export interface ChildPost {
  id: string;
  authorName: string;
  authorAvatar: string; 
  timeAgo: string;
  edited?: boolean; 
  content: string;
  image?: string; 
  video?: string;
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
  tags: string[]; 
  rating: number; 
  reviewsCount: number; 
  summary: string;
  learningOutcomes: string;
  whyRecommend: string;
  ratingsBreakdown: { 
    5: number; 
    4: number; 
    3: number; 
    2: number; 
    1: number; 
  };
}


export interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  genre: string[]; 
  familyFriendlyRating: string; 
  ageRange: string;
  level: string; 
  rating: number; 
  reviewsCount: number; 
  summary: string;
  learningOutcomes: string;
  whyRecommend: string;
  videoUrl?: string; 
  ratingsBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}


export interface Feedback {
  bookId?: string; 
  movieId?: string; 
  content: string;
  rating?: number; 
}
