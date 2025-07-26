import type { Metadata } from "next";
import React from "react";

interface ParentIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

interface GenerateMetadataProps {
  params: Promise<{
    id: string;
  }>;
}

interface ParentData {
  id: string;
  name: string;
  email: string;
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let parentName = `Parent ${id}`;

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
      console.error(
        "NEXT_PUBLIC_API_URL is not defined in environment variables for generateMetadata."
      );
      return { title: `Parent Profile: ${id}` };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/guardian/get-by-id/${id}`
    );

    if (response.ok) {
      const parentData: ParentData = await response.json();
      parentName = parentData.name || `Parent ${id}`;
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
    title: `${parentName}'s Profile`,
    description: `Detailed profile and activities for ${parentName} (ID: ${id}).`,
    openGraph: {
      title: `${parentName}'s Profile`,
      description: `View the comprehensive profile of ${parentName} (ID: ${id}).`,
      url: `/parent/${id}`,
      siteName: "Your App Name",
      images: [
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

export default async function ParentIdLayout({
  children,
  params,
}: ParentIdLayoutProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  console.log("ParentIdLayout rendered for ID:", id);

  return <>{children}</>;
}
