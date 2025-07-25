"use client";

import React from "react";
import { MdEdit } from "react-icons/md"; // Import MdEdit icon

// Define props interface for SubjectsAvailabilityCard
interface SubjectsAvailabilityCardProps {
  subjectsOffered: string[];
  availability: string[];
  tutorId: string; // Keep tutorId for consistency, even if not directly used here yet
}

export default function SubjectsAvailabilityCard({
  subjectsOffered,
  availability,
  tutorId,
}: SubjectsAvailabilityCardProps) {
  console.log("SubjectsAvailabilityCard mounted for Tutor ID:", tutorId);

  return (
    <section className="max-w-5xl mx-auto mb-8">
      {" "}
      {/* Adjusted section to remove background/shadow here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjects Offered Card */}
        <div className="bg-white rounded-lg shadow p-8">
          {" "}
          {/* Individual card for Subjects Offered */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold">Subjects Offered</h3>
            <button
              onClick={() => {
                // Future: Open modal for editing subjects
                console.log("Edit Subjects clicked for Tutor ID:", tutorId);
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Edit subjects"
            >
              <MdEdit size={24} className="text-gray-500" /> {/* MdEdit icon */}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectsOffered.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#E0E7FF] text-[#2F5FFF] rounded-full text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Availability Card */}
        <div className="bg-white rounded-lg shadow p-8">
          {" "}
          {/* Individual card for Availability */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold">Availability</h3>
            <button
              onClick={() => {
                // Future: Open modal for editing availability
                console.log("Edit Availability clicked for Tutor ID:", tutorId);
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Edit availability"
            >
              <MdEdit size={24} className="text-gray-500" /> {/* MdEdit icon */}
            </button>
          </div>
          <ul className="text-gray-800 text-sm space-y-1">
            {availability.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
