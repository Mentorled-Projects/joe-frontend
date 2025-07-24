"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import ParentHeader from "@/components/parent-components/ParentHeader";
import TutorCard from "@/components/parent-components/TutorCard";
import { Tutor } from "@/types/Tutor"; // Import the Tutor interface
// import { useParentStore } from "@/stores/useParentStores";

export default function HireTutorPage() {
  // const { token } = useParentStore();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockTutors: Tutor[] = useMemo(
    () => [
      {
        _id: "tutor1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=SJ",
        hourlyRate: { min: 35, max: 45 },
        rating: 4.9,
        subjects: [{ name: "Mathematics", level: "All levels" }],
        location: "New York, USA",
        about: "Experienced math tutor...",
        certifications: ["Licensed Mathematics Teacher"],
        availability: [],
      },
      {
        _id: "tutor2",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.c@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=MC",
        hourlyRate: { min: 40, max: 50 },
        rating: 4.7,
        subjects: [{ name: "Physics", level: "Chemistry" }],
        location: "Los Angeles, USA",
        about: "Physics and Chemistry expert...",
        certifications: ["PhD in Physics"],
        availability: [],
      },
      {
        _id: "tutor3",
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.r@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=ER",
        hourlyRate: { min: 30, max: 40 },
        rating: 4.8,
        subjects: [{ name: "English Literature", level: "English" }],
        location: "Chicago, USA",
        about: "Passionate English tutor...",
        certifications: ["M.Ed. English Education"],
        availability: [],
      },
      {
        _id: "tutor4",
        firstName: "James",
        lastName: "Wilson",
        email: "james.w@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=JW",
        hourlyRate: { min: 35, max: 45 },
        rating: 4.8,
        subjects: [{ name: "History", level: "Social Studies" }],
        location: "Houston, USA",
        about: "History and Social Studies teacher...",
        certifications: ["History Degree"],
        availability: [],
      },
      {
        _id: "tutor5",
        firstName: "Olivia",
        lastName: "Park",
        email: "olivia.p@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=OP",
        hourlyRate: { min: 45, max: 60 },
        rating: 5.0,
        subjects: [{ name: "Computer Science", level: "Coding" }],
        location: "San Francisco, USA",
        about: "Coding and CS enthusiast...",
        certifications: ["Computer Science Degree"],
        availability: [],
      },
      {
        _id: "tutor6",
        firstName: "Daniel",
        lastName: "Thompson",
        email: "daniel.t@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=DT",
        hourlyRate: { min: 40, max: 55 },
        rating: 4.9,
        subjects: [{ name: "Music Theory", level: "Piano" }],
        location: "Miami, USA",
        about: "Music and Piano instructor...",
        certifications: ["Music Conservatory Graduate"],
        availability: [],
      },
      {
        _id: "tutor7",
        firstName: "Sofia",
        lastName: "Martinez",
        email: "sofia.m@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=SM",
        hourlyRate: { min: 30, max: 45 },
        rating: 4.8,
        subjects: [{ name: "Spanish", level: "French" }],
        location: "Phoenix, USA",
        about: "Fluent in Spanish and French...",
        certifications: ["Language Teaching Certificate"],
        availability: [],
      },
      {
        _id: "tutor8",
        firstName: "Ryan",
        lastName: "Anderson",
        email: "ryan.a@example.com",
        avatar: "https://placehold.co/160x160/E0E0E0/666666?text=RA",
        hourlyRate: { min: 35, max: 50 },
        rating: 4.7,
        subjects: [{ name: "Art", level: "Design" }],
        location: "Dallas, USA",
        about: "Creative Art and Design teacher...",
        certifications: ["Fine Arts Degree"],
        availability: [],
      },
    ],
    []
  );

  const [locationFilter, setLocationFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortOption, setSortOption] = useState("Recommended");

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Commented out real API call for now, using mock data
      // if (!token) {
      //   setError("Authentication token not found. Please log in.");
      //   setLoading(false);
      //   return;
      // }
      // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      // if (!API_BASE_URL) {
      //   throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      // }
      // const res = await fetch(`${API_BASE_URL}/api/v1/tutor/get-all-tutors`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData.message || "Failed to fetch tutors.");
      // }
      // const data = await res.json();
      // setTutors(data.tutors || []); // Assuming response has a 'tutors' array

      setTutors(mockTutors);
    } catch (err: unknown) {
      console.error("Error fetching tutors:", err);
      let errorMessage = "Failed to load tutors.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mockTutors]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const filteredTutors = tutors
    .filter((tutor) => {
      const matchesLocation = locationFilter
        ? tutor.location?.toLowerCase().includes(locationFilter.toLowerCase())
        : true;
      const matchesSubject =
        subjectFilter === "All Subjects"
          ? true
          : tutor.subjects?.some((s) =>
              s.name.toLowerCase().includes(subjectFilter.toLowerCase())
            );
      const matchesPrice = tutor.hourlyRate
        ? tutor.hourlyRate.min >= minPrice && tutor.hourlyRate.max <= maxPrice
        : true;
      return matchesLocation && matchesSubject && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "Recommended") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <ParentHeader />
      <main className="flex-1 pt-14 px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Filters Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Enter your location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>English Literature</option>
                <option>History</option>
                <option>Computer Science</option>
                <option>Music Theory</option>
                <option>Spanish</option>
                <option>Art</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">$</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span className="text-gray-700">-</span>
                <span className="text-gray-700">$</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            {/* More Filters button could go here */}
          </div>
        </section>

        {/* Your Favorites Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex justify-between items-center">
            Your Favorites
            {/* <button className="text-sm text-[#2F5FFF] hover:underline">
              Hide
            </button> */}
          </h2>
          <div className="text-center items-center text-gray-500 py-8">
            <Image
              src="/assets/images/Background.svg"
              alt="Favorites"
              width={55}
              height={55}
              className="mx-auto mb-4"
            />
            <p className="mb-2">No favorites yet</p>
            <p className="text-sm">
              Add tutors to your favorites for quick access
            </p>
          </div>
        </section>

        {/* Top Rated Tutors Section */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Top Rated Tutors Near You
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option>Recommended</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
              </select>
            </div>
          </div>

          {loading && (
            <p className="text-center text-gray-500 py-10">Loading tutors...</p>
          )}
          {error && <p className="text-center text-red-500 py-10">{error}</p>}
          {!loading && !error && filteredTutors.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No tutors found matching your criteria.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {!loading &&
              !error &&
              filteredTutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
          </div>

          {!loading && !error && filteredTutors.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                Load More Tutors
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
