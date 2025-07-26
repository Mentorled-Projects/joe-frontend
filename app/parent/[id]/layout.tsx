import type { Metadata } from "next";
import React from "react";

type LayoutProps = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export default async function ParentIdLayout({
  params,
  children,
}: LayoutProps) {
  // Await the params to get the actual object
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // You can use the id here for any layout-specific logic if needed
  console.log("Parent ID:", id);

  return <>{children}</>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // Await the params to get the actual object
  const resolvedParams = await params;
  const { id } = resolvedParams;

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
