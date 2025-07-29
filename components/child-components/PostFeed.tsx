"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiVideo,
  FiImage,
} from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { usePostStore } from "@/stores/usePostStore";
import { useParentStore } from "@/stores/useParentStores";
import { useChildStore } from "@/stores/useChildStores";
import { ChildPost } from "@/types/child";
import { uploadFile } from "@/stores/uploadService";

export default function PostFeed() {
  const {
    posts,
    setPosts,
    updatePost,
    deletePost: removePostFromStore,
  } = usePostStore();
  const { profile: parentProfile, token: parentToken } = useParentStore();
  const { childProfile } = useChildStore();

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorLoadingPosts, setErrorLoadingPosts] = useState<string | null>(
    null
  );
  const [showOptionsMenuId, setShowOptionsMenuId] = useState<string | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ChildPost | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editMediaPreviewUrl, setEditMediaPreviewUrl] = useState<string | null>(
    null
  );
  const [isUploadingEditMedia, setIsUploadingEditMedia] = useState(false);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);

  const initialMockPosts: ChildPost[] = [
    {
      id: "1",
      authorName: "Alex Thompson",
      authorAvatar:
        localStorage.getItem("childAvatar") || "/assets/images/kiddp.svg",
      timeAgo: "4h",
      edited: true,
      content:
        "Just finished my volcano science project! It actually erupted! 🌋 #ScienceExperiments #Volcano",
      image: "/assets/images/kid-volcano.svg",
      tags: ["#ScienceExperiments", "#Volcano"],
    },
    {
      id: "2",
      authorName: "Emma Thompson",
      authorAvatar:
        localStorage.getItem("childAvatar") || "/assets/images/kiddp.svg",
      timeAgo: "1h",
      content:
        "I finished reading 'The Magical Treehouse' series! It was so exciting. What should I read next? #books #reading 📚",
      image: "/assets/images/kidsRabbit.svg",
      tags: ["#books", "#reading"],
    },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const childId =
        childProfile?.childId || childProfile?._id || parentProfile?.childId;
      const token = parentToken;

      if (!childId || !token) {
        setLoadingPosts(false);
        console.warn(
          "Child ID or authentication token not found. Cannot fetch live posts."
        );
        setPosts([]);
        return;
      }

      setLoadingPosts(true);
      setErrorLoadingPosts(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        const res = await fetch(
          `${API_BASE_URL}/api/v1/post/get-all-post/${childId}`,

          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response from fetch posts:", res);

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.posts)) {
            interface ApiPost {
              _id: string;
              content: string;
              image?: string;
              tags?: string[];
            }
            const fetchedPosts: ChildPost[] = data.posts.map(
              (post: ApiPost) => ({
                id: post._id,
                authorName: `${childProfile.firstName || "Child"} ${
                  childProfile.lastName || "User"
                }`,
                authorAvatar:
                  localStorage.getItem("childAvatar") ||
                  "/assets/images/kiddp.svg",
                timeAgo: "Just now",
                content: post.content,
                image: post.image,
                tags: post.tags || [],
                edited: false,
              })
            );
            setPosts(fetchedPosts);
          } else {
            setPosts([]);
          }
        } else {
          const errorData = await res.json();
          setErrorLoadingPosts(errorData.message || "Failed to fetch posts.");
          setPosts([]);
        }
      } catch (err: unknown) {
        console.error("Error fetching posts:", err);
        setErrorLoadingPosts(
          `Failed to load posts: ${
            err instanceof Error ? err.message : "Please try again."
          }`
        );
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [
    parentProfile?.childId,
    parentToken,
    setPosts,
    childProfile?.childId,
    childProfile?._id,
    childProfile,
    setLoadingPosts,
    setErrorLoadingPosts,
  ]);

  const displayedPosts = posts.length > 0 ? posts : initialMockPosts;

  const handleOptionsMenuClick = (postId: string) => {
    setShowOptionsMenuId(showOptionsMenuId === postId ? null : postId);
  };

  const handleEditPost = (post: ChildPost) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditMediaPreviewUrl(post.image || null);
    setEditImageFile(null);
    setEditVideoFile(null);
    setShowEditModal(true);
    setShowOptionsMenuId(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    const token = parentToken;
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/post/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        removePostFromStore(postId);
        alert("Post deleted successfully!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete post.");
      }
    } catch (err: unknown) {
      console.error("Error deleting post:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";
      alert(`Error deleting post: ${errorMessage}`);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    if (
      !editContent.trim() &&
      !editImageFile &&
      !editVideoFile &&
      !editingPost.image
    ) {
      alert("Please add some content or select a file to update the post.");
      return;
    }

    const phoneNumber = parentProfile?.phoneNumber;
    const token = parentToken;

    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    setIsUpdatingPost(true);
    let newMediaUrl: string | null | undefined = editingPost.image;

    if (editImageFile || editVideoFile) {
      setIsUploadingEditMedia(true);
      try {
        const fileToUpload = editImageFile || editVideoFile;
        if (fileToUpload && phoneNumber) {
          const response = await uploadFile(fileToUpload, phoneNumber);
          newMediaUrl =
            (response as { url: string })?.url || (response as string);
        }
      } catch (error: unknown) {
        console.error("Error uploading new media:", error);
        alert("Failed to upload new media. Please try again.");
        setIsUploadingEditMedia(false);
        setIsUpdatingPost(false);
        return;
      } finally {
        setIsUploadingEditMedia(false);
      }
    } else if (!editMediaPreviewUrl) {
      newMediaUrl = undefined;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const payload = {
        content: editContent,
        image: newMediaUrl,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/v1/post/update/${editingPost.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        updatePost(editingPost.id, {
          content: editContent,
          image: newMediaUrl,
          edited: true,
          timeAgo: "Just now",
        });
        alert("Post updated successfully!");
        setShowEditModal(false);
        setEditingPost(null);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update post.");
      }
    } catch (err: unknown) {
      console.error("Error updating post:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";
      alert(`Error updating post: ${errorMessage}`);
    } finally {
      setIsUpdatingPost(false);
    }
  };

  const handleEditFileChange = (
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
      setEditMediaPreviewUrl(previewUrl);

      if (type === "image") {
        setEditImageFile(file);
        setEditVideoFile(null);
      } else {
        setEditVideoFile(file);
        setEditImageFile(null);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-end mb-4">
        <select className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#2F5FFF]">
          <option>Sort by Top</option>
          <option>Sort by Newest</option>
          <option>Sort by Oldest</option>
        </select>
      </div>

      <div className="space-y-6">
        {loadingPosts && (
          <p className="text-center text-gray-500">Loading posts...</p>
        )}
        {errorLoadingPosts && (
          <p className="text-center text-red-500">{errorLoadingPosts}</p>
        )}
        {!loadingPosts && !errorLoadingPosts && displayedPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts yet. Start by creating one!
          </p>
        ) : (
          displayedPosts.map((post) => (
            <div
              key={post.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-3">
                {/* Combined avatar and name/time into a single flex container */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.timeAgo} {post.edited && "• Edited"}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => handleOptionsMenuClick(post.id)}
                  >
                    <FiMoreHorizontal size={20} />
                  </button>
                  {showOptionsMenuId === post.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleEditPost(post)}
                      >
                        <FiEdit size={16} /> Edit post
                      </button>
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <FiTrash2 size={16} /> Delete post
                      </button>
                      <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Copy link to post
                      </button>
                      <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Privacy
                      </button>
                      <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-3">{post.content}</p>

              {post.image && (
                <div className="rounded-lg overflow-hidden mb-3">
                  {post.image.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={post.image}
                      controls
                      className="object-cover w-full h-auto max-h-96"
                    ></video>
                  ) : (
                    <Image
                      src={post.image}
                      alt="Post Image"
                      width={600}
                      height={300}
                      className="object-cover w-full h-auto max-h-96"
                      unoptimized
                    />
                  )}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-blue-600">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-50 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => {
                setShowEditModal(false);
                setEditingPost(null);
                setEditImageFile(null);
                setEditVideoFile(null);
                setEditMediaPreviewUrl(null);
              }}
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

            <textarea
              placeholder="Edit your post content"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm resize-none"
              rows={6}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            ></textarea>

            {editMediaPreviewUrl && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                {editImageFile || (editingPost.image && !editVideoFile) ? (
                  <Image
                    src={editMediaPreviewUrl}
                    alt="Selected media"
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                ) : (
                  <video
                    src={editMediaPreviewUrl}
                    controls
                    className="w-full h-full object-cover"
                  ></video>
                )}
                <button
                  onClick={() => {
                    setEditImageFile(null);
                    setEditVideoFile(null);
                    setEditMediaPreviewUrl(null);
                    setEditingPost((prev) =>
                      prev ? { ...prev, image: undefined } : null
                    );
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
                <span className="text-sm font-medium">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleEditFileChange(e, "image")}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 text-gray-700 hover:text-[#2F5FFF] transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <FiVideo size={20} />
                <span className="text-sm font-medium">Change Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleEditFileChange(e, "video")}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPost(null);
                  setEditImageFile(null);
                  setEditVideoFile(null);
                  setEditMediaPreviewUrl(null);
                }}
                disabled={isUpdatingPost || isUploadingEditMedia}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdatePost}
                disabled={
                  isUploadingEditMedia ||
                  isUpdatingPost ||
                  (!editContent.trim() &&
                    !editImageFile &&
                    !editVideoFile &&
                    !editingPost.image)
                }
              >
                {isUploadingEditMedia
                  ? "Uploading..."
                  : isUpdatingPost
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
