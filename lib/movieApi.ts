// lib/movieApi.ts

import { Movie, Feedback } from '@/types/child';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

const FAMILY_GENRE_ID = 10751;

interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  adult: boolean;
}

interface TmdbDiscoverResponse {
  page: number;
  results: TmdbMovieResult[];
  total_pages: number;
  total_results: number;
}

interface TmdbMovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  adult: boolean;
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}


const getGenreNames = (genreIds: number[], allGenres: { id: number; name: string }[]): string[] => {
  return genreIds.map(id => allGenres.find(genre => genre.id === id)?.name || 'Unknown').filter(name => name !== 'Unknown');
};

let cachedTmdbGenres: { id: number; name: string }[] = [];
async function fetchTmdbGenres(): Promise<{ id: number; name: string }[]> {
  if (cachedTmdbGenres.length > 0) {
    return cachedTmdbGenres;
  }
  try {
    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }
    const data = await response.json();
    cachedTmdbGenres = data.genres;
    return cachedTmdbGenres;
  } catch (error) {
    console.error("Error fetching TMDb genres:", error);
    return [];
  }
}


const movieApi = {
  getMovies: async (filters?: { genre?: string; familyFriendlyRating?: string; age?: string; level?: string; query?: string; isParentView?: boolean }): Promise<Movie[]> => {
    if (!TMDB_API_KEY) {
      console.error("TMDb API key is missing. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env.local file.");
      return [];
    }

    const allGenres = await fetchTmdbGenres();

    let url = `${TMDB_BASE_URL}/discover/movie`;
    const params = new URLSearchParams();
    params.append('api_key', TMDB_API_KEY);
    params.append('include_adult', 'false'); // Always exclude adult content by default
    params.append('language', 'en-US');
    params.append('sort_by', 'popularity.desc');

    // Apply child-specific filters ONLY if not in parent view
    if (!filters?.isParentView) {
      params.append('with_genres', String(FAMILY_GENRE_ID));
      params.append('certification_country', 'US');
      params.append('certification.lte', 'PG');
    }

    if (filters?.query) {
      url = `${TMDB_BASE_URL}/search/movie`;
      params.append('query', filters.query);
    }

    if (filters?.genre && filters.genre !== 'All') {
      const selectedGenre = allGenres.find(g => g.name.toLowerCase() === filters.genre!.toLowerCase());
      if (selectedGenre) {
        // If in child view, combine with FAMILY_GENRE_ID. Otherwise, just use the selected genre.
        params.set('with_genres', filters?.isParentView ? String(selectedGenre.id) : `${FAMILY_GENRE_ID},${selectedGenre.id}`);
      }
    }

    if (filters?.familyFriendlyRating && filters.familyFriendlyRating !== 'All') {
        let certification: string | undefined;
        switch (filters.familyFriendlyRating) {
            case 'G': certification = 'G'; break;
            case 'PG': certification = 'PG'; break;
            case 'PG-13': certification = 'PG-13'; break;
            case 'R': certification = 'R'; break; // Added R for parent view
            case 'NC-17': certification = 'NC-17'; break; // Added NC-17 for parent view
        }
        if (certification) {
            params.set('certification.lte', certification);
        }
    }

    url += `?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TmdbDiscoverResponse = await response.json();

      const filteredTmdbResults = data.results.filter(item => !item.adult);

      const movies: Movie[] = filteredTmdbResults.map((item: TmdbMovieResult) => ({
        id: String(item.id),
        title: item.title,
        imageUrl: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : "https://placehold.co/200x300/E0E0E0/666666?text=No+Poster",
        genre: getGenreNames(item.genre_ids, allGenres),
        familyFriendlyRating: "G", // This will be a placeholder, as TMDB doesn't directly provide this in results
        ageRange: "All Ages", // Placeholder
        level: "General", // Placeholder
        rating: parseFloat((item.vote_average / 2).toFixed(1)),
        reviewsCount: item.vote_count,
        summary: item.overview || "No summary available.",
        learningOutcomes: "Encourages imagination and critical thinking.",
        whyRecommend: "A delightful watch that sparks curiosity.",
        videoUrl: undefined,
        ratingsBreakdown: {
          5: Math.floor(Math.random() * (70 - 30) + 30),
          4: Math.floor(Math.random() * (30 - 10) + 10),
          3: Math.floor(Math.random() * (10 - 5) + 5),
          2: Math.floor(Math.random() * 5),
          1: Math.floor(Math.random() * 3),
        },
      }));

      return movies;

    } catch (error) {
      console.error("Error fetching movies from TMDb:", error);
      return [];
    }
  },

  getMovieById: async (id: string, isParentView?: boolean): Promise<Movie | undefined> => {
    if (!TMDB_API_KEY) {
      console.error("TMDb API key is missing.");
      return undefined;
    }

    const allGenres = await fetchTmdbGenres();

    try {
      const movieDetailResponse = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`);
      if (!movieDetailResponse.ok) {
        if (movieDetailResponse.status === 404) {
          return undefined;
        }
        throw new Error(`HTTP error! status: ${movieDetailResponse.status}`);
      }
      const item: TmdbMovieDetail = await movieDetailResponse.json();

      // Always block adult content unless explicitly allowed for a specific parent setting (not implemented here)
      if (item.adult && !isParentView) { // Keep blocking for child view
        console.warn(`Attempted to fetch adult movie details for ID: ${id} in child view. Blocking.`);
        return undefined;
      }

      let videoUrl: string | undefined;
      const trailer = item.videos?.results.find(v => v.site === "YouTube" && v.type === "Trailer");
      if (trailer) {
        videoUrl = `${TMDB_YOUTUBE_BASE_URL}${trailer.key}`;
      }

      const movie: Movie = {
        id: String(item.id),
        title: item.title,
        imageUrl: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : "https://placehold.co/200x300/E0E0E0/666666?text=No+Poster",
        genre: getGenreNames(item.genres.map(g => g.id), allGenres),
        familyFriendlyRating: "G", // Placeholder
        ageRange: "All Ages", // Placeholder
        level: "General", // Placeholder
        rating: parseFloat((item.vote_average / 2).toFixed(1)),
        reviewsCount: item.vote_count,
        summary: item.overview || "No summary available.",
        learningOutcomes: "Encourages imagination and critical thinking.",
        whyRecommend: "A delightful watch that sparks curiosity.",
        videoUrl: videoUrl,
        ratingsBreakdown: {
          5: Math.floor(Math.random() * (70 - 30) + 30),
          4: Math.floor(Math.random() * (30 - 10) + 10),
          3: Math.floor(Math.random() * (10 - 5) + 5),
          2: Math.floor(Math.random() * 5),
          1: Math.floor(Math.random() * 3),
        },
      };
      return movie;

    } catch (error) {
      console.error(`Error fetching movie with ID ${id} from TMDb:`, error);
      return undefined;
    }
  },

  submitFeedback: async (feedback: Feedback): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log("Submitting feedback (mock):", feedback);
    return { success: true, message: "Feedback submitted successfully!" };
  },
};

export default movieApi;
