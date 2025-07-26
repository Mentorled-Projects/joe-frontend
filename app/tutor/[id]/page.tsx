"use client";

import React, { useEffect, useState } from "react";
import TutorProfileHeader from "@/components/tutor-components/TutorProfileHeader";
import StudentAcceptanceStatus from "@/components/tutor-components/StudentAcceptanceStatus";
import AboutSection from "@/components/tutor-components/AboutSection";
import SubjectsAvailabilityCard from "@/components/tutor-components/SubjectsAvailabilityCard";
import ProfileAnalyticsCard from "@/components/tutor-components/ProfileAnalyticsCard";

interface TutorProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: TutorProfilePageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    // Resolve the params promise
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      console.log("Currently viewing tutor profile for ID:", id);
    }
  }, [id]);

  // Show loading while params are being resolved
  if (!id) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen pt-15 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading tutor profile...</p>
        </div>
      </div>
    );
  }

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
