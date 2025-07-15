"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useParentStore } from "@/stores/useParentStores";

export default function VerifyParentEmail() {
  const router = useRouter();
  const { profile } = useParentStore();
  const email = profile?.email || "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Completing profile with token:", token);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/send-email-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        router.push("/parent/verify-parent-email-otp");
      }, 1000);
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <header className="h-14 flex items-center px-6 bg-white shadow-sm sticky top-0 z-10">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header>

      <main className="flex-1 flex justify-center items-center px-4 py-16">
        <div className="bg-white w-full max-w-xl rounded-xl shadow p-10 text-center">
          <h2 className="text-[22px] font-semibold mb-4">Verify Your Email</h2>
          <p className="mb-2 text-gray-700">
            Check your inbox for a verification code sent to:
          </p>
          <p className="font-medium text-[#2F5FFF] break-words mb-4">{email}</p>
          <p className="text-sm text-gray-500 mb-6">
            Can’t find the email? Please check your <strong>spam folder</strong>
            .
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={sendOTP}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                <span className="w-2 h-2 bg-[#dbeafe] rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            ) : (
              "Verify Email"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
