"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ParentHeader from "@/components/parent-components/ParentHeader";
import TutorCard from "@/components/parent-components/TutorCard";
import ReviewsModal from "@/components/parent-components/ReviewsModal";
import ScheduleModal from "@/components/parent-components/ScheduleModal";
import SuccessModal from "@/components/parent-components/SuccessModal";
import { Tutor } from "@/types/Tutor";
import mockTutorApi from "@/lib/mockTutorApi";
import { useParentStore } from "@/stores/useParentStores";
import { IoArrowBackOutline } from "react-icons/io5";

export default function SingleTutorProfilePage() {
  const { tutorId } = useParams();
  const router = useRouter();
  const { token } = useParentStore();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [similarTutors, setSimilarTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      if (!tutorId) {
        setError("Tutor ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedTutor = await mockTutorApi.getTutorById(tutorId as string);
        if (fetchedTutor) {
          setTutor(fetchedTutor);

          const fetchedSimilarTutors = await mockTutorApi.getSimilarTutors(
            tutorId as string
          );
          setSimilarTutors(fetchedSimilarTutors);
        } else {
          setError("Tutor not found.");
        }

        // --- Real API Call (uncomment and replace mock when backend is ready) ---
        /*
        if (!token) {
          setError("Authentication token not found. Please log in.");
          setLoading(false);
          return;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined.");
        }
        const res = await fetch(`${API_BASE_URL}/api/v1/tutor/get-by-id/${tutorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTutor(data.tutor); // Assuming API returns { tutor: {...} }
          // You would also fetch similar tutors from your backend here if available
          // For now, using mock similar tutors
          const fetchedSimilarTutors = await mockTutorApi.getSimilarTutors(tutorId as string);
          setSimilarTutors(fetchedSimilarTutors);

        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch tutor details.");
        }
        */
      } catch (err: unknown) {
        console.error("Error fetching tutor:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to load tutor profile.");
        } else {
          setError("Failed to load tutor profile.");
        }
      } finally {
        setLoading(false);

        window.scrollTo(0, 0);
      }
    };

    fetchTutorDetails();
  }, [tutorId, token]);

  const handleGoBack = () => {
    router.push("/parent/HireTutor");
  };

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push("/parent/HireTutor");
    }, 2000);
  };

  const handleMessageTutor = () => {
    if (tutor?._id) {
      router.push(`/parent/messages/${tutor._id}`);
    } else {
      console.warn("Tutor ID not available for messaging.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
        <ParentHeader />
        <p className="text-lg text-gray-600 mt-20">Loading tutor profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
        <ParentHeader />
        <p className="text-lg text-red-500 mt-20">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff]"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
        <ParentHeader />
        <p className="text-lg text-gray-600 mt-20">Tutor not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <ParentHeader />
      <main className="flex-1 pt-14 px-4 py-8 max-w-5xl mx-auto w-full">
        <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-48 w-full bg-gray-200">
            <Image
              src="/assets/images/teacher-banner.svg"
              alt="Tutor Banner"
              fill
              className="object-cover"
              unoptimized
            />

            <button
              onClick={handleGoBack}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors duration-200"
              aria-label="Go back to tutor list"
            >
              <IoArrowBackOutline size={24} className="text-gray-700" />
            </button>

            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={
                    tutor.avatar ||
                    "https://placehold.co/128x128/E0E0E0/666666?text=AV"
                  }
                  alt={`${tutor.firstName} ${tutor.lastName}`}
                  width={128}
                  height={128}
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {tutor.firstName} {tutor.lastName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {tutor.subjects?.map((s) => s.name).join(", ") ||
                "No subjects listed"}
            </p>
            <div className="flex items-center text-yellow-500 text-sm mt-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span>{tutor.rating?.toFixed(1) || "N/A"}</span>
              <span className="text-gray-500 ml-2">
                ({tutor.reviewsCount || 0} reviews)
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-800 mt-3">
              {tutor.hourlyRate
                ? `$${tutor.hourlyRate.min}-${tutor.hourlyRate.max}/hr`
                : "Rate N/A"}
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About {tutor.firstName}
          </h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {tutor.about || "No 'About' section provided yet."}
          </p>
          {/* Reviews Button */}
          <button
            onClick={() => setShowReviewsModal(true)}
            className="mt-4 px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Reviews
          </button>
        </section>

        {/* Availability & Message/Schedule Buttons */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Availability
          </h2>
          {tutor.availability && tutor.availability.length > 0 ? (
            <div className="space-y-2">
              {tutor.availability.map((slot, index) => (
                <p key={index} className="text-gray-700">
                  <span className="font-medium">{slot.day}:</span>{" "}
                  {slot.startTime} - {slot.endTime}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Availability not specified.</p>
          )}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleMessageTutor} // Updated onClick
              className="px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 text-sm font-medium" // Adjusted size
            >
              Message Tutor
            </button>
            {/* Schedule Button */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-2 border border-[#2F5FFF] text-[#2F5FFF] rounded-md hover:bg-[#e0e7ff] transition-colors duration-200 text-sm font-medium" // Adjusted size
            >
              Schedule
            </button>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h2>
          {tutor.subjects && tutor.subjects.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tutor.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {subject.name} ({subject.level})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No subjects listed.</p>
          )}
        </section>

        {/* Certifications Section */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Certifications
          </h2>
          {tutor.certifications && tutor.certifications.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tutor.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No certifications listed.</p>
          )}
        </section>

        {/* Similar Tutors Section */}
        {similarTutors.length > 0 && (
          <section className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Similar Tutors You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarTutors.map((simTutor) => (
                <TutorCard key={simTutor._id} tutor={simTutor} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      {showReviewsModal && (
        <ReviewsModal
          onClose={() => setShowReviewsModal(false)}
          tutorName={tutor.firstName}
          tutorId={tutor._id}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          tutorName={tutor.firstName}
          onScheduleSuccess={handleScheduleSuccess}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          message="Session Scheduled!"
        />
      )}
    </div>
  );
}
