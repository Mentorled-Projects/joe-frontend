"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ForgotPasswordModal from "@/components/forgotPasswordModal";

export default function ParentSignInPage() {
  const router = useRouter();

  const [countryCode, setCountryCode] = useState("+234"); // default
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{9,11}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true); // Set loading to true when submission starts
    const fullPhone = `${countryCode}${phone.replace(/^0/, "")}`;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        { phoneNumber: fullPhone, password }
      );
      localStorage.setItem("token", data.token);
      // Assuming the login response for parent also returns an 'id'
      const parentId = data.id;
      if (parentId) {
        router.push(`/parent/${parentId}`); // Navigate to the dynamic parent profile page
      } else {
        setError("Login successful, but parent ID not found in response.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false when submission finishes
    }
  };

  return (
    <>
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}

      <main className="flex min-h-screen bg-[#F5F5F5]">
        {/* LEFT BLUE PANEL - Hidden on small screens, block on medium and larger */}
        <div className="hidden md:flex w-[502px] h-screen bg-[#2F5FFF] text-white flex-col justify-between px-10 py-12">
          <div>
            <Image
              src="/assets/icons/Logo-white.svg"
              alt="Peenly Logo"
              width={120}
              height={40}
              className="mb-10"
            />
            <p className="text-xl font-medium">Welcome to Peenly Parent 👋</p>
          </div>
          <div className="relative h-[280px]">
            <Image
              src="/assets/images/kids-apple.svg"
              alt="Kids"
              width={380}
              height={260}
              className="rounded-[40px] object-cover absolute -top-32"
            />
            <Image
              src="/assets/images/pencil-1.svg"
              alt="Pencil"
              width={24}
              height={24}
              className="absolute top-0 left-0"
            />
          </div>
        </div>

        {/* RIGHT WHITE PANEL - Takes full width on small screens */}
        <div className="flex flex-1 justify-center items-center px-6 pt-[60px] w-full">
          <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-[652px]">
            <h2 className="text-2xl font-bold text-[#0B2C49] mb-6">Sign in</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-4 py-2 text-sm border border-[#D1D5DB] rounded bg-white"
                  >
                    <option value="+234">+234&nbsp;(NIG)</option>
                    <option value="+44">+44&nbsp;(UK)</option>
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your number"
                    className="flex-1 px-4 py-2 text-sm border border-[#D1D5DB] rounded outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="********"
                    className="w-full border border-[#D1D5DB] rounded px-4 py-2 text-sm pr-10 outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </button>

              <div className="flex justify-between items-center text-sm mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#2F5FFF]" />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[#2F5FFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <p className="text-sm text-center mt-6">
                New to Peenly?{" "}
                <Link
                  href="/parent/signup"
                  className="text-[#2F5FFF] font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
