"use client";

import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const BIO_KEY = "tutorBio";
const PLACEHOLDER =
  "Passionate mathematics tutor with 5+ years of experience helping students excel in algebra, calculus, and statistics.\nI believe in making complex concepts simple and engaging.";

export default function AboutSection() {
  const [bio, setBio] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  /* load bio on mount */
  useEffect(() => {
    setBio(localStorage.getItem(BIO_KEY) || PLACEHOLDER);
  }, []);

  const save = () => {
    setBio(draft.trim() || PLACEHOLDER);
    localStorage.setItem(BIO_KEY, draft.trim() || PLACEHOLDER);
    setOpen(false);
  };

  return (
    <>
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8 p-8">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">About</h3>
          <button
            onClick={() => {
              setDraft(bio);
              setOpen(true);
            }}
          >
            <MdEdit size={24} />
          </button>
        </div>

        <p className="mt-4 whitespace-pre-line text-gray-800">{bio}</p>
      </section>

      {/* Edit Bio Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-xl rounded-xl p-8 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Edit Bio</h2>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
              placeholder="Tell us about yourself"
              className="w-full border border-[#d1d5db] rounded-lg bg-[#f5f3ff] p-4 focus:outline-none focus:ring-2 focus:ring-[#c084fc] resize-none"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button className="btn-outline" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
