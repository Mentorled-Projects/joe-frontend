// app/parent/[id]/layout.tsx

import type { Metadata } from "next";
import React from "react";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params; // Await the params Promise
  const id = resolvedParams.id;

  console.log("Layout loaded for Parent ID:", id);

  return <>{children}</>;
}

// generateMetadata function using normal (non-promise) params
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  let parentName = `Parent ${id}`;

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined.");
      return { title: `Parent Profile: ${id}` };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/guardian/get-by-id/${id}`
    );

    if (response.ok) {
      const data = await response.json();
      parentName = data.name || `Parent ${id}`;
    } else {
      console.error(`Failed to fetch data for ID ${id}: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in generateMetadata:", error);
  }

  return {
    title: `${parentName}'s Profile`,
    description: `View ${parentName}'s full profile.`,
  };
}
