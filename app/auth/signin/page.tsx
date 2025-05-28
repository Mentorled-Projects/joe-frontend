"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
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
        <div className="relative">
          <Image
            src="/assets/images/kids-apple.svg"
            alt="Kids"
            width={380}
            height={260}
            className="rounded-[40px] object-cover"
          />
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 justify-center items-center px-6">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#0B2C49] mb-6">Sign in</h2>

          <form className="space-y-5">
            {/* Phone input */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone number</label>
              <div className="flex border rounded px-2 py-2 items-center">
                <select className="text-sm border-none outline-none bg-transparent pr-2">
                  <option>+234 (NG)</option>
                  <option>+44 (UK)</option>
                  <option>+1 (US)</option>
                </select>
                <input
                  type="tel"
                  placeholder="Enter your number"
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full border rounded px-3 py-2 text-sm pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-sm text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
            >
              SIGN IN
            </button>

            {/* Options */}
            <div className="flex justify-between items-center text-sm mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#2F5FFF]" />
                Keep me signed in
              </label>
              <Link href="#" className="text-[#2F5FFF] hover:underline">
                Forgot password ?
              </Link>
            </div>

            {/* Footer */}
            <p className="text-sm text-center mt-6">
              New to Peenly?{" "}
              <Link href="/auth/signup" className="text-[#2F5FFF] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

export default SignInPage
