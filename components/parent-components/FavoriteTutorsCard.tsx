"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParentStore } from "@/stores/useParentStores";

// Define the props interface for FavoriteTutorsCard
interface FavoriteTutorsCardProps {
  parentId: string;
}

interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  subject: string;
  avatarUrl?: string;
}

export default function FavoriteTutorsCard({
  parentId,
}: FavoriteTutorsCardProps) {
  const { token, profile, _hasHydrated } = useParentStore();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("FavoriteTutorsCard mounted for Parent ID:", parentId);

    const fetchTutors = async () => {
      if (!_hasHydrated || !token) {
        if (_hasHydrated && !token) {
          setError("Authentication token not found. Please log in again.");
        } else if (!_hasHydrated) {
          setLoading(true);
          return;
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/tutor/get-all-tutors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.tutors)) {
            const favoriteTutorIds = profile.favoriteTutorIds || [];
            const filteredTutors = data.tutors.filter((tutor: Tutor) =>
              favoriteTutorIds.includes(tutor._id)
            );
            setTutors(filteredTutors);
          } else {
            setTutors([]);
          }
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch tutors.");
        }
      } catch (err: unknown) {
        console.error("Error fetching tutors:", err);
        setError(err instanceof Error ? err.message : "Failed to load tutors.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [token, profile.favoriteTutorIds, _hasHydrated, parentId]);

  if (!_hasHydrated) {
    return <p className="text-center text-gray-500">Loading user session...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-[250px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Favorite Tutors
      </h2>
      {loading && (
        <p className="text-center text-gray-500">Loading favorite tutors...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && tutors.length === 0 && (
        <p className="text-center text-gray-500">
          No favorite tutors added yet.
        </p>
      )}
      {!loading && !error && tutors.length > 0 && (
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={tutor.avatarUrl || "/assets/images/avatar3.png"}
                  alt={`${tutor.firstName} ${tutor.lastName}`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {tutor.firstName} {tutor.lastName}
                </p>
                <p className="text-sm text-gray-600">{tutor.subject}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
