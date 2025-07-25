"use client";

import React, { useEffect } from "react";
import UserList from "@/components/tutor-components/UserList";
import MessageList from "@/components/tutor-components/MessageList";
import ChatInput from "@/components/tutor-components/ChatInput";
import { useMessageStore } from "@/stores/useMessageStore";
import { useTutorStore } from "@/stores/useTutorStores";

export default function MessagePage() {
  const { initializeStore, currentUserId } = useMessageStore();
  const { profile: loggedInTutorProfile, _hasHydrated } = useTutorStore();

  useEffect(() => {
    if (
      _hasHydrated &&
      loggedInTutorProfile?._id &&
      currentUserId === "dummyTutorId"
    ) {
      initializeStore(loggedInTutorProfile._id);
    }
  }, [_hasHydrated, loggedInTutorProfile, currentUserId, initializeStore]);

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <p className="text-gray-500">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F5F5F5] overflow-hidden">
      {" "}
      <div className="hidden md:flex flex-col h-full">
        {" "}
        {/* Hidden on small screens */}
        <UserList />
      </div>
      {/* Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
}
