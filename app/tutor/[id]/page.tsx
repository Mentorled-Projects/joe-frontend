"use client";

import React from "react";
import TutorProfileHeader from "@/components/tutor-components/TutorProfileHeader";
import StudentAcceptanceStatus from "@/components/tutor-components/StudentAcceptanceStatus";
import AboutSection from "@/components/tutor-components/AboutSection";
import SubjectsAvailabilityCard from "@/components/tutor-components/SubjectsAvailabilityCard"; // New import
import ProfileAnalyticsCard from "@/components/tutor-components/ProfileAnalyticsCard"; // New import

// Define the props interface for the ProfilePage component
interface TutorProfilePageProps {
  params: {
    id: string; // The dynamic 'id' from the URL (e.g., /tutor/123 -> id is '123')
  };
}

export default function ProfilePage({ params }: TutorProfilePageProps) {
  const { id } = params;

  console.log("Currently viewing tutor profile for ID:", id);

  const subjectsOffered = ["Mathematics", "Statistics", "Calculus", "Algebra"];
  const availability = [
    "Monday - Friday: 4:00 PM - 8:00 PM",
    "Saturday: 10:00 AM - 2:00 PM",
    "Sunday: Not available",
  ];
  const profileAnalytics = {
    profileViews: 127,
    addedToWishlist: 23,
    messagesThisWeek: 8,
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <TutorProfileHeader tutorId={id} />
      <StudentAcceptanceStatus />
      <AboutSection />

      {/* Render the new Subjects and Availability Card component */}
      <SubjectsAvailabilityCard
        subjectsOffered={subjectsOffered}
        availability={availability}
        tutorId={id} // Pass tutorId to the component
      />

      {/* Render the new Profile Analytics Card component */}
      <ProfileAnalyticsCard
        profileViews={profileAnalytics.profileViews}
        addedToWishlist={profileAnalytics.addedToWishlist}
        messagesThisWeek={profileAnalytics.messagesThisWeek}
        tutorId={id} // Pass tutorId to the component
      />
    </div>
  );
}
