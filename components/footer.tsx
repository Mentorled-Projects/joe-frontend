"use client"

import React from "react"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-[#F1F4F8CC] py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        <div className="flex flex-col items-start gap-4">
          <Image
            src="/assets/icons/Logo.svg" 
            alt="Peenly Logo"
            width={100}
            height={40}
          />
        </div>

        
        <div className="flex flex-col gap-1 text-sm text-[#111827]">
          <h4 className="font-semibold mb-2">Navigation</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Advertising</a>
          <a href="#">Small Business</a>
        </div>

   
        <div className="flex flex-col gap-1 text-sm text-[#111827]">
          <h4 className="font-semibold mb-2 invisible">Spacer</h4>
          <a href="#">Talent Solutions</a>
          <a href="#">Marketing Solutions</a>
          <a href="#">Sales Solutions</a>
          <a href="#">Safety Center</a>
          <a href="#">Community Guidelines</a>
          <a href="#">Privacy & Terms</a>
          <a href="#">Mobile App</a>
        </div>

        
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Fast access</h4>
            <button className="w-full flex justify-between items-center bg-[#0077B5] text-white font-medium py-2 px-4 rounded">
              QUESTIONS?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16h.01M12 12a2 2 0 10-2-2" />
              </svg>
            </button>
            <button className="w-full flex justify-between items-center border border-[#0077B5] text-[#0077B5] font-medium py-2 px-4 rounded mt-3">
              SETTINGS
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 008.6 15a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 0012 8.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 15z" />
              </svg>
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Language</h4>
            <select className="w-full border px-4 py-2 rounded text-sm">
              <option>ENGLISH</option>
              <option>FRENCH</option>
              <option>SPANISH</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
