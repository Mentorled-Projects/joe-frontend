"use client";

import ChildProfileCard from "@/components/child-components/ChildProfileCard";
import CreatePostSection from "@/components/child-components/CreatePostSection";
import PostFeed from "@/components/child-components/PostFeed";
import MovieRecommendationCard from "@/components/child-components/MovieRecommendationcard";
import BookRecommendationCard from "@/components/child-components/BookRecommendationCard";

export default function ChildHomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <main className="flex-1 pt-4 pb-6 px-4 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl grid grid-cols-1 gap-6 mt-6
                        sm:grid-cols-2 
                        lg:grid-cols-4"
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <ChildProfileCard />
          </div>

          <div className="sm:col-span-2 lg:col-span-2 flex flex-col space-y-6">
            <CreatePostSection />
            <PostFeed />
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex flex-col space-y-6">
            <MovieRecommendationCard />
            <BookRecommendationCard />
          </div>
        </div>
      </main>
    </div>
  );
}
