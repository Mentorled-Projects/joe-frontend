"use client";

import React from "react";
import TutorProfileHeader from "@/components/tutor-components/TutorProfileHeader";
import StudentAcceptanceStatus from "@/components/tutor-components/StudentAcceptanceStatus";
import AboutSection from "@/components/tutor-components/AboutSection";

interface TutorProfilePageProps {
  params: {
    id: string;
  };
}

// Modify the default export function to accept the 'params' prop
export default function ProfilePage({ params }: TutorProfilePageProps) {
  const { id } = params;

  console.log("Currently viewing tutor profile for ID:", id);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <TutorProfileHeader tutorId={id} />
      <StudentAcceptanceStatus />
      <AboutSection />
    </div>
  );
}
