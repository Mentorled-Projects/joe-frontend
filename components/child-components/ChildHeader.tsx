"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParentStore } from "@/stores/useParentStores";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChildStore } from "@/stores/useChildStores";

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12h6v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeLinecap="round"
        strokeLinejoin="round"
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

// Navigation links for the child profile
const navLinks = [
  { href: "/child/home", label: "Home", icon: HomeIcon },
  {
    href: "/child/recommendations/movies",
    label: "Movie Recommendations",
    icon: FilmIcon,
  },
  {
    href: "/child/recommendations/books",
    label: "Book Recommendations",
    icon: BookOpenIcon,
  },
  { href: "/child/child-profile", label: "Profile", icon: UserIcon },
];

export default function ChildHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { childProfile, setChildProfile } = useChildStore();
  const { setToken: setParentToken, setProfile: setParentProfile } =
    useParentStore(); // Get setToken and setProfile from parent store

  const childProfilePic = childProfile?.image || "/assets/images/avatar.png";

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    setParentProfile({}); // Clear parent profile data
    setParentToken(""); // Clear parent token

    setChildProfile({}); // Clear child profile data

    // Redirect to the parent's page (e.g., parent dashboard or sign-in)
    router.push("/parent/parent-profile");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-17 px-6">
        <Link href="/child/home">
          {" "}
          <Image
            src="/assets/icons/Logo.svg"
            alt="Peenly"
            width={110}
            height={36}
            priority
            className="cursor-pointer"
          />
        </Link>

        <nav className="flex items-center space-x-10">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
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

        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-[#2F5FFF] transition-colors duration-200">
                <Image
                  src={childProfilePic}
                  alt="Child Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
