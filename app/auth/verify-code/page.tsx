"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const VerificationPage = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(179) // 2:59 in seconds

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec < 10 ? "0" + sec : sec}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const codeRegex = /^\d{6}$/
    if (!codeRegex.test(code)) {
      setError("Invalid code")
      return
    }

    setError("")
    console.log("Code is valid. Proceed to verify with API...")
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-start pt-12 px-4">
      {/* Logo */}
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
          <span className="font-medium">+44 7911 123456</span>
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
            Code expires in <span className="font-semibold">{formatTime(timer)}</span>
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
            <button type="button" onClick={() => setTimer(179)} className="hover:underline">
              Resend code
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default VerificationPage
