"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

export default function BookRecommendationCard() {
  const books: Book[] = [
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Book Recommendation
        </h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          3 New
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {books.map((book) => (
          <div key={book.id} className="flex flex-col items-center text-center">
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={80}
              height={120}
              className="rounded-md object-cover mb-1"
            />
            <p className="text-xs font-medium text-gray-800 truncate w-full">
              {book.title}
            </p>
            <p className="text-[10px] text-gray-500">{book.author}</p>
          </div>
        ))}
      </div>
      <Link
        href="/parent/recommendations/books"
        className="mt-4 block text-center text-[#2F5FFF] hover:underline text-sm"
      >
        See All
      </Link>
    </div>
  );
}
