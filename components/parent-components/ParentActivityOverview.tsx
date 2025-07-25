"use client";

import React from "react";
import WeeklyActivitySummaryCard from "./WeeklyActivitySummaryCard";
import MovieRecommendationCard from "./MovieRecommendationCard";
import BookRecommendationCard from "./BookRecommendationCard";
import UpcomingMilestonesCard from "./UpcomingMilestonesCard";
import FavoriteTutorsCard from "./FavoriteTutorsCard";

interface ParentActivityOverviewProps {
  parentId: string;
}

export default function ParentActivityOverview({
  parentId,
}: ParentActivityOverviewProps) {
  return (
    <section className="max-w-5xl mx-auto mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-2">
          <WeeklyActivitySummaryCard />
        </div>
        <div>
          <MovieRecommendationCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2 lg:col-span-2 -mt-26">
          <UpcomingMilestonesCard />
          <FavoriteTutorsCard parentId={parentId} />
        </div>

        <div>
          <BookRecommendationCard />
        </div>
      </div>
    </section>
  );
}
