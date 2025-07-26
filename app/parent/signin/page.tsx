"use client";

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ForgotPasswordModal from "@/components/forgotPasswordModal";
import { useParentStore } from "@/stores/useParentStores"; // Import useParentStore

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+234");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setToken, setProfile, profile } = useParentStore();

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
    setLoading(true); // Set loading to true when submission starts

    const formattedPhone = phone.startsWith("0")
      ? `${countryCode}${phone.slice(1)}`
      : phone.startsWith(countryCode.replace("+", ""))
      ? `+${phone}`
      : `${countryCode}${phone}`;

    try {
      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          phoneNumber: formattedPhone,
          password,
        }
      );

      const token = loginResponse?.data?.token;

      if (!token) {
        throw new Error("Login successful but no token received.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("phoneNumber", formattedPhone);
      setToken(token); // Set the token in Zustand

      // Try to get the user profile to obtain the parent ID
      try {
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/guardian/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userProfile = profileResponse?.data?.profile;

        if (userProfile?._id) {
          // Store the profile with the ID
          setProfile(userProfile);
          // Route to the dynamic parent profile page
          router.push(`/parent/${userProfile._id}`);
        } else {
          console.warn(
            "Profile data found but no ID. Checking localStorage..."
          );
          // Fallback: check if we have an ID in localStorage
          const storedProfile = JSON.parse(
            localStorage.getItem("parentProfile") || "{}"
          );
          if (storedProfile._id) {
            setProfile({ _id: storedProfile._id });
            router.push(`/parent/${storedProfile._id}`);
          } else if (profile?._id) {
            // Use existing profile ID from store
            router.push(`/parent/${profile._id}`);
          } else {
            // If no ID is available anywhere, redirect to profile setup
            console.warn("No parent ID found, redirecting to profile setup");
            router.push("/parent/register-parent-data");
          }
        }
      } catch (profileErr) {
        console.warn("Could not fetch profile after login:", profileErr);
        // Fallback routing logic if profile fetch fails
        const storedProfile = JSON.parse(
          localStorage.getItem("parentProfile") || "{}"
        );
        if (storedProfile._id) {
          setProfile({ _id: storedProfile._id });
          router.push(`/parent/${storedProfile._id}`);
        } else if (profile?._id) {
          router.push(`/parent/${profile._id}`);
        } else {
          // If all else fails, redirect to profile setup
          router.push("/parent/register-parent-data");
        }
      }
    } catch (err: unknown) {
      console.error("Login failed:", err);

      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Invalid credentials. Please try again."
        );
      } else {
        setError("Login failed. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}

      <main className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F5]">
        {/* Left Section - Visible on larger screens, hidden on small screens */}
        <div className="hidden md:flex md:w-[502px] h-screen bg-[#2F5FFF] text-white flex-col justify-between px-10 py-12">
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

        {/* Right Section - Main Content */}
        <div className="flex flex-1 justify-center items-center px-6 pt-[60px] md:py-12">
          <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-[652px] h-auto">
            <h2 className="text-2xl font-bold text-[#0B2C49] mb-6 text-center md:text-left">
              Sign in
            </h2>

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
                className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" // Added flex, items-center, justify-center for loader
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "SIGN IN"
                )}
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-center text-sm mt-2 gap-3 sm:gap-0">
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
