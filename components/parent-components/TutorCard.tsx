"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tutor } from "@/types/Tutor";

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  // Simple state for favorite icon, can be integrated with backend later
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // if (onToggleFavorite) {
    //   onToggleFavorite(tutor._id);
    // }
  };

  return (
    <Link href={`/parent/HireTutor/${tutor._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        {/* Tutor Image */}
        <div className="relative w-full h-40 bg-gray-200">
          <Image
            src={
              tutor.avatar ||
              "https://placehold.co/160x160/E0E0E0/666666?text=AV"
            }
            alt={`${tutor.firstName} ${tutor.lastName}`}
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/160x160/E0E0E0/666666?text=AV";
            }}
          />
          {/* Favorite Icon */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
            aria-label="Add to favorites"
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500" : "text-gray-400"
              }`}
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </button>
        </div>

        {/* Tutor Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {tutor.firstName} {tutor.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {tutor.subjects && tutor.subjects.length > 0
              ? tutor.subjects.map((s) => s.name).join(", ")
              : "No subjects listed"}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-medium text-gray-800">
              {tutor.hourlyRate
                ? `$${tutor.hourlyRate.min}-${tutor.hourlyRate.max}/hr`
                : "Rate N/A"}
            </p>
            <div className="flex items-center text-yellow-500 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span>{tutor.rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-[#2F5FFF] text-white py-2 rounded-md hover:bg-[#1d46ff] transition-colors duration-200 text-sm font-medium">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}
