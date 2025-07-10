"use client";

import { useState } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useChildStore } from "@/stores/useChildStores";

const interestOptions = [
  "🎨 Art",
  "🤖 Coding",
  "⚽ Soccer",
  "🎵 Music",
  "📚 Reading",
  "🧩 Puzzles",
  "📷 Photography",
  "🎮 Gaming",
  "🧁 Baking",
];

export default function ChildInterests() {
  const { childProfile, setChildProfile } = useChildStore();

  /* ---------- modal state ---------- */
  const [showModal, setShowModal] = useState(false);

  const [selected, setSelected] = useState<string[]>(
    Array.isArray(childProfile.interests) ? childProfile.interests : []
  );

  const openModal = () => {
    setSelected(
      Array.isArray(childProfile.interests) ? childProfile.interests : []
    );
    setShowModal(true);
  };

  const toggleInterest = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const saveInterests = () => {
    setChildProfile({ interests: selected });
    setShowModal(false);
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-lg shadow border border-gray-200 px-6 py-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold">Interest &amp; Hobbies</h2>

        <div className="flex gap-4">
          <button onClick={openModal} title="Add Interest">
            <IoMdAdd size={22} className="text-gray-600 hover:text-black" />
          </button>
          <button onClick={openModal} title="Edit Interests">
            <MdEdit size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3">
        {(Array.isArray(childProfile.interests)
          ? childProfile.interests
          : []
        ).map((item, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full bg-gray-50"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* close */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Select Interests</h2>

            {/* checkbox grid */}
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                    selected.includes(item) ? "bg-blue-50 border-blue-400" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => toggleInterest(item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* actions */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={saveInterests}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
