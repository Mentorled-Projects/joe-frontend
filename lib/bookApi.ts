
import { Book, Feedback } from '@/types/child'; 


interface GutendexBookItem {
  id: number;
  title: string;
  authors: Array<{
    name: string;
    birth_year: number;
    death_year: number;
  }>;
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: { [key: string]: string }; 
  download_count: number;

  description?: string;
}



function getImageUrl(formats: { [key: string]: string }): string {
  // Prioritize specific image types, then fall back to any available image
  const preferredFormats = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  for (const formatType of preferredFormats) {
    for (const key in formats) {
      if (key.includes(formatType)) {
        return formats[key];
      }
    }
  }

  
  for (const key in formats) {
    if (key.startsWith('image/')) {
      return formats[key];
    }
  }


  return "https://placehold.co/128x192/E0E0E0/666666?text=No+Cover";
}


// Simulate API calls with Promises and delays
const bookApi = {
  getBooks: async (filters?: { genre?: string; subject?: string; age?: string; level?: string; query?: string }): Promise<Book[]> => {
    // Gutendex API endpoint for books
    let url = 'https://gutendex.com/books/';
    const params = new URLSearchParams();

    // Always request children's books for this context
    params.append('topic', 'children');

    if (filters?.query) {
      params.append('search', filters.query);
    }
   

    url += `?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Map Gutendex response to your Book interface using GutendexBookItem
      const books: Book[] = data.results.map((item: GutendexBookItem) => ({
        id: String(item.id), 
        title: item.title,
        author: item.authors[0]?.name || "Unknown Author", 
        imageUrl: getImageUrl(item.formats), 
        
        ageRange: "All Ages", 
        level: "General", 
        tags: item.subjects ? item.subjects.slice(0, 3) : ["General"], 
        rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
        reviewsCount: Math.floor(Math.random() * 200) + 50, 
        summary: item.description || "A captivating story for young readers.", 
        learningOutcomes: "Encourages imagination and critical thinking.", 
        whyRecommend: "A delightful read that sparks curiosity.", 
        ratingsBreakdown: { 
          5: Math.floor(Math.random() * (70 - 30) + 30),
          4: Math.floor(Math.random() * (30 - 10) + 10),
          3: Math.floor(Math.random() * (10 - 5) + 5),
          2: Math.floor(Math.random() * 5),
          1: Math.floor(Math.random() * 3),
        },
      }));

   
      let filteredBooks = [...books];
      if (filters) {
        if (filters.genre) {
          filteredBooks = filteredBooks.filter(book => book.tags.some(tag => tag.toLowerCase().includes(filters.genre!.toLowerCase())));
        }
        if (filters.subject) {
          filteredBooks = filteredBooks.filter(book => book.tags.some(tag => tag.toLowerCase().includes(filters.subject!.toLowerCase())));
        }
     
      }


      return filteredBooks;

    } catch (error) {
      console.error("Error fetching books from Gutendex:", error);
     
      return [];
    }
  },

  getBookById: async (id: string): Promise<Book | undefined> => {

    const url = `https://gutendex.com/books/${id}/`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // If book not found, Gutendex returns 404
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const item: GutendexBookItem = await response.json(); 

     
      const book: Book = {
        id: String(item.id),
        title: item.title,
        author: item.authors[0]?.name || "Unknown Author",
        imageUrl: getImageUrl(item.formats),
     
        ageRange: "All Ages",
        level: "General",
        tags: item.subjects ? item.subjects.slice(0, 3) : ["General"],
        rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
        reviewsCount: Math.floor(Math.random() * 200) + 50,
        summary: item.description || "A captivating story for young readers.",
        learningOutcomes: "Encourages imagination and critical thinking.",
        whyRecommend: "A delightful read that sparks curiosity.",
        ratingsBreakdown: {
          5: Math.floor(Math.random() * (70 - 30) + 30),
          4: Math.floor(Math.random() * (30 - 10) + 10),
          3: Math.floor(Math.random() * (10 - 5) + 5),
          2: Math.floor(Math.random() * 5),
          1: Math.floor(Math.random() * 3),
        },
      };
      return book;

    } catch (error) {
      console.error(`Error fetching book with ID ${id} from Gutendex:`, error);
      return undefined;
    }
  },

  submitFeedback: async (feedback: Feedback): Promise<{ success: boolean; message: string }> => {
    // This remains a mock for feedback submission
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log("Submitting feedback (mock):", feedback);
    return { success: true, message: "Feedback submitted successfully!" };
  },
};

export default bookApi;
