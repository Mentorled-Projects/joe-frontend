"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import { useParentStore } from "@/stores/useParentStores"; // To get parent token
import { useChildStore } from "@/stores/useChildStores"; // To set the active child profile

// Define the structure of child data expected from the API
interface ChildData {
  _id: string;
  firstName: string;
  lastName: string;
  age: number; // Assuming age is returned
  Class: string; // Assuming Class is returned (e.g., "Year 3", "Primary 5")
  image?: string; // Optional: Child's avatar URL
}

export default function ParentChildrenCard() {
  const router = useRouter();
  const { token: parentToken } = useParentStore(); // Get the parent's authentication token
  const { setChildProfile } = useChildStore(); // Action to set the active child in the child store

  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!parentToken) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Ensure NEXT_PUBLIC_API_URL is defined in your .env.local file
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        const res = await fetch(
          `${API_BASE_URL}/api/v1/child/get-all-children`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${parentToken}`, // Include the authentication token
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Assuming the API returns an object with a 'children' array property
          if (data && Array.isArray(data.children)) {
            setChildren(data.children);
          } else {
            setChildren([]); // If no children or unexpected format, set to empty array
          }
        } else {
          // Handle API errors (e.g., 401 Unauthorized, 500 Internal Server Error)
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch children.");
        }
      } catch (err: unknown) {
        console.error("Error fetching children:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load children."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [parentToken]); // Re-run effect if parentToken changes

  const handleAddAnotherChild = () => {
    router.push("/child/add-child-profile"); // Navigate to the add child profile page
  };

  const handleChildCardClick = (child: ChildData) => {
    // When a child card is clicked, set that child as the active profile in the child store
    setChildProfile({
      firstName: child.firstName,
      lastName: child.lastName,
      // Map other relevant properties from ChildData to ChildProfile here
      // Ensure your ChildProfile interface in useChildStores.ts matches these properties
      image: child.image,
      Class: child.Class,
      age: child.age,
    });
    // Navigate to the child's dedicated profile page
    router.push(`/child/${child._id}/home`); // Assuming the child's main page is /child/:id/home
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Children</h2>
        <button
          onClick={handleAddAnotherChild}
          className="flex items-center px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200"
        >
          <IoMdAdd size={20} className="mr-1" /> Add Another Child
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading children...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && children.length === 0 && (
        <p className="text-center text-gray-500">
          No children added yet. Click &quot;Add Another Child&quot; to get
          started!
        </p>
      )}

      {!loading && !error && children.length > 0 && (
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {" "}
          {/* scrollbar-hide is a Tailwind class, might need custom CSS */}
          {children.map((child) => (
            <div
              key={child._id}
              className="flex-none w-64 bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => handleChildCardClick(child)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl flex-shrink-0">
                  {child.image ? (
                    <Image
                      src={child.image}
                      alt={child.firstName}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized // Use unoptimized for external images if not using Next.js Image optimization
                    />
                  ) : (
                    // Fallback to initial if no image
                    child.firstName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {child.firstName} {child.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Age {child.age} • Grade {child.Class}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                    Profile URL
                  </span>
                  {/* Profile URL Toggle - Placeholder for future functionality */}
                  <label
                    htmlFor={`profile-toggle-${child._id}`}
                    className="flex items-center cursor-pointer"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`profile-toggle-${child._id}`}
                        className="sr-only"
                      />
                      <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Turning this off makes your child&apos;s profile private.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
