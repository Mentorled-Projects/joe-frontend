"use client";

import React from "react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
  isSentByCurrentUser: boolean;
}

export default function MessageBubble({
  message,
  isSentByCurrentUser,
}: MessageBubbleProps) {
  const bubbleClass = isSentByCurrentUser
    ? "bg-[#2F5FFF] text-white self-end rounded-br-none"
    : "bg-gray-200 text-gray-800 self-start rounded-bl-none";

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col mb-2 max-w-[75%] ${
        isSentByCurrentUser ? "items-end" : "items-start"
      }`}
    >
      <div className={`p-3 rounded-lg shadow-sm ${bubbleClass}`}>
        <p className="text-sm">{message.content}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">{time}</span>
    </div>
  );
}
