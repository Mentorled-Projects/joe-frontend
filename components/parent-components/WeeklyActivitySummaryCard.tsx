"use client";

import React from "react";

export default function WeeklyActivitySummaryCard() {
  const summaryData = {
    achievements: 10,
    booksRead: 23,
    newSkills: 8,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Weekly Activity Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-[#2F5FFF]">
            {summaryData.achievements}
          </p>
          <p className="text-sm text-gray-600">Achievements</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700">
            {summaryData.booksRead}
          </p>
          <p className="text-sm text-gray-600">Books Read</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-purple-700">
            {summaryData.newSkills}
          </p>
          <p className="text-sm text-gray-600">New Skills</p>
        </div>
      </div>
    </div>
  );
}
