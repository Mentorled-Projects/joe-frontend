/* /components/ParentProfileHeader.tsx */
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { MdCloudUpload, MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const AVATAR_KEY = "parentAvatar";
const BANNER_KEY = "parentBanner";

export default function ParentProfileHeader() {
  /* -------------------------------- state -------------------------------- */
  const [avatar, setAvatar] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"avatar" | "banner">(
    "avatar"
  );
  const [file, setFile] = useState<File | null>(null);

  /* --------------------------- demo/static props -------------------------- */
  const name = "Catherine";
  const accountType = "Parent Account";
  const location = "Manchester, UK";
  const verified = false; // change to true when KYC succeeds

  /* --------------------------- load stored images ------------------------- */
  useEffect(() => {
    setAvatar(localStorage.getItem(AVATAR_KEY));
    setBanner(localStorage.getItem(BANNER_KEY));
  }, []);

  /* --------------------------- helpers ----------------------------------- */
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size < 5 * 1024 * 1024) setFile(f);
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

  /* -------------------------------- render -------------------------------- */
  return (
    <>
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8">
        {/* ---------------------------- Banner ---------------------------- */}
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          {banner ? (
            <Image src={banner} alt="banner" fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-[#c7d4ff]" />
          )}

          {/* upload button top-right */}
          <button
            onClick={() => {
              setUploadTarget("banner");
              setShowModal(true);
            }}
            className="absolute top-4 right-4 bg-white/70 hover:bg-white p-2 rounded-full shadow"
            title="Click to upload image"
          >
            <MdCloudUpload size={20} />
          </button>

          {/* ---------------------- avatar & edit button ---------------------- */}
          <div className="absolute -bottom-[70px] left-8 flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={140}
                  height={140}
                  className="rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-[140px] h-[140px] rounded-full bg-gray-200 flex items-center justify-center text-4xl border-4 border-white">
                  👤
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setUploadTarget("avatar");
                setShowModal(true);
              }}
              className="flex items-center gap-1 border border-black text-black text-sm px-3 py-1 rounded bg-white hover:bg-gray-100"
            >
              <MdEdit size={14} /> Edit profile
            </button>
          </div>
        </div>

        {/* ------------------------ details row ------------------------- */}
        <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          {/* left column */}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Welcome {name} <span>👋</span>
            </h1>

            {/* meta badges */}
            <div className="flex flex-wrap items-center gap-6 mt-3 text-sm">
              {/* account type */}
              <span className="flex items-center gap-1 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                {accountType}
              </span>

              {/* location */}
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

              {/* verification */}
              <span
                className={`flex items-center gap-1 ${
                  verified ? "text-black" : "text-red-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke={verified ? "#22c55e" : "#ef4444"}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
                {verified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          {/* right column */}
          <button className="mt-6 md:mt-0 bg-[#2F5FFF] hover:bg-[#1d46ff] text-white px-6 py-2 rounded">
            Complete Profile
          </button>
        </div>
      </section>

      {/* ---------------------------- modal ---------------------------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-8 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => {
                setShowModal(false);
                setFile(null);
              }}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Upload Photo</h2>

            <label className="w-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-[#c084fc] rounded-lg bg-[#f5f3ff] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <MdCloudUpload size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-700">
                Click to upload or drag and drop <br />
                <span className="text-xs text-gray-500">
                  PNG or JPG (max 5 MB)
                </span>
              </p>
            </label>

            {/* action buttons */}
            <div className="mt-6 flex justify-between items-center">
              {/* remove current */}
              <button
                className="text-sm text-red-500 hover:underline"
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
                  className="btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary disabled:opacity-50"
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
