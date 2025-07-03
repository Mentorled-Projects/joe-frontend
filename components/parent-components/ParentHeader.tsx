"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/parent/home", label: "Home", icon: HomeIcon },
  { href: "/parent/hire", label: "Hire a Tutor", icon: BookIcon },
  {
    href: "/parent/recommendations",
    label: "Recommendations",
    icon: UsersIcon,
  },
  { href: "/parent/messages", label: "Messages", icon: MessageIcon },
  { href: "/parent/parent-profile", label: "Profile", icon: UserIcon },
];

export default function ParentHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl flex items-center h-16 px-6">
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

        <nav className="ml-auto flex items-center space-x-10">
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

        {/* Right Icons (Notifications, Profile Pic) */}
        <div className="ml-6 flex items-center space-x-4">
          <BellIcon className="w-5 h-5 text-gray-600 hover:text-[#2F5FFF] cursor-pointer" />
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/assets/images/avatar.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 10L12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

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

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M23 21v-2a4 4 0 0 0-3-3.87"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="2"
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
