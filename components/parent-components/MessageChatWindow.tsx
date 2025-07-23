"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MessageBubble from "./MessageBubble";
import { FiSend } from "react-icons/fi"; // Send icon

// Define Message interface to include conversationId for local storage
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  conversationId: string; // Added for local storage
}

interface MessageChatWindowProps {
  currentUserId: string | null; // Changed to allow null for mock purposes
  otherUserId: string | null;
  otherUserName: string;
  // token: string; // Commented out: No longer needed as API calls are removed
}

const LOCAL_STORAGE_MESSAGES_KEY_PREFIX = "chatMessages_"; // Prefix for local storage keys

export default function MessageChatWindow({
  currentUserId, // Using this as a mock sender ID for now
  otherUserId,
  otherUserName,
}: // token, // Commented out
MessageChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Still useful for initial load from localStorage
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to bottom

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to load messages from localStorage when otherUserId changes
  useEffect(() => {
    const loadMessagesFromLocalStorage = () => {
      if (!otherUserId) {
        setMessages([]); // Clear messages if no conversation is selected
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const localStorageKey = `${LOCAL_STORAGE_MESSAGES_KEY_PREFIX}${otherUserId}`;
        const storedMessages = localStorage.getItem(localStorageKey);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          setMessages([]); // No messages found for this conversation
        }
      } catch (err) {
        console.error("Error loading messages from localStorage:", err);
        setError("Failed to load messages from local storage.");
      } finally {
        setLoading(false);
      }
    };

    loadMessagesFromLocalStorage();
  }, [otherUserId]); // Dependency on otherUserId

  // Effect to scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !otherUserId || !currentUserId) return;

    const messageToSend: Message = {
      id: `local-${Date.now()}`, // Unique ID for local storage
      senderId: currentUserId,
      receiverId: otherUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      conversationId: otherUserId, // Store conversationId with the message
    };

    // Update messages in state
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, messageToSend];
      // Save updated messages to localStorage
      try {
        const localStorageKey = `${LOCAL_STORAGE_MESSAGES_KEY_PREFIX}${otherUserId}`;
        localStorage.setItem(localStorageKey, JSON.stringify(updatedMessages));
      } catch (err) {
        console.error("Error saving messages to localStorage:", err);
        alert("Failed to save message to local storage.");
      }
      return updatedMessages;
    });

    setNewMessage(""); // Clear input field
    scrollToBottom(); // Scroll to new message

    // API call commented out for now
    /*
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/message`, {
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
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message.");
      }
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
      // Optionally remove the optimistically added message or mark it as failed
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToSend.id)
      );
    }
    */
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
