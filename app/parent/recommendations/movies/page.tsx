"use client";

import { useState, useEffect, useCallback } from "react";
import movieApi from "@/lib/movieApi";
import { Movie } from "@/types/child";
import MovieCard from "@/components/child-components/MovieCard";
import MovieDetailsModal from "@/components/child-components/MovieDetailsModal";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-6">
      <input
        type="text"
        placeholder="Search for movies, TV shows, and more"
        className="w-full p-3 pl-10 border border-gray-300 bg-[#E9F3FF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  );
}

interface FilterDropdownsProps {
  onFilterChange: (filters: {
    genre?: string;
    familyFriendlyRating?: string;
  }) => void;
  currentFilters: {
    genre?: string;
    familyFriendlyRating?: string;
  };
}

function FilterDropdowns({
  onFilterChange,
  currentFilters,
}: FilterDropdownsProps) {
  const genres = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];
  const familyFriendlyRatings = ["All", "G", "PG", "PG-13", "R", "NC-17"];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...currentFilters,
      [name]: value === "" || value === "All" ? undefined : value,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <select
        name="genre"
        value={currentFilters.genre || ""}
        onChange={handleSelectChange}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-[#49454F1A] text-gray-700"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        name="familyFriendlyRating"
        value={currentFilters.familyFriendlyRating || ""}
        onChange={handleSelectChange}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm bg-[#49454F1A] text-gray-700"
      >
        <option value="">All Ratings</option>
        {familyFriendlyRatings.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeedbackModal({
  movie,
  onClose,
  onSubmitFeedback,
}: {
  // Explicitly type props
  movie: Movie;
  onClose: () => void;
  onSubmitFeedback: (feedbackContent: string) => void;
}) {
  const [feedbackContent, setFeedbackContent] = useState("");

  const handleSubmit = () => {
    if (feedbackContent.trim()) {
      onSubmitFeedback(feedbackContent);
      setFeedbackContent("");
    } else {
      alert("Feedback cannot be empty.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Leave feedback for {movie.title}
        </h2>

        <textarea
          placeholder="Tell us about your experience"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm resize-none"
          rows={6}
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
        ></textarea>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#2F5FFF] text-white rounded hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!feedbackContent.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParentMovieRecommendationsPage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // Explicitly type useState
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); // Explicitly type useState
  const [loading, setLoading] = useState<boolean>(true); // Explicitly type useState
  const [error, setError] = useState<string | null>(null); // Explicitly type useState
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Explicitly type useState
  const [showMovieDetailsModal, setShowMovieDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    // Explicitly type useState
    genre?: string;
    familyFriendlyRating?: string;
  }>({});

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: { genre?: string; familyFriendlyRating?: string }) => {
      setFilters(newFilters);
    },
    []
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedMovies = await movieApi.getMovies({
          query: searchTerm,
          genre: filters.genre,
          familyFriendlyRating: filters.familyFriendlyRating,
          isParentView: true,
        });
        setAllMovies(fetchedMovies);
      } catch (err: unknown) {
        // Type err as unknown and then narrow it
        console.error("Failed to fetch movies:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load movies. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, filters.genre, filters.familyFriendlyRating]);

  useEffect(() => {
    setFilteredMovies(allMovies);
  }, [allMovies]);

  const handleMovieCardClick = async (movie: Movie) => {
    // Explicitly type movie parameter
    setLoading(true);
    try {
      const fullMovie = await movieApi.getMovieById(movie.id, true);
      if (fullMovie) {
        setSelectedMovie(fullMovie);
        setShowMovieDetailsModal(true);
      } else {
        setError("Failed to load movie details.");
      }
    } catch (err: unknown) {
      // Type err as unknown and then narrow it
      console.error("Failed to fetch movie details:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load movie details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMovieDetailsModal = () => {
    setShowMovieDetailsModal(false);
    setSelectedMovie(null);
  };

  const handleLeaveFeedbackClick = (movie: Movie) => {
    // Explicitly type movie parameter
    setSelectedMovie(movie);
    setShowMovieDetailsModal(false);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (feedbackContent: string) => {
    // Explicitly type feedbackContent parameter
    if (selectedMovie) {
      try {
        const response = await movieApi.submitFeedback({
          movieId: selectedMovie.id,
          content: feedbackContent,
        });
        if (response.success) {
          alert(response.message);
          setShowFeedbackModal(false);
        } else {
          alert(`Failed to submit feedback: ${response.message}`);
        }
      } catch (error: unknown) {
        // Type error as unknown and then narrow it
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting feedback.");
      }
    }
  };

  const yourNextWatch = filteredMovies.slice(0, 4);
  const topPickedForYou = filteredMovies.slice(4, 8);
  const trendingNow = filteredMovies.slice(8, 12);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10">
              Movie Recommendations
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of movies for you and your family!
            </p>
          </div>

          <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />

          <FilterDropdowns
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />

          {loading && (
            <div className="text-center text-gray-600 text-lg py-10">
              Loading movies...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 text-lg py-10">
              {error}
            </div>
          )}

          {!loading && !error && filteredMovies.length === 0 && (
            <div className="text-center text-gray-500 text-lg py-10">
              No movies found.
            </div>
          )}

          {!loading && !error && filteredMovies.length > 0 && (
            <>
              {yourNextWatch.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Your Next Watch
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {yourNextWatch.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={handleMovieCardClick}
                      />
                    ))}
                  </div>
                </section>
              )}

              {topPickedForYou.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Top Picked For You
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topPickedForYou.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={handleMovieCardClick}
                      />
                    ))}
                  </div>
                </section>
              )}

              {trendingNow.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Trending Now
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trendingNow.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={handleMovieCardClick}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {showMovieDetailsModal && selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={handleCloseMovieDetailsModal}
          onLeaveFeedback={handleLeaveFeedbackClick}
        />
      )}

      {showFeedbackModal && selectedMovie && (
        <FeedbackModal
          movie={selectedMovie}
          onClose={() => setShowFeedbackModal(false)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
