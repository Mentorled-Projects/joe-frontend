"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { MdCloudUpload, MdEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useTutorStore } from "@/stores/useTutorStores";

const AVATAR_KEY = "tutorAvatar";
const BANNER_KEY = "tutorBanner";

interface TutorProfileHeaderProps {
  tutorId: string;
}

interface FetchedTutorData {
  id: string;
  name: string;
  email: string;
  location?: string;
  isAccountVerified?: boolean;
}

export default function TutorProfileHeader({
  tutorId,
}: TutorProfileHeaderProps) {
  const router = useRouter();
  const { profile: loggedInTutorProfile, setProfile } = useTutorStore();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"avatar" | "banner">(
    "avatar"
  );
  const [file, setFile] = useState<File | null>(null);

  const [displayedTutorDetails, setDisplayedTutorDetails] =
    useState<FetchedTutorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please sign in.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/tutor/get-by-id/${tutorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              `Failed to fetch tutor data: ${response.status} ${response.statusText}`
          );
        }

        const data: FetchedTutorData = await response.json();
        setDisplayedTutorDetails(data);
      } catch (err: unknown) {
        console.error("Error fetching tutor details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load tutor data."
        );
        setDisplayedTutorDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (tutorId) {
      fetchTutorDetails();
    }
  }, [tutorId]);

  const tutorName =
    displayedTutorDetails?.name || loggedInTutorProfile?.firstName || "Tutor";
  const tutorLocation =
    displayedTutorDetails?.location ||
    loggedInTutorProfile?.location ||
    "Location Not Set";
  const isAccountVerified =
    displayedTutorDetails?.isAccountVerified ??
    loggedInTutorProfile?.isAccountVerified ??
    false;
  const isProfileCompleted = loggedInTutorProfile?.isProfileCompleted ?? false;

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setAvatarPreview(localStorage.getItem(AVATAR_KEY));
    setBannerPreview(localStorage.getItem(BANNER_KEY));
  }, []);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size < 5 * 1024 * 1024) {
      setFile(f);
    } else if (f) {
      console.error("File size exceeds 5 MB limit.");
    }
  };

  const saveImage = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (uploadTarget === "avatar") {
        setAvatarPreview(dataUrl);
        localStorage.setItem(AVATAR_KEY, dataUrl);
        setProfile({ image: dataUrl });
      } else {
        setBannerPreview(dataUrl);
        localStorage.setItem(BANNER_KEY, dataUrl);
      }
      setFile(null);
      setShowModal(false);
    };
    reader.readAsDataURL(file);
  };

  let actionButtonText = "Complete Profile";
  let actionButtonPath = "/tutor/register-tutor-data";

  if (isProfileCompleted) {
    actionButtonText = "Verify Account";
    actionButtonPath = "/tutor/verify-tutor-account";
  }

  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8 p-8 text-center">
        Loading tutor profile...
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow mb-8 p-8 text-center text-red-600">
        Error: {error}
      </section>
    );
  }

  const isOwnProfile = loggedInTutorProfile?._id === tutorId;

  return (
    <>
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8 max-w-5xl mx-auto">
        {/* Banner Section */}
        <div className="relative h-48 w-full bg-gray-200">
          {bannerPreview ? (
            <Image
              src={bannerPreview}
              alt="Tutor Banner"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#2F5FFF] to-[#9B5BFF]" />
          )}

          <button
            onClick={() => {
              setUploadTarget("banner");
              setShowModal(true);
            }}
            className="absolute top-4 right-4 p-2 bg-white/70 rounded-full shadow-md hover:bg-white transition-colors duration-200"
            aria-label="Upload banner"
          >
            <MdCloudUpload size={24} className="text-gray-700" />
          </button>

          <div className="absolute -bottom-16 left-8 flex items-end gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-gray-200 flex items-center justify-center">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Tutor Profile"
                  width={128}
                  height={128}
                  className="object-cover rounded-full"
                  unoptimized
                />
              ) : (
                <span className="text-6xl text-gray-500">👤</span>
              )}

              <div
                className={`w-6 h-6 rounded-full absolute bottom-2 right-2 border-2 border-white ${
                  isOnline ? "bg-[#2F5FFF]" : "bg-gray-400"
                }`}
              />
            </div>
            {/* Edit Picture Button */}
            <button
              onClick={() => {
                setUploadTarget("avatar");
                setShowModal(true);
              }}
              className="px-4 py-2 bg-gray-200 rounded-md shadow-md text-gray-700 hover:bg-gray-300 transition-colors duration-200 flex items-center gap-1 text-sm mb-2"
            >
              <MdEdit size={16} /> Edit picture
            </button>
          </div>
        </div>

        {/* Profile Details and Action Button Section */}
        <div className="pt-20 pb-6 px-8 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome {tutorName} 👋
            </h1>
            <div className="flex flex-wrap items-center text-gray-600 text-sm mt-2 space-x-4">
              <p className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" /> Tutor Account
              </p>
              <p className="flex items-center">
                <LocationIcon className="w-4 h-4 mr-1" /> {tutorLocation}
              </p>
              <p className="flex items-center">
                <StatusIcon
                  className={`w-4 h-4 mr-1 ${
                    isAccountVerified ? "text-green-500" : "text-red-500"
                  }`}
                />{" "}
                {isAccountVerified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>

          {/* Use isOwnProfile here */}
          {isOwnProfile && (
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <button
                onClick={() => router.push(actionButtonPath)}
                className="px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 text-sm font-medium w-full md:w-auto"
              >
                {actionButtonText}
              </button>

              <div className="flex items-center gap-2 text-sm">
                Profile Status:
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isOnline}
                    onChange={() => setIsOnline(!isOnline)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#2F5FFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  <span className="ml-2">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl p-8 relative shadow-lg">
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
              <p className="text-gray-700 text-center">
                Click to upload or drag and drop <br />
                <span className="text-xs text-gray-500">
                  PNG or JPG (max 5 MB)
                </span>
              </p>
            </label>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => {
                  if (uploadTarget === "avatar") {
                    setAvatarPreview(null);
                    localStorage.removeItem(AVATAR_KEY);
                    setProfile({ image: undefined });
                  } else {
                    setBannerPreview(null);
                    localStorage.removeItem(BANNER_KEY);
                  }
                  setShowModal(false);
                  setFile(null);
                }}
              >
                Remove {uploadTarget === "avatar" ? "Avatar" : "Banner"}
              </button>

              <div className="flex gap-4 w-full sm:w-auto justify-end">
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill="currentColor"
      />
    </svg>
  );
}

function StatusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7V12L15 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
