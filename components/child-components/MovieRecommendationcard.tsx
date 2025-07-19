"use client";

import Image from "next/image";
import { RecommendationItem } from "@/types/child";

const mockMovies: RecommendationItem[] = [
  {
    id: "m1",
    title: "The Secret Garden",
    imageUrl: "/assets/images/secretGarden.jpg",
  },
  {
    id: "m2",
    title: "The Lion King",
    imageUrl: "/assets/images/lionking.jpeg",
  },
  {
    id: "m3",
    title: "Moana",
    imageUrl: "/assets/images/moana.jpeg",
  },
];

export default function MovieRecommendationCard() {
  const movies = mockMovies;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
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
            <div className="w-full h-28 rounded-md overflow-hidden shadow-sm">
              <Image
                src={movie.imageUrl}
                alt={movie.title}
                width={100}
                height={112}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-2">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
