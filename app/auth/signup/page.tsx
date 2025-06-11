"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const SignUp = () => {
  const router = useRouter()
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Left Section */}
      <div className="w-full md:w-[502px] h-[500px] md:h-screen bg-[#2F5FFF] text-white flex flex-col justify-between px-6 md:px-10 py-8 md:py-12 relative">
        <div>
          <Image
            src="/assets/icons/Logo-white.svg"
            alt="Peenly Logo"
            width={120}
            height={40}
            className="mb-6 md:mb-10"
          />
          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-sm">
            Celebrate milestones and empower your children&apos;s journey.
          </p>
        </div>

        <div className="relative h-[200px] md:h-[280px] mt-6 md:mt-0">
          <Image
            src="/assets/images/kids-apple.svg"
            alt="Kids"
            width={380}
            height={260}
            className="rounded-[40px] object-cover absolute -top-16 md:-top-24"
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

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center flex-1 px-4 sm:px-6 md:px-12 py-10">
        <div className="text-center w-full max-w-xl">
          <h1 className="text-2xl font-bold text-[#0B2C49] mb-2">
            Welcome to Peenly
          </h1>
          <p className="text-[#4B5563] mb-10">
            Choose your role to begin your personalized journey
          </p>

          {/* Role Options */}
          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
              <Image
                src="/assets/images/ParentChild.svg"
                alt="Parent"
                width={80}
                height={80}
                className="mx-auto rounded-full mb-4"
              />
              <h3 className="font-semibold text-lg text-[#0B2C49]">
                Sign up as Parent
              </h3>
              <p className="text-sm text-[#4B5563] mb-4">
                Create a safe and inspiring space to document your child&apos;s growth and achievements.
              </p>
              <button
                onClick={() => router.push("/auth/parent-signup")}
                className="bg-[#2F5FFF] text-white font-medium text-sm px-4 py-2 rounded hover:bg-[#204fd4] w-full"
              >
                CONTINUE AS PARENT
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
              <Image
                src="/assets/images/Professional.svg"
                alt="Tutor"
                width={80}
                height={80}
                className="mx-auto rounded-full mb-4"
              />
              <h3 className="font-semibold text-lg text-[#0B2C49]">
                Sign up as Tutor
              </h3>
              <p className="text-sm text-[#4B5563] mb-4">
                Join Peenly to connect with eager young learners and showcase your teaching strengths.
              </p>
              <button className="bg-[#2F5FFF] text-white font-medium text-sm px-4 py-2 rounded hover:bg-[#204fd4] w-full">
                CONTINUE AS TUTOR
              </button>
            </div>
          </div>

          <p className="mt-8 text-sm text-[#4B5563]">
            Already have an account?{" "}
            <Link href="/auth/signin">
              <span className="text-[#2F5FFF] font-medium hover:underline cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default SignUp
