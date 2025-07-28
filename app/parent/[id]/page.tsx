"use client";

import React, { useEffect, useState } from "react";
import ParentProfileHeader from "@/components/parent-components/ParentProfileHeader";
import ParentProgressCard from "@/components/parent-components/ParentProgressCard";
import ParentChildrenCard from "@/components/parent-components/ParentChildrenCard";
import ParentActivityOverview from "@/components/parent-components/ParentActivityOverview";
import { useParentStore } from "@/stores/useParentStores";
import { useParams } from "next/navigation";

export default function ParentProfilePage() {
  const params = useParams();
  const id = params?.id;

  const { profile, isProfileCompleted } = useParentStore();
  const [profileReady, setProfileReady] = useState(false);

  // Type guard to ensure id is a string
  const parentId = typeof id === "string" ? id : "";

  useEffect(() => {
    console.log("Currently viewing profile for Parent ID:", parentId);

    if (isProfileCompleted()) {
      setProfileReady(true);
    } else {
      setProfileReady(false);
    }
  }, [profile, isProfileCompleted, parentId]);

  // Early return if no valid parent ID
  if (!parentId) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen pt-15 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Parent ID
          </h1>
          <p className="text-gray-600">
            Please provide a valid parent ID to view the profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-15">
      <ParentProfileHeader parentId={parentId} />
      <div className="container mx-auto px-4 py-6">
        {profileReady ? (
          <>
            <ParentChildrenCard parentId={parentId} />
            <ParentActivityOverview parentId={parentId} />
          </>
        ) : (
          <ParentProgressCard progressStep={0} />
        )}
      </div>
    </div>
  );
}
