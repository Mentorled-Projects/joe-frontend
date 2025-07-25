"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useMessageStore } from "@/stores/useMessageStore";
import { useTutorStore } from "@/stores/useTutorStores"; // To get current user ID

// Define a type for a simplified notification item
interface NotificationItem {
  id: string;
  type: "message" | "request"; // Type of notification
  senderName: string;
  message: string; // The notification text
  timestamp: number;
  avatarUrl: string;
}

export default function NotificationsPage() {
  const { messages, conversations, currentUserId } = useMessageStore();
  // Correct way to check hydration status for a persisted Zustand store
  const messageStoreHydrated = useMessageStore.persist.hasHydrated();
  const { _hasHydrated: tutorStoreHydrated, profile: loggedInTutorProfile } =
    useTutorStore();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure both stores are hydrated before processing notifications
    if (
      messageStoreHydrated &&
      tutorStoreHydrated &&
      loggedInTutorProfile?._id
    ) {
      const tutorId = loggedInTutorProfile._id;
      const generatedNotifications: NotificationItem[] = [];

      // Process messages to create notifications
      messages.forEach((msg) => {
        // Only consider messages NOT sent by the current user
        if (msg.senderId !== tutorId) {
          const conversation = conversations.find(
            (conv) => conv.id === msg.conversationId
          );
          if (conversation) {
            generatedNotifications.push({
              id: msg.id,
              type: "message",
              senderName: conversation.userName,
              message: `Parent message from ${conversation.userName}`,
              timestamp: msg.timestamp,
              avatarUrl: conversation.userAvatar,
            });
          }
        }
      });

      // Sort notifications by timestamp (newest first)
      generatedNotifications.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(generatedNotifications);
      setIsLoading(false);
    } else if (
      messageStoreHydrated &&
      tutorStoreHydrated &&
      !loggedInTutorProfile?._id
    ) {
      // If stores are hydrated but no logged in tutor profile, means user is not logged in
      setIsLoading(false);
      setNotifications([]); // No notifications if not logged in
    }
  }, [
    messages,
    conversations,
    currentUserId,
    messageStoreHydrated,
    tutorStoreHydrated,
    loggedInTutorProfile,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  // Group notifications by day (Today, Yesterday, etc.)
  const groupedNotifications: { [key: string]: NotificationItem[] } = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);
    notifDate.setHours(0, 0, 0, 0);

    let dateLabel = "";
    if (notifDate.getTime() === today.getTime()) {
      dateLabel = "Today";
    } else if (
      notifDate.getTime() ===
      new Date(today.getTime() - 24 * 60 * 60 * 1000).getTime()
    ) {
      dateLabel = "Yesterday";
    } else {
      dateLabel = notifDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!groupedNotifications[dateLabel]) {
      groupedNotifications[dateLabel] = [];
    }
    groupedNotifications[dateLabel].push(notif);
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>

        {Object.keys(groupedNotifications).length === 0 ? (
          <p className="text-center text-gray-500">No new notifications.</p>
        ) : (
          Object.keys(groupedNotifications).map((dateLabel) => (
            <div key={dateLabel} className="mb-8 last:mb-0">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                {dateLabel}
              </h2>
              <div className="space-y-4">
                {groupedNotifications[dateLabel].map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <Image
                      src={notif.avatarUrl}
                      alt={notif.senderName}
                      width={40}
                      height={40}
                      className="rounded-full mr-4 flex-shrink-0"
                    />
                    <div>
                      <p className="text-gray-800">
                        <span className="font-medium">{notif.message}</span>
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
