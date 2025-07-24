"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface ReviewsModalProps {
  onClose: () => void;
  tutorName: string;
  tutorId: string;
}

const LOCAL_STORAGE_REVIEWS_KEY_PREFIX = "tutorReviews_";

export default function ReviewsModal({
  onClose,
  tutorName,
  tutorId,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  const mockReviews: Review[] = useMemo(
    () => [
      {
        id: "rev1",
        reviewerName: "Jenny Osborn",
        rating: 5,
        comment:
          "Sarah has been tutoring my daughter in Algebra for the past 3 months, and we've seen remarkable improvement. She explains concepts clearly and is very patient. My daughter's confidence in math has grown significantly.",
        date: "5 days ago",
        avatar: "https://placehold.co/40x40/E0E0E0/666666?text=JO",
      },
      {
        id: "rev2",
        reviewerName: "Mikhel Aretra",
        rating: 4,
        comment:
          "My son was struggling with calculus until we found Sarah. She has a gift for breaking down complex topics into understandable parts. She's also very flexible with scheduling and offers both in-person and online sessions which has been incredibly convenient for us.",
        date: "5 days ago",
        avatar: "https://placehold.co/40x40/E0E0E0/666666?text=MA",
      },
      {
        id: "rev3",
        reviewerName: "Jose Mourinho",
        rating: 1,
        comment:
          "My son was struggling with calculus until we found Sarah. She has a gift for breaking down complex topics into understandable parts. She's also very flexible with scheduling and offers both in-person and online sessions which has been incredibly convenient for us.",
        date: "5 days ago",
        avatar: "https://placehold.co/40x40/E0E0E0/666666?text=JM",
      },
    ],
    []
  );

  useEffect(() => {
    // Load reviews from localStorage
    const localStorageKey = `${LOCAL_STORAGE_REVIEWS_KEY_PREFIX}${tutorId}`;
    const storedReviews = localStorage.getItem(localStorageKey);
    if (storedReviews) {
      setReviews([...mockReviews, ...JSON.parse(storedReviews)]);
    } else {
      setReviews(mockReviews);
    }
  }, [tutorId, mockReviews]);

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;

    const newReview: Review = {
      id: `user-rev-${Date.now()}`,
      reviewerName: "You", // Placeholder for current user
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: "Just now",
      avatar: "https://placehold.co/40x40/E0E0E0/666666?text=YOU", // Placeholder for user avatar
    };

    setReviews((prevReviews) => {
      const updatedReviews = [newReview, ...prevReviews]; // Add new review to top
      const localStorageKey = `${LOCAL_STORAGE_REVIEWS_KEY_PREFIX}${tutorId}`;
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(
          updatedReviews.filter(
            (r) => !mockReviews.some((mr) => mr.id === r.id)
          )
        )
      ); // Save only user-added reviews
      return updatedReviews;
    });

    setNewReviewText("");
    setNewReviewRating(5);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Reviews for {tutorName}</h2>

        {/* Overall Rating (Optional, could be calculated from reviews) */}
        <div className="flex items-center justify-center mb-6">
          {renderStars(4.9)} {/* Example: Overall rating */}
          <span className="ml-2 text-xl font-bold text-gray-800">4.9</span>
          <span className="ml-1 text-gray-500">
            ({reviews.length} comments)
          </span>
        </div>

        {/* Add New Review Section */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
          <div className="flex items-center mb-3">
            <span className="mr-2 text-gray-700">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setNewReviewRating(star)}
                className={`p-1 ${
                  star <= newReviewRating ? "text-yellow-400" : "text-gray-300"
                }`}
                aria-label={`${star} star rating`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm resize-y min-h-[80px]"
            placeholder="Share your experience..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
          ></textarea>
          <button
            onClick={handleAddReview}
            disabled={!newReviewText.trim()}
            className="mt-3 px-5 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Submit Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No reviews yet. Be the first!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 last:border-b-0 py-4"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={review.avatar}
                      alt={review.reviewerName}
                      width={40}
                      height={40}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </p>
                    <div className="flex items-center text-sm">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                <p className="text-gray-500 text-xs">{review.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
