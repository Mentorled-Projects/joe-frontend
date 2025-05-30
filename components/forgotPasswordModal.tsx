"use client"

import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"

type Props = {
  onClose: () => void
}

const ForgotPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [show, setShow] = useState(false)

  useEffect(() => {
   
    setShow(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid UK phone number.")
      return
    }

    setError("")
    // API call 
    console.log("Sending reset to:", phone)
  }

  const handleClose = () => {
    setShow(false)
    setTimeout(() => onClose(), 300) 
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-xl text-gray-600"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold text-[#0B2C49] mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-5">
          Enter your registered phone number and we will send you a verification code
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <div className="flex gap-2">
              <div className="flex items-center text-sm px-4 py-2 rounded border border-[#D1D5DB] bg-white">
                +234 (NIG)
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (error) setError("")
                }}
                placeholder="Value"
                className="flex-1 px-4 py-2 text-sm border border-[#D1D5DB] rounded outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="w-full border border-[#2F5FFF] text-[#2F5FFF] py-2 rounded font-medium hover:bg-blue-50"
            >
              BACK
            </button>
            <button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
