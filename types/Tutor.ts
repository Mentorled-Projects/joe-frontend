
export interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string; 
  avatar?: string; 
  banner?: string; 
  hourlyRate?: { 
    min: number;
    max: number;
  };
  rating?: number;
  reviewsCount?: number;
  subjects?: { name: string; level: string }[];
  certifications?: string[];
  about?: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
 
}
