"use client";

import React, { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi"; // Plus icon for new message
import ConversationListItem from "./ConversationListItem";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

interface MessageSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewMessage: () => void; // Callback for "New Message" button
}

export default function MessageSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewMessage,
}: MessageSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-56px)] overflow-y-auto shadow-md">
      {" "}
      {/* Adjusted height for header */}
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>

        {/* New Message Button */}
        <button
          onClick={onNewMessage}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 text-sm font-medium"
        >
          <FiPlus className="mr-2" size={18} /> Start New Message
        </button>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-gray-500 p-4 text-sm">
            No conversations found.
          </p>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
