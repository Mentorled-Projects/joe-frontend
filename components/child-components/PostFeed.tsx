"use client";

import Image from "next/image";
import { FiMoreHorizontal } from "react-icons/fi";
import { usePostStore } from "@/stores/usePostStore"; // Import the new post store
import { ChildPost } from "@/types/child"; // Ensure ChildPost is imported

export default function PostFeed() {
  const { posts } = usePostStore(); // Get posts from the store

  // You can still keep mock data for initial display if the store is empty
  // For example, if you want some default posts to show before the user creates any.
  const initialMockPosts: ChildPost[] = [
    {
      id: "1",
      authorName: "Alex Thompson",
      authorAvatar: "/assets/images/kiddp.svg", // Placeholder avatar
      timeAgo: "4h",
      edited: true,
      content:
        "Just finished my volcano science project! It actually erupted! 🌋 #ScienceExperiments #Volcano",
      image: "/assets/images/kid-volcano.svg", // Placeholder post image
      tags: ["#ScienceExperiments", "#Volcano"],
    },
    {
      id: "2",
      authorName: "Emma Thompson",
      authorAvatar: "/assets/images/kiddp.svg", // Placeholder avatar
      timeAgo: "1h",
      content:
        "I finished reading 'The Magical Treehouse' series! It was so exciting. What should I read next? #books #reading 📚",
      image: "/assets/images/kidsRabbit.svg", // Placeholder post image
      tags: ["#books", "#reading"],
    },
  ];

  // Display live posts if available, otherwise fall back to mock posts
  const displayedPosts = posts.length > 0 ? posts : initialMockPosts;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-end mb-4">
        <select className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#2F5FFF]">
          <option>Sort by Top</option>
          <option>Sort by Newest</option>
          <option>Sort by Oldest</option>
        </select>
      </div>

      <div className="space-y-6">
        {displayedPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts yet. Start by creating one!
          </p>
        ) : (
          displayedPosts.map((post) => (
            <div
              key={post.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.timeAgo} {post.edited && "• Edited"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <FiMoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-3">{post.content}</p>

              {post.image && (
                <div className="rounded-lg overflow-hidden mb-3">
                  <Image
                    src={post.image}
                    alt="Post Image"
                    width={600}
                    height={300}
                    className="object-cover w-full h-auto"
                    unoptimized
                  />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-blue-600">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-50 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
