"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ParentHeader from "@/components/parent-components/ParentHeader";

export default function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideHeaderRoutes = [
    "/parent/signup",
    "/parent/signin",
    "/parent/verify-otp",
    "/parent/register-parent-data",
    "/parent/forgot-password",
    "/parent/reset-password",
    "/parent/verify-code",
    "/parent/verify-parent-email",
    "/parent/verify-parent-email-otp",
    "/parent/verify-parent-account",
    "/parent/add-child-profile",
  ];

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <ParentHeader />}
      <main className={shouldShowHeader ? "pt-16" : ""}>{children}</main>
    </>
  );
}
