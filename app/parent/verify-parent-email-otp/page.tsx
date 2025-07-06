"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyParentEmailOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(179);
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("parentProfile") || "{}");
    if (stored.email) setEmail(stored.email);

    const id = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    try {
      await axios.post("http://167.71.131.143:3000/api/v1/auth/verify-email", {
        email,
        otp,
      });

      router.push("/parent/parent-profile");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid OTP or email");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center pt-12 px-4">
      {/* Logo */}
      <Image
        src="/assets/icons/Logo.svg"
        alt="Peenly Logo"
        width={120}
        height={40}
        className="mb-8"
      />

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-md px-6 py-8 text-center">
        <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the 6-digit code sent to
          <br />
          <span className="font-medium">{email}</span>
        </p>

        {/* OTP input */}
        <div>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="______"
            className={`w-full text-center text-lg font-medium px-4 py-3 rounded border outline-none transition ${
              error
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Code expires in{" "}
          <span className="font-semibold">{formatTime(timer)}</span>
        </p>

        <button
          onClick={handleVerify}
          className="btn-primary w-full mt-4"
          disabled={otp.length !== 6}
        >
          {otp.length !== 6 ? "Verify" : "Verify"}
        </button>

        <div className="flex justify-between text-sm text-[#2F5FFF] mt-3">
          <Link href="/parent/register-parent-data" className="hover:underline">
            Change email
          </Link>
          <button
            type="button"
            onClick={() => setTimer(179)}
            className="hover:underline"
          >
            Resend code
          </button>
        </div>
      </div>
    </main>
  );
}
