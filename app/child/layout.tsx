"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ChildHeader from "@/components/child-components/ChildHeader";

export default function ChildLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideHeaderRoutes = [
    "/child/child-progress",
    "/child/child-messages",
    "/child/child-recommendations",
    "/child/child-hire-tutor",
  ];

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <ChildHeader />}
      <main className={shouldShowHeader ? "pt-16" : ""}>{children}</main>
    </>
  );
}
