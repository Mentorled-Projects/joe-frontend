"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useParentStore } from "@/stores/useParentStores";
import { useChildStore } from "@/stores/useChildStores";
import { useEffect, useState } from "react";

// SVG Icons
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
      />
      <path
        d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"
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
      />
      <path
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z"
        stroke="currentColor"
        strokeWidth="2"
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

// Hamburger Icon
function HamburgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  );
}

// Close Icon (for mobile menu)
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  );
}

// Logout Icon (simple placeholder for now)
function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}

export default function ChildHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { childProfile, setChildProfile } = useChildStore();
  const { profile } = useParentStore();
  const childId = childProfile?.childId || childProfile?._id;

  console.log("Child Header Rendered", profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [childProfilePic, setChildProfilePic] = useState(
    "/assets/images/kiddp.svg"
  );

  useEffect(() => {
    const storedPic = localStorage.getItem("childAvatar");
    if (storedPic) {
      setChildProfilePic(storedPic);
    }
  }, []);

  // Navigation links for the child profile
  const navLinks = [
    { href: `/child/home/${childId}`, label: "Home", icon: HomeIcon },
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
    { href: `/child/${childId}`, label: "Profile", icon: UserIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    setChildProfile({});

    // Use the parent's _id, or "default" as fallback
    const parentId = profile?.data?._id;
    router.push(`/parent/${parentId}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-17 px-4 sm:px-6">
        <Link href="/child/home">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Peenly"
            width={110}
            height={36}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
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

        {/* Desktop Avatar and Dropdown (hidden on small screens) */}
        <div className="relative hidden md:flex items-center space-x-4">
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
                Parent Profile
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon (visible on small screens, moved to far right) */}
        <button
          className="md:hidden p-2 text-gray-700 focus:outline-none ml-auto" // ml-auto pushes it to the right
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button for mobile menu */}
            <button
              className="self-end p-2 text-gray-700 focus:outline-none mb-6"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              <CloseIcon />
            </button>

            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2F5FFF]">
                <Image
                  src={childProfilePic}
                  alt="Child Profile"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {childProfile.firstName || "Child"}
              </span>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-6">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center space-x-3 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        active
                          ? "text-[#2F5FFF]"
                          : "text-gray-700 group-hover:text-[#2F5FFF]"
                      }`}
                    />
                    <span
                      className={`text-base ${
                        active ? "text-[#2F5FFF] font-medium" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
              {/* Logout Link in Mobile Nav */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false); // Close menu after logout
                }}
                className="flex items-center space-x-3 group text-red-600 hover:text-red-700 transition-colors duration-200 text-left py-2"
              >
                <LogoutIcon className="w-6 h-6" />
                <span className="text-base">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
