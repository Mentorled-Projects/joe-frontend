// This is a Server Component by default, so DO NOT add "use client";

import type { Metadata } from "next";
import React from "react";

// Define the props interface for this layout
interface TutorIdLayoutProps {
  children: React.ReactNode;
  params: {
    id: string; // The dynamic 'id' from the URL (e.g., /tutor/123 -> id is '123')
  };
}

interface FetchedTutorData {
  id: string;
  name: string;
  email: string;
  city?: string;
  country?: string;
}

// generateMetadata is a Server Component function that runs on the server
export async function generateMetadata({
  params,
}: TutorIdLayoutProps): Promise<Metadata> {
  const { id } = params;

  let tutorName = `Tutor ${id}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/get-by-id/${id}`
    );

    if (response.ok) {
      const tutorData: FetchedTutorData = await response.json();
      tutorName = tutorData.name || `Tutor ${id}`;
    } else {
      console.error(
        `Failed to fetch tutor data for ID ${id}: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error fetching tutor data for ID ${id}:`, error);
  }

  return {
    title: `${tutorName}'s Profile`,
    description: `Detailed profile and services for tutor with ID: ${id}.`,

    openGraph: {
      title: `${tutorName}'s Profile`,
      description: `View the comprehensive profile of tutor ID ${id}.`,
      url: `/tutor/${id}`,
      siteName: "Your App Name",
      images: [
        "https://placehold.co/1200x630/cccccc/333333?text=Tutor+Profile",
      ],
      type: "profile",
    },
    keywords: [`tutor ${id}`, "tutor app", "education", "profile"],
  };
}

export default function TutorIdLayout({ children }: TutorIdLayoutProps) {
  return <>{children}</>;
}
