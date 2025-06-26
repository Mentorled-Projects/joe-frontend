"use client";

import { useState, useEffect } from "react";

const KEY = "acceptingStudents";

export default function StudentAcceptanceStatus() {
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    if (v) setAccepting(v === "true");
  }, []);

  const toggle = () => {
    const next = !accepting;
    setAccepting(next);
    localStorage.setItem(KEY, String(next));
  };

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm mb-4">
      <div className="flex items-center justify-between px-6 py-8">
        <div>
          <h3 className="text-xl font-semibold mb-1">
            Student Acceptance Status
          </h3>
          <p className="text-sm text-gray-500">
            {accepting
              ? "Currently accepting new students"
              : "Not accepting new students"}
          </p>
        </div>

        {/* toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={accepting}
            onChange={toggle}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2F5FFF] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>
    </section>
  );
}
