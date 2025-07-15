"use client";

import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { useChildStore } from "@/stores/useChildStores";
import { useParentStore } from "@/stores/useParentStores";
import { uploadFile } from "@/stores/uploadService";
import Image from "next/image";

export default function ChildMilestones() {
  const { childProfile, setChildProfile } = useChildStore();
  const { profile } = useParentStore();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [uploading, setUploading] = useState(false);

  const deleteMilestone = (idx: number) => {
    const filtered = childProfile.milestones.filter((_, i) => i !== idx);
    setChildProfile({ milestones: filtered });
  };

  const handleAddMilestone = async () => {
    if (!file || !profile?.phoneNumber) {
      alert("Missing file or phone number.");
      return;
    }

    try {
      setUploading(true);
      const response = await uploadFile(file, profile.phoneNumber);
      const fileUrl = response?.url || response;

      const newMilestone = { title, date, file: fileUrl };

      setChildProfile({
        milestones: [...childProfile.milestones, newMilestone],
      });

      setShowModal(false);
      setTitle("");
      setDate("");
      setFile(null);
    } catch (err) {
      console.error("File upload failed:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-lg shadow border border-gray-200 px-8 py-6 mb-4">
      {/* header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Milestones</h2>
          {!childProfile.milestones.length && (
            <p className="text-sm text-gray-500 mt-2">
              No achievements added yet
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} title="Add Milestone">
            <IoMdAdd size={22} className="text-gray-600 hover:text-black" />
          </button>
          {/* existing edit icon (future) */}
          <button onClick={() => setShowModal(true)} title="Edit Milestones">
            <MdEdit size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* cards */}
      {childProfile.milestones.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(showAll
            ? childProfile.milestones
            : childProfile.milestones.slice(0, 3)
          ).map((m, i) => (
            <div
              key={i}
              className="relative bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              {/* delete icon */}
              <button
                onClick={() => deleteMilestone(i)}
                title="Delete"
                className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full p-1"
              >
                <FiTrash size={16} className="text-red-600" />
              </button>

              <Image
                src={m.file ?? "/placeholder.png"}
                alt={m.title}
                width={400}
                height={192}
                className="object-cover w-full h-48"
                style={{ width: "100%", height: "12rem", objectFit: "cover" }}
                unoptimized
              />

              <div className="p-4">
                <h3 className="font-semibold text-sm">
                  {m.title || "Untitled"}
                </h3>
                <p className="text-xs text-gray-600">
                  {m.date || "No date specified"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* show-all toggle */}
      {childProfile.milestones.length > 3 && (
        <div
          className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Hide" : `Show all (${childProfile.milestones.length})`}{" "}
          <FaArrowRight className="mt-0.5" />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Add Milestone</h2>

            <input
              type="text"
              placeholder="e.g., Won a Reading Contest"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />

            <label className="w-full mb-7 p-2 border rounded-lg text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700">
              {file ? file.name : "Choose image file 📁"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleAddMilestone}
                disabled={!title.trim() || !date || !file || uploading}
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
