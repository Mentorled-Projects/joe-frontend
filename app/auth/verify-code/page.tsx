"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import useSound from "use-sound";
import { useWindowSize } from "@react-hook/window-size";

const VerificationPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(179);
  const [phone, setPhone] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const [playConfettiSound] = useSound("/assets/sounds/confetti.mp3");

  const router = useRouter();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedPhone) {
      setPhone(storedPhone);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      setError("Invalid code");
      return;
    }

    try {
      const response = await axios.post(
        "http://167.71.131.143:3000/api/v1/auth/verify-otp",
        {
          phoneNumber: phone,
          otp: code,
        }
      );

      console.log("OTP verified:", response.data);

      setShowConfetti(true);
      playConfettiSound();

      setTimeout(() => {
        setShowConfetti(false);
        router.push("/dashboard");
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Verify-OTP backend message:", err.response?.data);
        setError(err.response?.data?.message || "Invalid OTP or phone number");
      } else {
        console.error("Unexpected error:", err);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-start pt-12 px-4 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.5}
          colors={["#2F5FFF", "#F39F5F", "#0B2C49", "#F4EEE5", "#FFD700"]}
        />
      )}

      <div className="mb-8">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly Logo"
          width={120}
          height={40}
        />
      </div>

      {/* Card */}
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
              placeholder="______"
              maxLength={6}
              className={`w-full text-center text-lg font-medium px-4 py-3 rounded border outline-none transition ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
            <Link href="/auth/parent-signup" className="hover:underline">
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

export default VerificationPage;
