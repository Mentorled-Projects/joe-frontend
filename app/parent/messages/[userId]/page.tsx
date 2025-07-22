"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter
import ParentHeader from "@/components/parent-components/ParentHeader";
import MessageSidebar from "@/components/parent-components/MessageSidebar";
import MessageChatWindow from "@/components/parent-components/MessageChatWindow";
import NewMessageModal from "@/components/parent-components/NewMessageModal";
import { useParentStore } from "@/stores/useParentStores"; // To get user ID and token

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

export default function DynamicMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, token, _hasHydrated } = useParentStore();

  const otherUserIdFromUrl = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(otherUserIdFromUrl || null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  const mockConversations: Conversation[] = [
    {
      id: "user123",
      name: "Emily Carter",
      lastMessage: "Hi, I'm looking for a tutor for my daughter, Chloe.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user124",
      name: "Ryan Parker",
      lastMessage: "Hi, I'm looking for a tutor for my son, Owen.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user125",
      name: "Sophia Hayes",
      lastMessage: "Hi, I'm looking for a tutor for my daughter, Ava.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user126",
      name: "Mark Foster",
      lastMessage: "Hi, I'm looking for a tutor for my son, Ethan.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user127",
      name: "Isabella Harper",
      lastMessage: "Hi, I'm looking for a tutor for my daughter, Isabella.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user128",
      name: "Nathan Reed",
      lastMessage: "Hi, I'm looking for a tutor for my son, Liam.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user129",
      name: "Lily Bennett",
      lastMessage: "Hi, I'm looking for a tutor for my daughter, Mia.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user130",
      name: "Jacob Scott",
      lastMessage: "Hi, I'm looking for a tutor for my son, Lucas.",
      avatar: "/assets/images/avatar.png",
    },
    {
      id: "user131",
      name: "Chloe Wright",
      lastMessage: "Hi, I'm looking for a tutor for my daughter, Amelia.",
      avatar: "/assets/images/avatar.png",
    },
  ];

  useEffect(() => {
    setSelectedConversationId(otherUserIdFromUrl || null);
  }, [otherUserIdFromUrl]);

  const handleSelectConversation = (userId: string) => {
    router.push(`/parent/messages/${userId}`);
  };

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        <ParentHeader />
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Loading user session...
        </div>
      </div>
    );
  }

  if (!token || !profile._id) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
        <ParentHeader />
        <div className="flex-1 flex items-center justify-center text-red-500">
          Please log in to view messages.
        </div>
      </div>
    );
  }

  const otherUserName =
    mockConversations.find((conv) => conv.id === selectedConversationId)
      ?.name || "Select a chat";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <ParentHeader />
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <MessageSidebar
          conversations={mockConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewMessage={() => setShowNewMessageModal(true)}
        />

        {/* Chat Window */}
        <MessageChatWindow
          currentUserId={profile._id}
          otherUserId={selectedConversationId}
          otherUserName={otherUserName}
          token={token}
        />
      </div>

      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          currentUserId={profile._id}
          token={token}
        />
      )}
    </div>
  );
}
