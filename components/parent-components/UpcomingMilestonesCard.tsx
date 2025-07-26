"use client";

import React from "react";

interface Milestone {
  id: string;
  event: string;
  date: string;
  description: string;
  colorClass: string;
}

export default function UpcomingMilestonesCard() {
  // const milestones: Milestone[] = [
  //   {
  //     id: "1",
  //     event: "Emma's Birthday",
  //     date: "December 15th",
  //     description: "12 days away",
  //     colorClass: "bg-green-100 border-green-400",
  //   },
  //   {
  //     id: "2",
  //     event: "School Science Fair",
  //     date: "January 8th",
  //     description: "Lucas participating",
  //     colorClass: "bg-yellow-100 border-yellow-400",
  //   },
  // ];

  const milestones: Milestone[] = [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-[250px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Milestones
      </h2>
      <div className="space-y-3">
        {milestones.length > 0 ? (
          milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-3 rounded-lg border-l-4 ${milestone.colorClass}`}
            >
              <p className="font-medium text-gray-800">{milestone.event}</p>
              <p className="text-sm text-gray-600">
                {milestone.date} • {milestone.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No milestones added yet</p>
        )}
      </div>
    </div>
  );
}
