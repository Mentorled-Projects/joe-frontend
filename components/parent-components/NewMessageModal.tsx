"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserSearchResult {
  id: string;
  name: string;
  avatar: string;
}

interface NewMessageModalProps {
  onClose: () => void;

  currentUserId: string;
  token: string;
}

export default function NewMessageModal({
  onClose,
  currentUserId,
  token,
}: NewMessageModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Mock user data for search. In a real app, this would be fetched from an API.
  const mockUsers: UserSearchResult[] = React.useMemo(
    () => [
      {
        id: "tutor1",
        name: "John Doe (Tutor)",
        avatar: "/assets/images/avatar.png",
      },
      {
        id: "parentA",
        name: "Alice Smith (Parent)",
        avatar: "/assets/images/avatar.png",
      },
      {
        id: "tutor2",
        name: "Jane Foster (Tutor)",
        avatar: "/assets/images/avatar.png",
      },
      {
        id: "parentB",
        name: "Bob Johnson (Parent)",
        avatar: "/assets/images/avatar.png",
      },
      {
        id: "user123",
        name: "Emily Carter (Parent)",
        avatar: "/assets/images/avatar.png",
      },
    ],
    []
  );

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const filtered = mockUsers.filter(
          (user) =>
            user.id !== currentUserId &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err: unknown) {
        console.error("Error searching users:", err);
        setError(
          err instanceof Error ? err.message : "Failed to search users."
        );
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      searchUsers();
    }, 300); // Debounce search

    return () => clearTimeout(handler);
  }, [searchTerm, currentUserId, token, mockUsers]);

  const handleUserSelect = (userId: string) => {
    router.push(`/parent/messages/${userId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Start New Message</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          {loading && (
            <p className="text-center text-gray-500 p-4">Searching...</p>
          )}
          {error && <p className="text-center text-red-500 p-4">{error}</p>}
          {!loading &&
            !error &&
            searchResults.length === 0 &&
            searchTerm.trim() !== "" && (
              <p className="text-center text-gray-500 p-4 text-sm">
                No users found.
              </p>
            )}
          {!loading &&
            !error &&
            searchResults.length > 0 &&
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                onClick={() => handleUserSelect(user.id)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/40x40/E0E0E0/666666?text=AV";
                    }}
                  />
                </div>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
