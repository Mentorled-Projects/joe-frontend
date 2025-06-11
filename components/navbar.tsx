"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { HiOutlineMenu, HiX } from "react-icons/hi"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="relative bg-[#F4EEE5] z-10">
      <div className="absolute top-0 left-0 w-full z-20">
        <Image
          src="/assets/images/shape-img.svg"
          alt="Scallop wave"
          width={1440}
          height={72}
          className="w-full h-auto"
        />
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-4 pt-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Peenly logo"
            width={90}
            height={90}
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-md font-medium text-[#7d8a9a]">
          <a href="#" className="text-black font-semibold">Home</a>
          <a href="#">Marketplace</a>
          <a href="#">Tutor</a>
          <a href="#">Recommendation</a>
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:block">
          <Link href="/auth/signup">
            <button className="bg-[#F39F5F] text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-[#ec9c54] transition">
              Login/Sign up
            </button>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <HiX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-4 text-[#0B2C49] font-medium mt-4 bg-[#fff5e9] p-4 rounded-lg shadow">
            <a href="#" className="text-black">Home</a>
            <a href="#">Marketplace</a>
            <a href="#">Tutor</a>
            <a href="#">Recommendation</a>
            <Link href="/auth/signup">
              <button className="bg-[#F39F5F] text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-[#ec9c54] transition w-full">
                Login/Sign up
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
