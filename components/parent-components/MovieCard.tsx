"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    vote_average: number;
    release_date: string;
  };
  imageUrl: string;
}

export default function MovieCard({ movie, imageUrl }: MovieCardProps) {
  interface FormatRating {
    (rating: number): string;
  }

  const formatRating: FormatRating = (rating) => rating.toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="relative w-full h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
        {imageUrl && movie.poster_path ? (
          <Image
            src={imageUrl}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            unoptimized
          />
        ) : (
          <span className="text-gray-500 text-sm p-4 text-center">
            No Image Available
          </span>
        )}
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          {new Date(movie.release_date).getFullYear()}
        </p>
        <div className="flex items-center text-yellow-500 text-xs mb-2">
          <FaStar className="mr-1" /> {formatRating(movie.vote_average)}
        </div>
      </div>
    </div>
  );
}
