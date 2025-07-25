// app/parent/[id]/layout.tsx
// This is a Server Component by default, so DO NOT add "use client";

import type { Metadata } from "next";
import React from "react";

// Define the props interface for the LAYOUT COMPONENT itself
interface ParentIdLayoutProps {
  children: React.ReactNode;
  params: {
    id: string; // The dynamic 'id' from the URL (e.g., /parent/123 -> id is '123')
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Add if your layout component uses search params
}

// Define the props interface SPECIFICALLY for generateMetadata
// This ensures the arguments match Next.js's expected type for metadata functions.
interface GenerateMetadataProps {
  params: {
    id: string;
  };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Add if generateMetadata uses search params
}

// Define the expected structure of the API response for parent data
interface ParentData {
  id: string;
  name: string;
  email: string;
  // Add other properties if your API returns them
}

// generateMetadata is a Server Component function that runs on the server
export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = params;

  let parentName = `Parent ${id}`; // Default name if fetching fails or name is not found

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Use NEXT_PUBLIC_API_URL as per your .env
    if (!API_BASE_URL) {
      console.error(
        "NEXT_PUBLIC_API_URL is not defined in environment variables for generateMetadata."
      );
      return { title: `Parent Profile: ${id}` }; // Fallback title
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/guardian/get-by-id/${id}`
    );

    if (response.ok) {
      const parentData: ParentData = await response.json();
      parentName = parentData.name || `Parent ${id}`; // Use the fetched name, or fallback
    } else {
      console.error(
        `Failed to fetch parent data for ID ${id} in generateMetadata: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(
      `Error fetching parent data for ID ${id} in generateMetadata:`,
      error
    );
  }

  return {
    title: `${parentName}'s Profile`, // Dynamically set the page title using the fetched name
    description: `Detailed profile and activities for ${parentName} (ID: ${id}).`,
    // You can add more dynamic metadata here, like Open Graph tags for social sharing
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
        "https://placehold.co/1200x630/cccccc/333333?text=Parent+Profile", // Placeholder image
      ],
      type: "profile", // Or 'website' depending on context
    },
    // Other SEO tags can go here
    keywords: [
      `${parentName}`,
      `parent ${id}`,
      "tutor app",
      "education",
      "profile",
    ],
  };
}

// This layout component will wrap your app/parent/[id]/page.tsx
export default function ParentIdLayout({
  children,
  params,
}: ParentIdLayoutProps) {
  // Acknowledge params to satisfy ESLint, as it's part of the component's props
  // This can be useful for debugging or if you later decide to use params directly in the layout's JSX.
  console.log("ParentIdLayout rendered for ID:", params.id);

  return <>{children}</>;
}
