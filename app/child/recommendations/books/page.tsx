// app/child/recommendations/books/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Assuming you have a header with a logo
import bookApi from "@/lib/bookApi";
import { Book } from "@/types/child";
import BookCard from "@/components/child-components/BookCard";

function SearchBar() {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-6">
      <input
        type="text"
        placeholder="Search for books, movies, and more"
        className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm"
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

function FilterDropdowns() {
  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <select className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
        <option>Genre</option>
        <option>Fantasy</option>
        <option>Mystery</option>
        <option>Science Fiction</option>
      </select>
      <select className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
        <option>Academic Subject</option>
        <option>Science</option>
        <option>History</option>
      </select>
      <select className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
        <option>Age Group</option>
        <option>6-8 years</option>
        <option>8-10 years</option>
        <option>9-12 years</option>
      </select>
      <select className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
        <option>Level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>
  );
}

function BookDetailsModal({
  book,
  onClose,
  onLeaveFeedback,
}: {
  book: Book;
  onClose: () => void;
  onLeaveFeedback: (book: Book) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
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

        <div className="flex flex-col items-center mb-6">
          {/* Placeholder for the character image in the modal */}
          <Image
            src="/public/assets/images/Magic-house.svg"
            alt="Character"
            width={150}
            height={150}
            className="object-contain mb-4"
            unoptimized
          />
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {book.title}
          </h2>
          <p className="text-md text-gray-700 mt-1">By {book.author}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Age Range: {book.ageRange} | Level: {book.level}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {book.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-gray-700 text-sm">
          <p className="font-semibold text-base">Why we recommend this book</p>
          <p>{book.whyRecommend}</p>

          <p className="font-semibold text-base">Summary</p>
          <p>{book.summary}</p>

          <p className="font-semibold text-base">Learning Outcomes</p>
          <p>{book.learningOutcomes}</p>

          <div className="mt-6">
            <p className="font-semibold text-base mb-2">
              {book.rating.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {book.reviewsCount} reviews
            </p>
            {Object.entries(book.ratingsBreakdown)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([star, percentage]) => (
                <div key={star} className="flex items-center mb-2">
                  <span className="text-sm font-medium w-6">{star}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-10 text-right">
                    {percentage}%
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => onLeaveFeedback(book)}
            className="px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200"
          >
            Leave Feedback
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200">
            Add to Library
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            Report
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({
  book,
  onClose,
  onSubmitFeedback,
}: {
  book: Book;
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
          Leave feedback for {book.title}
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

export default function BooksRecommendationsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetailsModal, setShowBookDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBooks = await bookApi.getBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookCardClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetailsModal(true);
  };

  const handleCloseBookDetailsModal = () => {
    setShowBookDetailsModal(false);
    setSelectedBook(null);
  };

  const handleLeaveFeedbackClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookDetailsModal(false);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (feedbackContent: string) => {
    if (selectedBook) {
      try {
        const response = await bookApi.submitFeedback({
          bookId: selectedBook.id,
          content: feedbackContent,
        });
        if (response.success) {
          alert(response.message);
          setShowFeedbackModal(false);
        } else {
          alert(`Failed to submit feedback: ${response.message}`);
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting feedback.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <SearchBar />

          {/* Filter Dropdowns */}
          <FilterDropdowns />

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Books Recommended
          </h2>

          {loading && (
            <div className="text-center text-gray-600 text-lg">
              Loading books...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 text-lg">{error}</div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="text-center text-gray-500 text-lg">
              No books found.
            </div>
          )}

          {/* Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={handleBookCardClick}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showBookDetailsModal && selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={handleCloseBookDetailsModal}
          onLeaveFeedback={handleLeaveFeedbackClick}
        />
      )}

      {showFeedbackModal && selectedBook && (
        <FeedbackModal
          book={selectedBook}
          onClose={() => setShowFeedbackModal(false)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
