"use client";

import ChildAbout from "@/components/child-components/ChildAbout";
import ChildEducation from "@/components/child-components/ChildEducation";
import ChildHeadline from "@/components/child-components/ChildHeadline";
import ChildInterests from "@/components/child-components/ChildInterests";
import ChildMilestones from "@/components/child-components/ChildMilestone";
import ChildProfileHeader from "@/components/child-components/ChildProfileHeader";

export default function ChildProfilePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <ChildProfileHeader />
      <ChildHeadline />
      <ChildAbout />
      <ChildMilestones />
      <ChildEducation />
      <ChildInterests />
    </div>
  );
}
