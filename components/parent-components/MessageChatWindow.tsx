"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MessageBubble from "./MessageBubble";
import { FiSend } from "react-icons/fi"; // Send icon

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface MessageChatWindowProps {
  currentUserId: string;
  otherUserId: string | null;
  otherUserName: string;
  token: string;
}

export default function MessageChatWindow({
  currentUserId,
  otherUserId,
  otherUserName,
  token,
}: MessageChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to bottom

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to fetch messages when otherUserId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!otherUserId) {
        setMessages([]); // Clear messages if no conversation is selected
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not defined in environment variables."
          );
        }

        const res = await fetch(
          `${API_BASE_URL}/api/v1/message/get-messages/${otherUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Assuming data.messages is an array of message objects
          setMessages(data.messages || []);
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch messages.");
        }
      } catch (err: unknown) {
        console.error("Error fetching messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load messages."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [otherUserId, token]); // Dependency on otherUserId and token

  // Effect to scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUserId) return;

    const messageToSend: Message = {
      id: `mock-${Date.now()}`, // Mock ID
      senderId: currentUserId,
      receiverId: otherUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Optimistically add message to UI
    setMessages((prevMessages) => [...prevMessages, messageToSend]);
    setNewMessage(""); // Clear input field
    scrollToBottom(); // Scroll to new message

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      // Mock API call for sending message. Replace with actual API endpoint.
      const res = await fetch(`${API_BASE_URL}/api/v1/message`, {
        // Assuming POST /api/v1/message
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: messageToSend.content,
        }),
      });

      if (!res.ok) {
        // If sending fails, you might want to revert the optimistic update
        // or show an error indicator on the message.
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message.");
      }
      // If successful, the message is already in the UI. No need to re-fetch all messages
      // unless your backend sends back the full message object with a real ID.
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      // Handle error, e.g., display a toast notification
      alert("Failed to send message. Please try again.");
      // Optionally remove the optimistically added message or mark it as failed
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToSend.id)
      );
    }
  };

  if (!otherUserId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-md m-4">
        <p className="text-gray-500 text-lg">
          Select a conversation to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md m-4">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
          <Image
            src="/assets/images/avatar.png" // Placeholder for other user's avatar
            alt={otherUserName}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">{otherUserName}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {loading && (
          <p className="text-center text-gray-500">Loading messages...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="text-center text-gray-500">Start a conversation!</p>
        )}
        {!loading &&
          !error &&
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSentByCurrentUser={msg.senderId === currentUserId}
            />
          ))}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] text-sm"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 p-2 bg-[#2F5FFF] text-white rounded-full hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newMessage.trim()}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
