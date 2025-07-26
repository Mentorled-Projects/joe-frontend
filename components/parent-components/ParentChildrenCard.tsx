"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import { useParentStore } from "@/stores/useParentStores";
import { useChildStore } from "@/stores/useChildStores";

// Define the props interface for ParentChildrenCard
interface ParentChildrenCardProps {
  parentId: string; // The dynamic 'id' of the parent whose profile is being viewed
}

// Define the structure of child data (mock or from store)
interface ChildData {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  Class: string;
  image?: string;
}

// Mock data for children for demo purposes
const mockChildrenData: ChildData[] = [
  {
    _id: "child123",
    firstName: "Alice",
    lastName: "Smith",
    age: 8,
    Class: "3",
    image: "https://placehold.co/48x48/aabbcc/ffffff?text=A", // Placeholder image
  },
  {
    _id: "child456",
    firstName: "Bob",
    lastName: "Johnson",
    age: 10,
    Class: "5",
    image: "https://placehold.co/48x48/ccbbaa/ffffff?text=B", // Placeholder image
  },
  {
    _id: "child789",
    firstName: "Charlie",
    lastName: "Brown",
    age: 6,
    Class: "1",
    image: "https://placehold.co/48x48/bbaacc/ffffff?text=C", // Placeholder image
  },
];

export default function ParentChildrenCard({
  parentId,
}: ParentChildrenCardProps) {
  const router = useRouter();
  // We're commenting out API-related usage of parentToken and _hasHydrated for this demo
  // const { token: parentToken, _hasHydrated } = useParentStore();
  const { setChildProfile, resetChildProfile } = useChildStore();

  const [children, setChildren] = useState<ChildData[]>([]);
  // const [loading, setLoading] = useState(true); // Commented out
  // const [error, setError] = useState<string | null>(null); // Commented out

  useEffect(() => {
    console.log("ParentChildrenCard mounted for Parent ID:", parentId);
    // console.log("Token from store:", parentToken); // Commented out
    // console.log("Token from localStorage:", localStorage.getItem("token")); // Commented out
    // console.log("Has hydrated:", _hasHydrated); // Commented out

    // For demo purposes, load children directly from mock data
    setChildren(mockChildrenData);
    // setLoading(false); // Set loading to false as data is immediately available
    // setError(null); // Clear any errors

    // Commenting out the API fetch logic for the demo
    // const fetchChildren = async () => {
    //   if (!_hasHydrated || !parentToken) {
    //     if (_hasHydrated && !parentToken) {
    //       setError("Authentication token not found. Please log in again.");
    //     } else if (!_hasHydrated) {
    //       setLoading(true);
    //       return;
    //     }
    //     setLoading(false);
    //     return;
    //   }

    //   setLoading(true);
    //   setError(null);

    //   try {
    //     const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    //     if (!API_BASE_URL) {
    //       throw new Error(
    //         "NEXT_PUBLIC_API_URL is not defined in environment variables."
    //       );
    //     }

    //     const res = await fetch(
    //       `${API_BASE_URL}/api/v1/child/get-all-children`,
    //       {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${parentToken}`,
    //         },
    //       }
    //     );

    //     if (res.ok) {
    //       const data = await res.json();
    //       if (data && Array.isArray(data.children)) {
    //         setChildren(data.children);
    //       } else {
    //         setChildren([]);
    //       }
    //     } else {
    //       const errorData = await res.json();
    //       throw new Error(errorData.message || "Failed to fetch children.");
    //     }
    //   } catch (err: unknown) {
    //     console.error("Error fetching children:", err);
    //     setError(
    //       err instanceof Error ? err.message : "Failed to load children."
    //     );
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchChildren(); // Commented out
  }, [parentId]); // parentId remains in dependencies

  const handleAddAnotherChild = () => {
    resetChildProfile();
    router.push("/parent/add-child-profile");
  };

  const handleChildCardClick = (child: ChildData) => {
    setChildProfile({
      firstName: child.firstName,
      lastName: child.lastName,
      image: child.image,
      Class: child.Class,
      age: child.age,
      _id: child._id,
    });

    router.push(`/child/${child._id}/home`);
  };

  // Removed conditional rendering based on _hasHydrated, loading, and error for demo simplicity
  // if (!_hasHydrated) {
  //   return <p className="text-center text-gray-500">Loading user session...</p>;
  // }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 -mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Children</h2>
        <button
          onClick={handleAddAnotherChild}
          className="flex items-center px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200"
        >
          <IoMdAdd size={20} className="mr-1" /> Add Another Child
        </button>
      </div>

      {/* Removed loading and error messages */}
      {/* {loading && (
        <p className="text-center text-gray-500">Loading children...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>} */}

      {children.length === 0 ? ( // Display message if no children (even mock)
        <p className="text-center text-gray-500">
          No children added yet. Click &quot;Add Another Child&quot; to get
          started!
        </p>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
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
                      unoptimized
                    />
                  ) : (
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
