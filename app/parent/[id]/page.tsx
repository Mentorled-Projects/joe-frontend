"use client";

import React, { useEffect, useState } from "react";
import ParentProfileHeader from "@/components/parent-components/ParentProfileHeader";
import ParentProgressCard from "@/components/parent-components/ParentProgressCard";
import ParentChildrenCard from "@/components/parent-components/ParentChildrenCard";
import ParentActivityOverview from "@/components/parent-components/ParentActivityOverview";
import { useParentStore } from "@/stores/useParentStores";

interface ParentProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ParentProfilePage({ params }: ParentProfilePageProps) {
  const { profile, isProfileCompleted } = useParentStore();
  const [profileReady, setProfileReady] = useState(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      console.log("Currently viewing profile for Parent ID:", id);

      if (isProfileCompleted()) {
        setProfileReady(true);
      } else {
        setProfileReady(false);
      }
    }
  }, [profile, isProfileCompleted, id]);

  if (!id) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen pt-15 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pt-15">
      <ParentProfileHeader parentId={id} />
      <div className="container mx-auto px-4 py-6">
        {profileReady ? (
          <>
            <ParentChildrenCard parentId={id} />
            <ParentActivityOverview parentId={id} />
          </>
        ) : (
          <ParentProgressCard progressStep={0} />
        )}
      </div>
    </div>
  );
}
