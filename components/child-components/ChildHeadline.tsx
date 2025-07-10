"use client";

import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useChildStore } from "@/stores/useChildStores";

export default function ChildHeadline() {
  const { childProfile, setChildProfile } = useChildStore();
  const [showModal, setShowModal] = useState(false);
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    if (childProfile?.headline) {
      setHeadline(childProfile.headline);
    }
  }, [childProfile.headline]);

  const saveHeadline = () => {
    setChildProfile({ headline });
    setShowModal(false);
  };

  return (
    <>
      <section className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Headline</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-gray-500 hover:text-black transition"
            title="Edit Headline"
          >
            <MdEdit size={20} />
          </button>
        </div>
        <p className="mt-2 text-gray-800 text-sm">
          {childProfile.headline || "Tell us about yourself"}
        </p>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Headline</h2>

            <textarea
              placeholder="Tell us about yourself"
              className="w-full h-48 p-4 border rounded-lg bg-[#f8f5ff] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={saveHeadline}
                disabled={!headline.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
