"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  genre: string;
  imageUrl: string;
}

export default function MovieRecommendationCard() {
  const movies: Movie[] = [
    {
      id: "1",
      title: "The Secret Garden",
      genre: "Movie",
      imageUrl: "/assets/images/secretGarden.jpg",
    },
    {
      id: "2",
      title: "The Lion King",
      genre: "Movie",
      imageUrl: "/assets/images/lionking.jpeg",
    },
    {
      id: "3",
      title: "Moana",
      genre: "Movie",
      imageUrl: "/assets/images/moana.jpeg",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Movie Recommendation
        </h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          3 New
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex flex-col items-center text-center"
          >
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              width={80}
              height={120}
              className="rounded-md object-cover mb-1"
            />
            <p className="text-xs font-medium text-gray-800 truncate w-full">
              {movie.title}
            </p>
            <p className="text-[10px] text-gray-500">{movie.genre}</p>
          </div>
        ))}
      </div>
      <Link
        href="/parent/recommendations/movies"
        className="mt-4 block text-center text-[#2F5FFF] hover:underline text-sm"
      >
        See All
      </Link>
    </div>
  );
}
