"use client";

import React from "react";
import Image from "next/image";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
}

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer border-b border-gray-100 last:border-b-0
        ${
          isSelected
            ? "bg-[#E9F3FF] border-l-4 border-[#2F5FFF]"
            : "hover:bg-gray-50"
        }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200">
        <Image
          src={conversation.avatar}
          alt={conversation.name}
          width={48}
          height={48}
          className="object-cover w-full h-full"
          unoptimized // Use unoptimized for external images or if not configured in next.config.js
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/48x48/E0E0E0/666666?text=AV"; // Fallback image
          }}
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {conversation.name}
        </p>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  );
}
