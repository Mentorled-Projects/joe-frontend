// This is a Server Component by default, so DO NOT add "use client";

import type { Metadata } from "next";
import React from "react";

// Define the props interface for this layout
interface TutorIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string; // The dynamic 'id' from the URL (e.g., /tutor/123 -> id is '123')
  }>;
}

// Define the props interface for generateMetadata
interface GenerateMetadataProps {
  params: Promise<{
    id: string;
  }>;
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
}: GenerateMetadataProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

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

export default async function TutorIdLayout({
  children,
  params,
}: TutorIdLayoutProps) {
  // Await params to get the actual object
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // You can use the id here for any layout-specific logic if needed
  console.log("TutorIdLayout rendered for ID:", id);

  return <>{children}</>;
}
