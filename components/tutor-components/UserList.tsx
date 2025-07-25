"use client";

import React from "react";
import Image from "next/image";
import { useMessageStore } from "@/stores/useMessageStore"; // Import the new message store

export default function UserList() {
  const { conversations, activeConversationId, setActiveConversation } =
    useMessageStore();

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#2F5FFF]"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      <nav>
        {conversations.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`flex items-center w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150
                ${
                  activeConversationId === conv.id
                    ? "bg-[#E0E7FF] border-l-4 border-[#2F5FFF]"
                    : ""
                }`}
            >
              <Image
                src={conv.userAvatar}
                alt={conv.userName}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-800">{conv.userName}</p>
                <p className="text-sm text-gray-600 truncate">
                  {conv.lastMessageText}
                </p>
              </div>
            </button>
          ))
        )}
      </nav>
    </div>
  );
}
