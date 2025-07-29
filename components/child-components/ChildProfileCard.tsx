"use client";

import Image from "next/image";
import { useChildStore } from "@/stores/useChildStores";
import { useState, useEffect } from "react";

export default function ChildProfileCard() {
  const { childProfile } = useChildStore();

  const [childAvatar, setChildAvatar] = useState("/assets/images/kiddp.svg");
  const [childBanner, setChildBanner] = useState(
    "/assets/images/child-banner.jpg"
  );

  useEffect(() => {
    const storedAvatar = localStorage.getItem("childAvatar");
    const storedBanner = localStorage.getItem("childBanner");

    if (storedAvatar) setChildAvatar(storedAvatar);
    if (storedBanner) setChildBanner(storedBanner);
  }, []);

  const childName = `${childProfile.firstName || "Child"} ${
    childProfile.lastName || "Name"
  }`;

  const childDescriptionParts = [
    childProfile.favoriteSubjects,
    Array.isArray(childProfile.interests)
      ? childProfile.interests.join(", ")
      : childProfile.interests,
    childProfile.sports,
  ].filter(Boolean);

  const childDescription =
    childDescriptionParts.length > 0
      ? childDescriptionParts.join(" | ")
      : "Young Explorer";

  const childLocation =
    childProfile.city && childProfile.country
      ? `${childProfile.city}, ${childProfile.country}`
      : "Location not specified";
  const childYear = childProfile.Class ? `Year ${childProfile.Class}` : "";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Banner Image */}
      <div className="relative h-32 rounded-lg overflow-hidden">
        <Image
          src={childBanner}
          alt="Child Banner"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
          unoptimized
        />
      </div>

      {/* Profile Picture */}
      <div className="relative -mt-16 flex justify-start">
        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-300 flex items-center justify-center ml-4">
          <Image
            src={childAvatar}
            alt="Child Profile"
            width={112}
            height={112}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
      </div>

      {/* Child Info */}
      <div className="mt-4 px-4 pb-4">
        <h1 className="text-xl font-semibold text-gray-800">{childName}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {childDescription} {childYear && `| ${childYear}`}
        </p>
        <p className="text-sm text-gray-500 mt-1">{childLocation}</p>
      </div>
    </div>
  );
}
