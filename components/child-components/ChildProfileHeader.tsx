"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
// import Link from "next/link";
import { MdCloudUpload, MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useChildStore } from "@/stores/useChildStores";

const AVATAR_KEY = "childAvatar";
const BANNER_KEY = "childBanner";

export default function ChildProfileHeader() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"avatar" | "banner">(
    "avatar"
  );
  const [file, setFile] = useState<File | null>(null);

  const { childProfile } = useChildStore();

  const name =
    `${childProfile?.firstName || ""} ${childProfile?.lastName || ""}`.trim() ||
    "Child";
  const location =
    childProfile?.city && childProfile?.country
      ? `${childProfile.city}, ${childProfile.country}`
      : "Location not set";
  const yearSubject =
    childProfile?.Class && childProfile?.favoriteSubjects
      ? `${childProfile.Class}, ${childProfile.favoriteSubjects}`
      : "";

  const isOnline = true; // Replace with real-time logic later

  useEffect(() => {
    setAvatar(localStorage.getItem(AVATAR_KEY));
    setBanner(localStorage.getItem(BANNER_KEY));
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size < 5 * 1024 * 1024) {
      setFile(f);
    } else if (f) {
      alert("File size exceeds 5 MB limit. Please choose a smaller image.");
      setFile(null);
    }
  };

  const saveImage = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (uploadTarget === "avatar") {
        setAvatar(dataUrl);
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } else {
        setBanner(dataUrl);
        localStorage.setItem(BANNER_KEY, dataUrl);
      }
      setFile(null);
      setShowModal(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8">
        <div className="relative h-48 rounded-t-lg">
          {banner ? (
            <Image src={banner} alt="banner" fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-[#c7d4ff]" />
          )}

          <button
            onClick={() => {
              setUploadTarget("banner");
              setShowModal(true);
            }}
            className="absolute top-4 right-4 bg-white/70 hover:bg-white p-2 rounded-full shadow z-10 transition-colors duration-200"
            title="Click to upload banner image"
          >
            <MdCloudUpload size={20} />
          </button>

          <div className="absolute -bottom-[70px] left-8 flex items-center gap-4 z-20">
            <div className="relative w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white flex items-center justify-center">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={140}
                  height={140}
                  className="object-cover w-full h-full object-center"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600">
                  👤
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setUploadTarget("avatar");
                setShowModal(true);
              }}
              className="flex items-center gap-1 border border-black text-black text-sm px-3 py-1 rounded bg-white hover:bg-gray-100 shadow-sm transition-colors duration-200"
            >
              <MdEdit size={14} /> Edit picture
            </button>
          </div>
        </div>

        <div className="pt-20 pb-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="flex flex-wrap items-center gap-6 mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path d="M19 11c0 5-7 11-7 11S5 16 5 11a7 7 0 1 1 14 0Z" />
                </svg>
                {location}
              </span>

              <span className="flex items-center gap-1 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12h20" />
                  <path d="M2 16h20" />
                </svg>
                {yearSubject}
              </span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <span className="text-sm text-gray-700">Profile Status:</span>
            <div className="flex items-center gap-1">
              <span
                className={`w-3 h-3 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-8 relative shadow-lg">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black transition-colors duration-200"
              onClick={() => {
                setShowModal(false);
                setFile(null);
              }}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Upload Photo</h2>

            <label className="w-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-[#c084fc] rounded-lg bg-[#f5f3ff] cursor-pointer hover:bg-[#ede9fe] transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <MdCloudUpload size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-700 text-center">
                Click to upload or drag and drop <br />
                <span className="text-xs text-gray-500">
                  PNG or JPG (max 5 MB)
                </span>
              </p>
            </label>

            <div className="mt-6 flex justify-between items-center">
              <button
                className="text-sm text-red-500 hover:underline transition-colors duration-200"
                onClick={() => {
                  if (uploadTarget === "avatar") {
                    setAvatar(null);
                    localStorage.removeItem(AVATAR_KEY);
                  } else {
                    setBanner(null);
                    localStorage.removeItem(BANNER_KEY);
                  }
                  setShowModal(false);
                  setFile(null);
                }}
              >
                Remove {uploadTarget === "avatar" ? "Avatar" : "Banner"}
              </button>

              <div className="flex gap-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!file}
                  onClick={saveImage}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
