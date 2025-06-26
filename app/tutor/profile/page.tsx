"use client";

import React from "react";
import TutorProfileHeader from "@/components/tutor-components/TutorProfileHeader";
import StudentAcceptanceStatus from "@/components/tutor-components/StudentAcceptanceStatus";
import AboutSection from "@/components/tutor-components/AboutSection";

export default function ProfilePage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <TutorProfileHeader />
      <StudentAcceptanceStatus />
      <AboutSection />
    </div>
  );
}
