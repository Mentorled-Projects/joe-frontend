// lib/bookApi.ts

import { Book, Feedback } from '@/types/child';

interface OpenLibraryDocItem {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  subject?: string[];
}

function getOpenLibraryImageUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string {
  if (coverId) {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
  return "https://placehold.co/128x192/E0E0E0/666666?text=No+Cover";
}

const bookApi = {
  getBooks: async (filters?: { genre?: string; subject?: string; age?: string; level?: string; query?: string; isParentView?: boolean }): Promise<Book[]> => {
    let url = 'https://openlibrary.org/search.json';
    const params = new URLSearchParams();

    // Determine if a specific search query or subject/genre filter is provided
    const hasSpecificSearch = filters?.query || (filters?.genre && filters.genre !== 'All') || (filters?.subject && filters.subject !== 'All');

    if (filters?.query) {
      params.append('q', filters.query);
    } else if (filters?.isParentView && !hasSpecificSearch) {
      // For parent view, if no specific query or genre/subject, default to 'fiction'
      params.append('q', 'fiction');
    } else if (!filters?.isParentView && !hasSpecificSearch) {
      // For child view, if no specific query or genre/subject, default to 'children'
      params.append('subject', 'children');
    }

    if (filters?.genre && filters.genre !== 'All') {
        params.append('subject', filters.genre.toLowerCase());
    }
    if (filters?.subject && filters.subject !== 'All') {
        params.append('subject', filters.subject.toLowerCase());
    }

    params.append('limit', '40'); // Limit the number of results

    url += `?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const books: Book[] = data.docs.map((item: OpenLibraryDocItem) => {
        const authorName = item.author_name && item.author_name.length > 0 ? item.author_name[0] : "Unknown Author";
        const coverId = item.cover_i;

        return {
          id: item.key.split('/').pop() || String(Math.random()),
          title: item.title,
          author: authorName,
          imageUrl: getOpenLibraryImageUrl(coverId, 'M'),
          ageRange: "All Ages", 
          level: "General", 
          tags: item.subject ? item.subject.slice(0, 3) : ["General"],
          rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
          reviewsCount: Math.floor(Math.random() * 200) + 50,
          summary: "A captivating story for young readers.",
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
      });

    
      const filteredBooks = [...books];
      if (filters?.age && filters.age !== 'All Ages') {
       
      }
      if (filters?.level && filters.level !== 'General') {
       
      }

      return filteredBooks;

    } catch (error) {
      console.error("Error fetching books from Open Library:", error);
      return [];
    }
  },

  getBookById: async (id: string): Promise<Book | undefined> => {
    const url = `https://openlibrary.org/works/${id}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      interface OpenLibraryWork {
        title: string;
        description?: string | { value: string };
        authors?: { author: { key: string } }[];
        covers?: number[];
        subjects?: string[];
      }
      const item: OpenLibraryWork = await response.json();

      let authorName = "Unknown Author";
      if (item.authors && item.authors.length > 0 && item.authors[0].author?.key) {
        const authorKey = item.authors[0].author.key;
        try {
          const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
          if (authorRes.ok) {
            const authorData = await authorRes.json();
            authorName = authorData.name || authorName;
          }
        } catch (authorError) {
          console.warn("Could not fetch author details:", authorError);
        }
      }

      let coverId: number | undefined;
      if (item.covers && item.covers.length > 0) {
        coverId = item.covers[0];
      }

      const book: Book = {
        id: id,
        title: item.title,
        author: authorName,
        imageUrl: getOpenLibraryImageUrl(coverId, 'L'),
        summary: typeof item.description === 'string' ? item.description : (item.description?.value || "A detailed summary is not available for this book."),
        ageRange: "All Ages",
        level: "General",
        tags: item.subjects ? item.subjects.slice(0, 3) : ["General"],
        rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
        reviewsCount: Math.floor(Math.random() * 200) + 50,
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
      console.error(`Error fetching book with ID ${id} from Open Library:`, error);
      return undefined;
    }
  },

  submitFeedback: async (feedback: Feedback): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log("Submitting feedback (mock):", feedback);
    return { success: true, message: "Feedback submitted successfully!" };
  },
};

export default bookApi;
