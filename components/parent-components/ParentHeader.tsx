"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParentStore } from "@/stores/useParentStores";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

interface Notification {
  _id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function ParentHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, setProfile, token, setToken } = useParentStore();
  const [profilePic, setProfilePic] = useState("/assets/images/avatar5.svg");

  useEffect(() => {
    const storedPic = localStorage.getItem("parentAvatar");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  // Get the parent ID from the profile data
  const parentId = profile?.data?._id || profile?._id;

  // Create navigation links with dynamic parent ID
  const nav = useMemo(
    () => [
      {
        href: parentId ? `/parent/${parentId}` : `/parent/profile`,
        label: "Profile",
        icon: UserIcon,
      },
      { href: "/parent/messages", label: "Messages", icon: MessageIcon },
      {
        href: "/parent/recommendations/movies",
        label: "Movie Recommendations",
        icon: FilmIcon,
      },
      { href: "/parent/HireTutor", label: "Hire a Tutor", icon: BookIcon },
      {
        href: "/parent/recommendations/books",
        label: "Book Recommendations",
        icon: BookOpenIcon,
      },
    ],
    [parentId]
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState<string | null>(
    null
  );

  // Function to fetch notifications from the backend
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setLoadingNotifications(false);
      return [];
    }

    setLoadingNotifications(true);
    setErrorNotifications(null);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/message/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.notifications)) {
          const fetched = data.notifications.map((notif: Notification) => ({
            _id: notif._id,
            message: notif.message,
            timestamp: notif.timestamp,
            read: notif.read,
          }));
          setNotifications(fetched);
          return fetched;
        } else {
          console.warn(
            "API response for notifications is not an array or is missing 'notifications' property:",
            data
          );
          setNotifications([]);
          return [];
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch notifications.");
      }
    } catch (err: unknown) {
      console.error("Error fetching notifications:", err);
      let message = "Failed to load notifications.";
      if (err instanceof Error) {
        message = err.message;
      }
      setErrorNotifications(message);
      return [];
    } finally {
      setLoadingNotifications(false);
    }
  }, [token]);

  const markNotificationAsRead = async (id: string) => {
    if (!token) {
      alert(
        "Authentication token not found. Cannot mark notification as read."
      );
      return false;
    }
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }
      const res = await fetch(
        `${API_BASE_URL}/api/v1/message/notification/${id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        return true;
      } else {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to mark notification as read."
        );
      }
    } catch (err: unknown) {
      console.error("Error marking notification as read:", err);
      let message = "Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      alert(`Failed to mark notification as read: ${message}`);
      return false;
    }
  };

  // Fetch notifications on component mount and periodically
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    setProfile({});
    setToken("");
    router.push("/parent/signin");
    setIsMobileMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    if (parentId) {
      router.push(`/parent/${parentId}`);
    } else {
      // Fallback if parentId is not available
      router.push("/parent/profile");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-17 px-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Peenly"
            width={110}
            height={36}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation - Hidden on small screens */}
        <nav className="hidden md:flex items-center space-x-10">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center group"
              >
                <Icon
                  className={`w-5 h-5 mb-0.5 ${
                    active
                      ? "text-[#2F5FFF]"
                      : "text-gray-700 group-hover:text-[#2F5FFF]"
                  }`}
                />
                <span
                  className={`text-sm ${
                    active ? "text-[#2F5FFF] font-medium" : "text-gray-700"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile & Notifications - Hidden on small screens */}
        <div className="hidden md:flex relative items-center space-x-4">
          {/* Notification Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown((prev) => !prev)}
              className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 text-gray-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-2 max-h-96 overflow-y-auto">
                <h3 className="text-md font-semibold px-4 pb-2 border-b border-gray-200">
                  Notifications
                </h3>
                {loadingNotifications && (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    Loading notifications...
                  </p>
                )}
                {errorNotifications && (
                  <p className="text-center text-red-500 py-4 text-sm">
                    {errorNotifications}
                  </p>
                )}
                {!loadingNotifications &&
                !errorNotifications &&
                notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    No new notifications.
                  </p>
                ) : (
                  !loadingNotifications &&
                  !errorNotifications &&
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        n.read
                          ? "text-gray-600"
                          : "bg-blue-50 font-medium text-gray-800"
                      }`}
                      onClick={() => handleNotificationClick(n._id)}
                    >
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(n.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={profilePic}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  unoptimized
                />
              </div>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Menu Button - Visible only on small screens */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-700 hover:text-[#2F5FFF] focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center py-6 px-4 md:hidden">
          {/* Close button */}
          <div className="w-full flex justify-end mb-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-[#2F5FFF] focus:outline-none"
            >
              <IoMdClose size={28} />
            </button>
          </div>

          {/* Mobile Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
              <Image
                src={profilePic}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover"
                unoptimized
              />
            </div>
            <p className="font-semibold text-lg">
              {profile?.firstName || "Parent"}
            </p>
            <button
              onClick={handleProfileNavigation}
              className="text-sm text-[#2F5FFF] hover:underline mt-1"
            >
              View Profile
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col items-center space-y-6 w-full">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <Icon
                    className={`w-6 h-6 ${
                      active ? "text-[#2F5FFF]" : "text-gray-700"
                    }`}
                  />
                  <span
                    className={`text-lg ${
                      active ? "text-[#2F5FFF] font-medium" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="mt-auto w-full px-4 py-4">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// SVG Icons (unchanged)
function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.1a8.5 8.5 0 0 1 8.2 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function FilmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2.18"
        ry="2.18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 2v20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 2v20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
