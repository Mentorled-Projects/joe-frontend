"use client";

import Image from "next/image";
import { useState } from "react";
import { FiVideo, FiImage, FiEdit3 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useChildStore } from "@/stores/useChildStores";
import { usePostStore } from "@/stores/usePostStore";
import { ChildPost } from "@/types/child";
import { uploadFile } from "@/stores/uploadService";
import { useParentStore } from "@/stores/useParentStores";

export default function CreatePostSection() {
  const { childProfile } = useChildStore();
  const { addPost } = usePostStore();
  const { profile: parentProfile, token: parentToken } = useParentStore();

  const childAvatar = childProfile?.image || "/assets/images/avatar.png";

  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postVideoFile, setPostVideoFile] = useState<File | null>(null);
  const [postMediaPreviewUrl, setPostMediaPreviewUrl] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleOpenModal = () => {
    setShowPostModal(true);
  };

  const handleCloseModal = () => {
    setShowPostModal(false);
    setPostContent("");
    setPostImageFile(null);
    setPostVideoFile(null);
    setPostMediaPreviewUrl(null);
    setIsUploading(false);
    setIsPosting(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB limit. Please choose a smaller file.");
        e.target.value = "";
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPostMediaPreviewUrl(previewUrl);

      if (type === "image") {
        setPostImageFile(file);
        setPostVideoFile(null);
      } else {
        setPostVideoFile(file);
        setPostImageFile(null);
      }
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && !postImageFile && !postVideoFile) {
      alert("Please add some content or select a file to post.");
      return;
    }

    const phoneNumber = parentProfile?.phoneNumber;
    const childId = childProfile?.childId;
    const token = parentToken;

    if (!childId) {
      alert("Child ID not found. Cannot create post.");
      return;
    }
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    let uploadedMediaUrl: string | undefined = undefined;

    if (postImageFile || postVideoFile) {
      setIsUploading(true);
      try {
        const fileToUpload = postImageFile || postVideoFile;
        if (fileToUpload && phoneNumber) {
          const response = await uploadFile(fileToUpload, phoneNumber);
          uploadedMediaUrl =
            (response as { url: string })?.url || (response as string);
        }
      } catch (error) {
        console.error("Error uploading media:", error);
        alert("Failed to upload media. Please try again.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    setIsPosting(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const payload = {
        child: childId,
        content: postContent,
        image: uploadedMediaUrl,
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/post/add-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newPost: ChildPost = {
          id: Date.now().toString(),
          authorName: `${childProfile.firstName || "Child"} ${
            childProfile.lastName || "User"
          }`,
          authorAvatar: childAvatar,
          timeAgo: "Just now",
          content: postContent,
          image: uploadedMediaUrl,
          tags: [],
        };
        addPost(newPost);
        alert("Post created successfully!");
        handleCloseModal();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create post.");
      }
    } catch (err: unknown) {
      console.error("Failed to create post:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Please try again.";
      alert(`Error creating post: ${errorMessage}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={childAvatar}
            alt="Child Avatar"
            width={40}
            height={40}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <input
          type="text"
          placeholder="Start a post..."
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm cursor-pointer"
          onFocus={handleOpenModal}
          readOnly
        />
      </div>

      <div className="mt-4 flex justify-around border-t border-gray-200 pt-4">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <FiVideo size={20} />
          <span className="text-sm font-medium">Video</span>
        </button>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <FiImage size={20} />
          <span className="text-sm font-medium">Photo</span>
        </button>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <FiEdit3 size={20} />
          <span className="text-sm font-medium">Write article</span>
        </button>
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={handleCloseModal}
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Write a post</h2>

            <textarea
              placeholder="Tell us about your experience"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm resize-none"
              rows={6}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyDown={handleKeyDown}
            ></textarea>

            {postMediaPreviewUrl && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                {postImageFile && (
                  <Image
                    src={postMediaPreviewUrl}
                    alt="Selected media"
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                )}
                {postVideoFile && (
                  <video
                    src={postMediaPreviewUrl}
                    controls
                    className="w-full h-full object-cover"
                  ></video>
                )}
                <button
                  onClick={() => {
                    setPostImageFile(null);
                    setPostVideoFile(null);
                    setPostMediaPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black"
                  title="Remove media"
                >
                  <IoMdClose size={16} />
                </button>
              </div>
            )}

            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <FiImage size={20} />
                <span className="text-sm font-medium">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <FiVideo size={20} />
                <span className="text-sm font-medium">Add Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={handleCloseModal}
                disabled={isPosting} // Disable cancel while posting
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePost}
                disabled={
                  isUploading ||
                  isPosting || // Disable if posting
                  (!postContent.trim() && !postImageFile && !postVideoFile)
                }
              >
                {isUploading
                  ? "Uploading..."
                  : isPosting
                  ? "Posting..."
                  : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
