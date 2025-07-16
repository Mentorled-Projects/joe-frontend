"use client";

import Image from "next/image";
import { Book } from "@/types/child";
import { FaStar } from "react-icons/fa";

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
      onClick={() => onClick(book)}
    >
      <div className="relative w-full h-48 bg-gray-200 flex-shrink-0">
        <Image
          src={book.imageUrl}
          alt={book.title}
          layout="fill"
          objectFit="cover"
          unoptimized
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/200x280/E0E0E0/666666?text=No+Cover";
          }}
        />
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">By {book.author}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Age Range: {book.ageRange} | Level: {book.level}
        </p>

        <div className="flex items-center mt-2">
          <FaStar className="text-yellow-400 mr-1" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {book.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            ({book.reviewsCount} reviews)
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {book.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <button className="flex items-center gap-1 text-[#2F5FFF] hover:text-[#1d46ff] transition-colors duration-200 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Library
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm font-medium">
            Report
          </button>
        </div>
      </div>
    </div>
  );
}
