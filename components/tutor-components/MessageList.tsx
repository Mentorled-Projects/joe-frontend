"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useMessageStore } from "@/stores/useMessageStore"; // Import the new message store

export default function MessageList() {
  const { messages, activeConversationId, conversations, currentUserId } =
    useMessageStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for the active conversation
  const activeConversationMessages = messages.filter(
    (msg) => msg.conversationId === activeConversationId
  );

  // Get the active conversation details
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Scroll to bottom of messages whenever they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversationMessages]);

  if (!activeConversationId || !activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500">
        Select a conversation to start chatting.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center shadow-sm">
        <Image
          src={activeConversation.userAvatar}
          alt={activeConversation.userName}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold text-gray-800">
            {activeConversation.userName}
          </h2>
          <p className="text-sm text-gray-500">Parent</p>{" "}
          {/* Assuming the other user is a Parent */}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeConversationMessages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages in this conversation yet.
          </p>
        ) : (
          activeConversationMessages.map((msg) => {
            const isSentByCurrentUser = msg.senderId === currentUserId;
            const senderAvatar = isSentByCurrentUser
              ? "https://placehold.co/40x40/2F5FFF/FFFFFF?text=You"
              : activeConversation.userAvatar;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isSentByCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isSentByCurrentUser && (
                  <Image
                    src={senderAvatar}
                    alt={activeConversation.userName}
                    width={32}
                    height={32}
                    className="rounded-full mr-2 self-end"
                  />
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isSentByCurrentUser
                      ? "bg-[#2F5FFF] text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-xs mt-1 ${
                      isSentByCurrentUser ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {isSentByCurrentUser && (
                  <Image
                    src={senderAvatar}
                    alt="You"
                    width={32}
                    height={32}
                    className="rounded-full ml-2 self-end"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
    </div>
  );
}
