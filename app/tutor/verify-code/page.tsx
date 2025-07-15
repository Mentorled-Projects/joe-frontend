"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const TutorVerifyCodePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [timer, setTimer] = useState(179);
  const [phone, setPhone] = useState("");

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("phoneNumber");
    if (stored) setPhone(stored);

    const id = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Invalid code");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-otp`,
        {
          phoneNumber: phone,
          otp: code,
        }
      );

      setError("");
      setOk("Verification successful! Redirecting…");
      setTimeout(() => router.push("/tutor/register-tutor-data"), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid OTP or phone number");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center pt-12 px-4">
      <Image
        src="/assets/icons/Logo.svg"
        alt="Peenly"
        width={120}
        height={40}
        className="mb-8"
      />

      <div className="bg-white rounded-xl shadow-md w-full max-w-md px-6 py-8 text-center">
        <h2 className="text-xl font-bold mb-2">Enter verification code</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the 6-digit code sent to <br />
          <span className="font-medium">{phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="______"
              className={`w-full text-center text-lg font-medium px-4 py-3 rounded border outline-none transition ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {ok && <p className="text-green-600 text-sm mt-1">{ok}</p>}
          </div>

          <p className="text-sm text-gray-500">
            Code expires in{" "}
            <span className="font-semibold">{formatTime(timer)}</span>
          </p>

          <button
            type="submit"
            className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
          >
            ENTER
          </button>

          <div className="flex justify-between text-sm text-[#2F5FFF] mt-2">
            <Link href="/tutor/signup" className="hover:underline">
              Change phone number
            </Link>
            <button
              type="button"
              onClick={() => setTimer(179)}
              className="hover:underline"
            >
              Resend code
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TutorVerifyCodePage;
