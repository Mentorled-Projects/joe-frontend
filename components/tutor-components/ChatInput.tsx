"use client";

import React, { useState } from "react";
import { useMessageStore } from "@/stores/useMessageStore"; // Import the new message store

export default function ChatInput() {
  const [messageText, setMessageText] = useState("");
  const { activeConversationId, addMessage, currentUserId } = useMessageStore();

  const handleSendMessage = () => {
    if (messageText.trim() && activeConversationId) {
      const newMessage = {
        id: Date.now().toString(), // Simple unique ID for demo
        conversationId: activeConversationId,
        senderId: currentUserId, // Current logged-in user (tutor)
        text: messageText.trim(),
        timestamp: Date.now(),
      };
      addMessage(newMessage); // Add message to Zustand store
      setMessageText(""); // Clear input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent new line in input
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white p-4 border-t border-gray-200 flex items-center shadow-md">
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2F5FFF]"
        disabled={!activeConversationId} // Disable if no conversation is active
      />
      <button
        onClick={handleSendMessage}
        className="ml-3 px-6 py-2 bg-[#2F5FFF] text-white rounded-lg hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!messageText.trim() || !activeConversationId} // Disable if no text or no active conversation
      >
        Send
      </button>
    </div>
  );
}
