"use client";

import React from "react";

interface Props {
  progressStep: number;
}

const steps = ["Complete Profile", "Verify Account", "Add Child's Profile"];

export default function ParentProgressCard({ progressStep }: Props) {
  return (
    <div className="max-w-5xl mx-auto h-66 mt-2 grid grid-cols-1 md:grid-cols-10 gap-6">
      <div className="bg-white p-14 rounded-xl shadow col-span-1 md:col-span-7 items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">
          You&apos;re Almost There!
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          You&apos;ve signed up. Let&apos;s complete your profile to begin
          building your child&apos;s journey.
        </p>

        <div className="flex items-start justify-between relative">
          {steps.map((label, index) => {
            const isDone = index < progressStep;
            const isActive = index === progressStep;

            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center flex-1 z-10">
                  <Circle active={isActive} done={isDone} />
                  <p className="text-xs mt-2 text-center">{label}</p>
                </div>
                {index < steps.length - 1 && <Line done={isDone} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow col-span-1 md:col-span-3 flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold mb-2">Recommendation</h2>
        <span className="text-4xl">🧸</span>
        <h3 className="text-l">No Recommendation</h3>
      </div>
    </div>
  );
}

function Circle({ active, done }: { active?: boolean; done?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center
        ${
          done
            ? "bg-[#2F5FFF] text-white"
            : active
            ? "border-2 border-[#2F5FFF] bg-white"
            : "bg-gray-300"
        }`}
    >
      {done && (
        <svg className="w-5 h-5 text-white" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
          />
        </svg>
      )}
    </div>
  );
}

function Line({ done }: { done?: boolean }) {
  return (
    <div
      className={`flex-1 h-1 mt-4 mx-[-18px] z-0
        ${done ? "bg-[#2F5FFF]" : "bg-gray-300"}`}
    />
  );
}
