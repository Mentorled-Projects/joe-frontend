"use client";

import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useChildStore } from "@/stores/useChildStores";
import { useParentStore } from "@/stores/useParentStores"; // Import useParentStore to get token and childId

export default function ChildAbout() {
  const { childProfile, setChildProfile } = useChildStore();
  const { profile, token } = useParentStore(); // Get parent profile and token
  const [showModal, setShowModal] = useState(false);
  const [about, setAbout] = useState("");
  const [saving, setSaving] = useState(false); // State for saving/loading status

  useEffect(() => {
    // Initialize 'about' state with the value from childProfile when component mounts or childProfile changes
    if (childProfile?.about) {
      setAbout(childProfile.about);
    } else {
      setAbout(""); // Ensure it's empty if no 'about' exists
    }
  }, [childProfile.about]);

  const saveAbout = async () => {
    if (!about.trim()) {
      alert("About section cannot be empty.");
      return;
    }

    if (!profile.childId) {
      alert("Child ID not found. Cannot update about section.");
      return;
    }
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    setSaving(true); // Start saving
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const res = await fetch(
        `${API_BASE_URL}/api/v1/child/${profile.childId}/about`,
        {
          method: "PATCH", // Use PATCH method as per API documentation
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ about }), // Send 'about' in the request body
        }
      );

      if (res.ok) {
        // Update local state only after successful API call
        setChildProfile({ about });
        alert("About section updated successfully!");
        setShowModal(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update about section.");
      }
    } catch (err: unknown) {
      console.error("Failed to save about section:", err);
      if (err instanceof Error) {
        alert(
          `Error saving about section: ${err.message || "Please try again."}`
        );
      } else {
        alert("Error saving about section: Please try again.");
      }
    } finally {
      setSaving(false); // End saving
    }
  };

  return (
    <>
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow border border-gray-200 px-4 sm:px-6 md:px-8 py-4 sm:py-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            About
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-500 hover:text-black transition"
            title="Edit About"
          >
            <MdEdit size={20} />
          </button>
        </div>

        <p className="mt-3 text-gray-800 text-sm sm:text-base whitespace-pre-line leading-relaxed">
          {childProfile.about || "Tell us about yourself"}
        </p>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-4 sm:p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit About</h2>

            <textarea
              placeholder="Tell us about yourself"
              className="w-full h-40 sm:h-48 p-3 sm:p-4 border rounded-lg bg-[#f8f5ff] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
                disabled={saving} // Disable while saving
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={saveAbout}
                disabled={!about.trim() || saving} // Disable if empty or saving
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
