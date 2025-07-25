// This is a Server Component by default, so DO NOT add "use client";

import type { Metadata } from "next";
import React from "react";

interface ParentIdLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

interface ParentData {
  id: string;
  name: string;
  email: string;
}

export async function generateMetadata({
  params,
}: ParentIdLayoutProps): Promise<Metadata> {
  const { id } = params;

  let parentName = `Parent ${id}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/guardian/get-by-id/${id}`
    );

    if (response.ok) {
      const parentData: ParentData = await response.json();
      parentName = parentData.name || `Parent ${id}`;
    } else {
      console.error(
        `Failed to fetch parent data for ID ${id}: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error fetching parent data for ID ${id}:`, error);
  }

  return {
    title: `${parentName}'s Profile`,
    description: `Detailed profile and activities for ${parentName} (ID: ${id}).`,

    openGraph: {
      title: `${parentName}'s Profile`,
      description: `View the comprehensive profile of ${parentName} (ID: ${id}).`,
      url: `/parent/${id}`,
      siteName: "Your App Name",
      images: [
        // Example: You might generate an image based on the parent's profile
        // {
        //   url: `/api/og?title=${encodeURIComponent(`${parentName}'s Profile`)}`,
        //   width: 1200,
        //   height: 630,
        //   alt: `${parentName}'s Profile`,
        // },
        "https://placehold.co/1200x630/cccccc/333333?text=Parent+Profile",
      ],
      type: "profile",
    },

    keywords: [
      `${parentName}`,
      `parent ${id}`,
      "tutor app",
      "education",
      "profile",
    ],
  };
}

export default function ParentIdLayout({ children }: ParentIdLayoutProps) {
  return <>{children}</>;
}
