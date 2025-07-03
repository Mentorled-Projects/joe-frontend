"use client";

import React from "react";

import ParentProfileHeader from "@/components/parent-components/ParentProfileHeader";
import ParentProgressCard from "@/components/parent-components/ParentProgressCard";

export default function ProfilePage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <ParentProfileHeader />
      <ParentProgressCard progressStep={1} />
    </div>
  );
}
