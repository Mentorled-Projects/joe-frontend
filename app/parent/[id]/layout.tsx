// app/parent/[id]/layout.tsx

import type { Metadata } from "next";
import React from "react";

interface ParentIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string; // The dynamic 'id' from the URL (e.g., /parent/123 -> id is '123')
  }>;
}

// Define the props interface SPECIFICALLY for generateMetadata
interface GenerateMetadataProps {
  params: Promise<{
    id: string;
  }>;
}

// Define the expected structure of the API response for parent data
interface ParentData {
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
  const { id } = await params; // Await params before destructuring

  const defaultTitle = `Parent Profile`;
  const defaultDescription = `View parent profile and activities.`;

  let parentName = `Parent Profile`;

  try {
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (API_BASE_URL) {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/guardian/get-by-id/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },

          cache: "no-store",
        }
      );

      console.log("response from layout:", response);

      if (response.ok) {
        const parentData: ParentData = await response.json();
        parentName = parentData.name
          ? `${parentData.name}'s Profile`
          : defaultTitle;
      } else {
        // Log for debugging but don't throw
        console.log(
          `API returned ${response.status} for parent ${id} in generateMetadata. Using default metadata.`
        );
      }
    }
  } catch (error) {
    // Log for debugging but don't throw - this is expected for authenticated endpoints
    console.log(
      `Could not fetch parent data for metadata (expected for authenticated endpoints):`,
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  return {
    title: parentName,
    description: defaultDescription,
    openGraph: {
      title: parentName,
      description: defaultDescription,
      url: `/parent/${id}`,
      siteName: "Your App Name",
      images: [
        {
          url: "https://placehold.co/1200x630/cccccc/333333?text=Parent+Profile",
          width: 1200,
          height: 630,
          alt: "Parent Profile",
        },
      ],
      type: "profile",
    },
    keywords: ["parent profile", "tutor app", "education", "profile"],
  };
}

// This layout component will wrap your app/parent/[id]/page.tsx
export default async function ParentIdLayout({
  children,
  params,
}: ParentIdLayoutProps) {
  // Await params before accessing its properties
  const { id } = await params;

  console.log("ParentIdLayout rendered for ID:", id);

  return <>{children}</>;
}
