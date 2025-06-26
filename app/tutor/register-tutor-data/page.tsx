"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Step = 1 | 2;

export default function TutorRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [showDone, setShowDone] = useState(false);
  const router = useRouter();

  /* ─────────── handlers ─────────── */
  const nextStep = () => setStep((s) => (s === 1 ? 2 : s));
  const prevStep = () => setStep((s) => (s === 2 ? 1 : s));

  const finish = () => {
    setShowDone(true);
    setTimeout(() => router.push("/tutor/dashboard"), 2000);
  };

  /* ─────────── reusable UI bits ─────────── */
  const Circle = ({ active, done }: { active?: boolean; done?: boolean }) => (
    <div
      className={`w-6 h-6 rounded-full
        ${
          done
            ? "bg-[#2F5FFF]"
            : active
            ? "border-2 border-[#2F5FFF] bg-white"
            : "bg-gray-400/40"
        }`}
    >
      {done && (
        <svg className="w-6 h-6 text-white p-1" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4.0 4a1 1 0 001.414 0l8-8z"
          />
        </svg>
      )}
    </div>
  );

  const Line = () => <div className="w-px flex-1 bg-gray-300 mx-auto" />;

  /* ─────────── page ─────────── */
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* top bar */}
      <header className="h-14 flex items-center px-6 bg-white shadow-sm">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header>

      <div className="flex flex-1">
        {/* sidebar */}
        <aside className="w-60 bg-[#2F5FFF26] flex flex-col items-center py-10 space-y-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <Circle active={step === 1} done={step === 2} />
            <p className="text-xs mt-2">Complete Profile</p>
          </div>
          <Line />
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <Circle active={step === 2} done={false} />
            <p className="text-xs mt-2">Add Teaching Profile</p>
          </div>
          <Line />
          {/* Step 3 placeholder */}
          <div className="flex flex-col items-center opacity-40">
            <Circle />
            <p className="text-xs mt-2">Verify Account</p>
          </div>
        </aside>

        {/* form container */}
        <main className="flex-1 flex justify-center items-start py-10 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow p-8">
            {step === 1 ? (
              <>
                <h2 className="text-lg font-semibold mb-6">
                  Personal information
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input placeholder="First name" className="input" />
                  <input placeholder="Last name" className="input" />
                  <input
                    placeholder="Enter your email"
                    className="input col-span-1 md:col-span-2"
                  />
                  <select className="input">
                    <option value="">Select&nbsp;gender</option>
                  </select>
                  <select className="input">
                    <option value="">Select&nbsp;language</option>
                  </select>
                  <input placeholder="City/Town" className="input" />
                  <select className="input">
                    <option value="">Select&nbsp;country</option>
                  </select>
                  <input placeholder="dd/mm/yyyy" className="input" />
                </form>

                <div className="flex justify-end space-x-4 mt-8">
                  <button className="btn-outline" onClick={() => router.back()}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={nextStep}>
                    Next Step: Teaching Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-6">Teaching profile</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select className="input">
                    <option value="">Select&nbsp;category</option>
                  </select>
                  <select className="input">
                    <option value="">Select&nbsp;experience</option>
                  </select>
                  <select className="input">
                    <option value="">Select&nbsp;subject</option>
                  </select>
                  <select className="input">
                    <option value="">Select&nbsp;availability</option>
                  </select>
                </form>

                <div className="flex justify-end space-x-4 mt-8">
                  <button className="btn-outline" onClick={prevStep}>
                    Back
                  </button>
                  <button className="btn-primary" onClick={finish}>
                    Create Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* success modal */}
      {showDone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow p-10 text-center w-72">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2F5FFF] mx-auto mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                />
              </svg>
            </div>
            <p className="font-medium">Your profile has been created.</p>
          </div>
        </div>
      )}
    </div>
  );
}
