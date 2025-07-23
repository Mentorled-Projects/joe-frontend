// app/parent/messages/page.tsx
"use client";

import React, { useState } from "react";
import ParentHeader from "@/components/parent-components/ParentHeader";
import MessageSidebar from "@/components/parent-components/MessageSidebar";
import MessageChatWindow from "@/components/parent-components/MessageChatWindow";
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
  const {
    /* profile, token, _hasHydrated */
  } = useParentStore();
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

  // When a conversation is selected, navigate to its dynamic route
  const handleSelectConversation = (userId: string) => {
    router.push(`/parent/messages/${userId}`);
  };

  // Commented out: Wait for the Zustand store to hydrate before rendering content that depends on it
  /*
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
  */

  // Commented out: Check for authentication
  /*
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
  */

  // Using a mock current user ID for demonstration
  const mockCurrentUserId = "parent123";

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <ParentHeader />
      <div className="flex flex-1 p-2">
        <MessageSidebar
          conversations={mockConversations}
          selectedConversationId={null} // No conversation selected by default
          onSelectConversation={handleSelectConversation}
          onNewMessage={() => setShowNewMessageModal(true)}
        />
        {/* Display an empty chat window or a message to select a chat */}
        <MessageChatWindow
          currentUserId={mockCurrentUserId} // Use mock ID
          otherUserId={null} // No other user selected initially
          otherUserName="Select a chat"
          // token={token} // Commented out
        />
      </div>

      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          currentUserId={mockCurrentUserId} // Use mock ID
          // token={token} // Commented out
        />
      )}
    </div>
  );
}
