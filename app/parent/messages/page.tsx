// app/parent/messages/page.tsx
"use client";

import React, { useState } from "react";
import ParentHeader from "@/components/parent-components/ParentHeader";
import MessageSidebar from "@/components/parent-components/MessageSidebar";
import MessageChatWindow from "@/components/parent-components/MessageChatWindow"; // Still needed for its empty state
import NewMessageModal from "@/components/parent-components/NewMessageModal";
import { useParentStore } from "@/stores/useParentStores";
import { useRouter } from "next/navigation"; // Import useRouter

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

export default function MessagesHomePage() {
  const router = useRouter();
  const { profile, token, _hasHydrated } = useParentStore();
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Mock conversations for the sidebar.
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
    // ... more mock conversations
  ];

  // When a conversation is selected, navigate to its dynamic route
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

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <ParentHeader />
      <div className="flex flex-1 pt-14">
        <MessageSidebar
          conversations={mockConversations}
          selectedConversationId={null} // No conversation selected by default
          onSelectConversation={handleSelectConversation}
          onNewMessage={() => setShowNewMessageModal(true)}
        />
        {/* Display an empty chat window or a message to select a chat */}
        <MessageChatWindow
          currentUserId={profile._id}
          otherUserId={null} // No other user selected initially
          otherUserName="Select a chat"
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
