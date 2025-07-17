// components/child-components/MovieDetailsModal.tsx
"use client";

import { Movie } from "@/types/child";
import Image from "next/image";

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onLeaveFeedback: (movie: Movie) => void;
}

export default function MovieDetailsModal({
  movie,
  onClose,
  onLeaveFeedback,
}: MovieDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6">
        {/* Close Button */}
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

        {/* Video Player / Image Placeholder */}
        <div className="mb-6 rounded-lg overflow-hidden">
          {movie.videoUrl ? (
            // Embed YouTube video if videoUrl is available
            <div
              className="relative"
              style={{
                paddingBottom: "56.25%" /* 16:9 Aspect Ratio */,
                height: 0,
              }}
            >
              <iframe
                src={
                  movie.videoUrl.replace("watch?v=", "embed/") +
                  "?autoplay=0&controls=1"
                } // Convert to embed URL
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            // Fallback to image if no video URL
            <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
              <Image
                src={movie.imageUrl}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/600x350/E0E0E0/666666?text=No+Video+Available";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xl font-semibold">
                No Trailer Available
              </div>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{movie.title}</h2>
          <p className="text-md text-gray-700 mt-2">
            Genre: {movie.genre.join(", ")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Age Range: {movie.ageRange} | Level: {movie.level} | Rating:{" "}
            {movie.familyFriendlyRating}
          </p>
        </div>

        <div className="space-y-4 text-gray-700 text-sm">
          <p className="font-semibold text-base">Why we recommend this movie</p>
          <p>{movie.whyRecommend}</p>

          <p className="font-semibold text-base">Summary</p>
          <p>{movie.summary}</p>

          <p className="font-semibold text-base">Learning Outcomes</p>
          <p>{movie.learningOutcomes}</p>

          <div className="mt-6">
            <p className="font-semibold text-base mb-2">
              {movie.rating.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {movie.reviewsCount} reviews
            </p>
            {Object.entries(movie.ratingsBreakdown)
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLeaveFeedback(movie)}
              className="px-4 py-2 bg-[#2F5FFF] text-white text-sm rounded-4xl hover:bg-[#1d46ff] transition-colors duration-200"
            >
              Leave Feedback
            </button>
            <button className="px-4 py-2 border border-[#2F5FFF] text-sm rounded-4xl text-[#2F5FFF] hover:bg-gray-100 transition-colors duration-200">
              Add to Library
            </button>
          </div>

          <div>
            <button className="text-[#1E1E1E] px-4 py-2 border text-sm rounded-4xl bg-[#E2E8F0] hover:text-gray-700 transition-colors duration-200">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
