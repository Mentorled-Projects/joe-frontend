"use client";

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ForgotPasswordModal from "@/components/forgotPasswordModal";
import { useParentStore } from "@/stores/useParentStores";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+234"); // Default to Nigeria

  const router = useRouter();
  const { setToken } = useParentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    const formattedPhone = phone.startsWith("0")
      ? `${countryCode}${phone.slice(1)}`
      : phone.startsWith(countryCode.replace("+", ""))
      ? `+${phone}`
      : `${countryCode}${phone}`;

    try {
      const response = await axios.post(
        "http://167.71.131.143:3000/api/v1/auth/login",
        {
          phoneNumber: formattedPhone,
          password,
        }
      );

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("phoneNumber", formattedPhone);
        setToken(token);
      }

      router.push("/parent-profile");
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}

      <main className="flex min-h-screen bg-[#F5F5F5]">
        <div className="w-[502px] h-screen bg-[#2F5FFF] text-white flex flex-col justify-between px-10 py-12">
          <div>
            <Image
              src="/assets/icons/Logo-white.svg"
              alt="Peenly Logo"
              width={120}
              height={40}
              className="mb-10"
            />
            <p className="text-xl font-medium">Welcome to Peenly 👋</p>
          </div>
          <div className="relative h-[280px]">
            <Image
              src="/assets/images/kids-apple.svg"
              alt="Kids"
              width={380}
              height={260}
              className="rounded-[40px] object-cover absolute -top-34"
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

        <div className="flex flex-1 justify-center items-center px-6 pt-[60px]">
          <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-[652px] h-auto">
            <h2 className="text-2xl font-bold text-[#0B2C49] mb-6">Sign in</h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="text-sm px-4 py-2 rounded border border-[#D1D5DB] bg-white"
                  >
                    <option value="+234">+234 (NIG)</option>
                    <option value="+44">+44 (UK)</option>
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
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
                className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
              >
                SIGN IN
              </button>

              <div className="flex justify-between items-center text-sm mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#2F5FFF]" />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#2F5FFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <p className="text-sm text-center mt-6">
                New to Peenly?{" "}
                <Link
                  href="/auth/signup"
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
};

export default SignInPage;
