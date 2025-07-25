"use client";

import React, { useEffect } from "react";

// Define props interface for ProfileAnalyticsCard
interface ProfileAnalyticsCardProps {
  profileViews: number;
  addedToWishlist: number;
  messagesThisWeek: number;
  tutorId: string;
}

export default function ProfileAnalyticsCard({
  profileViews,
  addedToWishlist,
  messagesThisWeek,
  tutorId,
}: ProfileAnalyticsCardProps) {
  useEffect(() => {
    console.log("ProfileAnalyticsCard mounted for Tutor ID:", tutorId);
  }, [tutorId]); // Add tutorId to dependencies

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8 p-8">
      <h3 className="text-xl font-semibold mb-4">Profile Analytics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F5F3FF] p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-[#2F5FFF]">{profileViews}</p>
          <p className="text-sm text-gray-600">Profile Views</p>
        </div>
        <div className="bg-[#F0FFF4] p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-[#2ECC71]">{addedToWishlist}</p>
          <p className="text-sm text-gray-600">Added to Wishlist</p>
        </div>
        <div className="bg-[#FFF5F0] p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-[#FF8C00]">
            {messagesThisWeek}
          </p>
          <p className="text-sm text-gray-600">Messages This Week</p>
        </div>
      </div>
    </section>
  );
}
