import type { ReactNode } from "react";
import TutorHeader from "@/components/tutor-components/TutorHeader";

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TutorHeader />

      <main className="pt-16">{children}</main>
    </>
  );
}
