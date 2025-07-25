"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import TutorHeader from "@/components/tutor-components/TutorHeader";

export default function TutorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideHeaderRoutes = [
    "/tutor/signup",
    "/tutor/signin",
    "/tutor/verify-otp",
    "/tutor/forgot-password",
    "/tutor/reset-password",
    "/tutor/register-tutor-data",
    "/tutor/reset-password",
    "/tutor/verify-code",
    "/tutor/verify-tutor-account",
  ];

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <TutorHeader />}
      <main className={shouldShowHeader ? "pt-16" : ""}>{children}</main>
    </>
  );
}
