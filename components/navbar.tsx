"use client"
import Image from "next/image"
import React from "react"
import Link from "next/link"

const Navbar = () => {
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

   \
      <div className="relative z-30 max-w-7xl mx-auto px-4 pt-[30px] flex items-center justify-between">

        <div className="flex items-center space-x-2">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Peenly logo"
            width={90}
            height={90}
          />
        </div>

        
        <nav className="space-x-6 text-md font-medium text-[#7d8a9a]">
          <a href="#" className="text-black font-semibold">Home</a>
          <a href="#">Marketplace</a>
          <a href="#">Tutor</a>
          <a href="#">Recommendation</a>
        </nav>

        
     <Link href="/auth/signup" passHref>
  <button className="bg-[#F39F5F] text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-[#ec9c54] transition">
    Login/Sign up
  </button>
</Link>
      </div>
    </header>
  )
}

export default Navbar
