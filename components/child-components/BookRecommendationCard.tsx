"use client";

import Image from "next/image";
import Link from "next/link";
import { RecommendationItem } from "@/types/child";

const mockBooks: RecommendationItem[] = [
  {
    id: "b1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    imageUrl: "/assets/images/hobbit.jpg",
  },
  {
    id: "b2",
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    imageUrl: "/assets/images/Narnia.jpg",
  },
  {
    id: "b3",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    imageUrl: "/assets/images/harrypotterchamber.jpg",
  },
];

export default function BookRecommendationCard() {
  const books = mockBooks; // Using mock data for now

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Book Recommendation
        </h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          3 New
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {books.map((book) => (
          <div key={book.id} className="flex flex-col items-center text-center">
            <div className="w-full h-28 rounded-md overflow-hidden shadow-sm">
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={100}
                height={112}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-2">
              {book.title}
            </p>
            {book.author && (
              <p className="text-[10px] text-gray-500 line-clamp-1">
                {book.author}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="mt-4 text-center">
        <Link
          href="/child/recommendations/books"
          className="text-sm text-[#2F5FFF] hover:underline font-medium"
        >
          See All
        </Link>
      </div>
    </div>
  );
}
