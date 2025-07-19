"use client";

import React, { useEffect, useState } from "react";
import ParentProfileHeader from "@/components/parent-components/ParentProfileHeader";
import ParentProgressCard from "@/components/parent-components/ParentProgressCard";
import ParentChildrenCard from "@/components/parent-components/ParentChildrenCard";
import ParentActivityOverview from "@/components/parent-components/ParentActivityOverview";
import { useParentStore } from "@/stores/useParentStores";

export default function ParentProfilePage() {
  const { profile, isProfileCompleted } = useParentStore();
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    if (isProfileCompleted()) {
      setProfileReady(true);
    } else {
      setProfileReady(false);
    }
  }, [profile, isProfileCompleted]);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-15">
      <ParentProfileHeader />
      <div className="container mx-auto px-4 py-6">
        {profileReady ? (
          <>
            <ParentChildrenCard />
            <ParentActivityOverview />
          </>
        ) : (
          <ParentProgressCard progressStep={0} />
        )}
      </div>
    </div>
  );
}
