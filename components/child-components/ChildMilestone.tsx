"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { useChildStore } from "@/stores/useChildStores";
import { useParentStore } from "@/stores/useParentStores";

import { uploadFile } from "@/stores/uploadService";
import Image from "next/image";

interface Milestone {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export default function ChildMilestones() {
  const { childProfile, setChildProfile } = useChildStore();
  const { token } = useParentStore();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [errorLoadingMilestones, setErrorLoadingMilestones] = useState<
    string | null
  >(null); // New state for error

  const currentMilestones: Milestone[] = (childProfile.milestones ||
    []) as Milestone[];
  const childId = childProfile?.childId || childProfile?._id;

  useEffect(() => {
    const fetchMilestones = async () => {
      if (childId) {
        setLoadingMilestones(false);

        console.warn(
          "Child ID or authentication token not found. Milestones cannot be fetched."
        );
        return;
      }

      setLoadingMilestones(true);
      setErrorLoadingMilestones(null); // Clear any previous error

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        const res = await fetch(
          `${API_BASE_URL}/api/v1/child/get-milestones/${childId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.milestones)) {
            const fetchedMilestones: Milestone[] = data.milestones.map(
              (item: Milestone) => ({
                title: item.title,
                description: item.description,
                date: item.date,
                imageUrl:
                  item.imageUrl || "/assets/images/milestone_placeholder.png",
              })
            );
            setChildProfile({ milestones: fetchedMilestones });
          } else {
            setChildProfile({ milestones: [] });
          }
        } else {
          const errorData = await res.json();

          setErrorLoadingMilestones(
            errorData.message || "Failed to fetch milestones."
          );
        }
      } catch (err: unknown) {
        console.error("Error fetching milestones:", err);
        if (err instanceof Error) {
          setErrorLoadingMilestones(
            `Failed to load milestones: ${err.message || "Please try again."}`
          );
        } else {
          setErrorLoadingMilestones(
            "Failed to load milestones: Please try again."
          );
        }
      } finally {
        setLoadingMilestones(false);
      }
    };

    fetchMilestones();
  }, [childId, token, setChildProfile]);

  const deleteMilestone = async (idx: number) => {
    const filtered = currentMilestones.filter((_, i) => i !== idx);
    setChildProfile({ milestones: filtered });
    alert("Milestone deleted.");
  };

  const handleAddMilestone = async () => {
    if (!title.trim() || !description.trim() || !date) {
      alert("Please fill in all required fields (Title, Description, Date).");
      return;
    }

    if (!childId) {
      alert("Child ID not found. Cannot add milestone.");
      return;
    }
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    setAddingMilestone(true);
    setUploading(false);

    let uploadedImageUrl: string | undefined;
    const phoneNumber = localStorage.getItem("phoneNumber");

    if (file) {
      setUploading(true);
      try {
        const response = await uploadFile(
          file,
          phoneNumber || "default",
          token
        );

        // Handle the nested response structure
        if (
          response &&
          response.success &&
          response.file &&
          response.file.url
        ) {
          uploadedImageUrl = response.file.url;
        } else if (response && response.url) {
          uploadedImageUrl = response.url;
        } else if (typeof response === "string") {
          uploadedImageUrl = response;
        }

        if (!uploadedImageUrl) {
          throw new Error("File upload returned no URL.");
        }
      } catch (err) {
        console.error("File upload failed:", err);
        alert("Failed to upload image. Please try again.");
        setAddingMilestone(false);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      // Let's try both with and without imageUrl to see what the API expects
      const payload = {
        child: childId,
        title: title.trim(),
        description: description.trim(),
        date,
        ...(uploadedImageUrl && { images: [uploadedImageUrl] }),
      };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/child/add-milestone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const responseText = await res.text();
      console.log("Raw response:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error(
          `Server returned non-JSON response: ${responseText.substring(0, 200)}`
        );
      }

      console.log("Parsed API Response:", responseData); // Debug log

      if (res.ok) {
        const newMilestone: Milestone = {
          title,
          description,
          date,
          imageUrl: uploadedImageUrl,
        };
        setChildProfile({
          milestones: [...currentMilestones, newMilestone],
        });
        alert("Milestone added successfully!");
        setShowModal(false);
        setTitle("");
        setDescription("");
        setDate("");
        setFile(null);
      } else {
        throw new Error(
          responseData.message || `Failed to add milestone (HTTP ${res.status})`
        );
      }
    } catch (err: unknown) {
      console.error("Failed to add milestone:", err);
      if (err instanceof Error) {
        alert(`Error adding milestone: ${err.message || "Please try again."}`);
      } else {
        alert("Error adding milestone: Please try again.");
      }
    } finally {
      setAddingMilestone(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-lg shadow border border-gray-200 px-8 py-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Milestones</h2>
          {loadingMilestones && (
            <p className="text-sm text-gray-500 mt-2">
              Loading achievements...
            </p>
          )}
          {errorLoadingMilestones && (
            <p className="text-sm text-red-500 mt-2">
              {errorLoadingMilestones}
            </p>
          )}

          {!loadingMilestones &&
            !errorLoadingMilestones &&
            currentMilestones.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No achievements added yet
              </p>
            )}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} title="Add Milestone">
            <IoMdAdd size={22} className="text-gray-600 hover:text-black" />
          </button>
          <button onClick={() => setShowModal(true)} title="Edit Milestones">
            <MdEdit size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* cards */}
      {!loadingMilestones &&
        !errorLoadingMilestones &&
        currentMilestones.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(showAll ? currentMilestones : currentMilestones.slice(0, 3)).map(
              (m, i) => (
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
                    src={
                      m.imageUrl || "/assets/images/milestone_placeholder.png"
                    }
                    alt={m.title}
                    width={400}
                    height={192}
                    className="object-cover w-full h-48"
                    style={{
                      width: "100%",
                      height: "12rem",
                      objectFit: "cover",
                    }}
                    unoptimized
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-sm">
                      {m.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {m.date || "No date specified"}
                    </p>
                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                      {m.description || "No description."}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}

      {/* show-all toggle */}
      {!loadingMilestones &&
        !errorLoadingMilestones &&
        currentMilestones.length > 3 && (
          <div
            className="mt-4 text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Hide" : `Show all (${currentMilestones.length})`}{" "}
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
              placeholder="e.g., Won a Reading Contest (Title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />

            <textarea
              placeholder="Description of the milestone (e.g., completed phonics exercises)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg resize-y"
              rows={3}
            ></textarea>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />

            <label className="w-full mb-7 p-2 border rounded-lg text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center">
              {uploading
                ? "Uploading image..."
                : file
                ? file.name
                : "Choose image file 📁"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                disabled={uploading}
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
                disabled={
                  !title.trim() ||
                  !description.trim() ||
                  !date ||
                  addingMilestone ||
                  uploading
                }
              >
                {addingMilestone ? "Adding..." : "Save Milestone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
