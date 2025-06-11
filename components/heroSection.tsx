"use client"

import React from "react"
import Image from "next/image"
import { FaPlay } from "react-icons/fa"

const HeroSection = () => {
  return (
    <section className="bg-[#F4EEE5] py-10 md:py-20">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left Section */}
        <div className="w-full md:w-1/2 text-center md:text-left -mt-10 md:mt-0">
          <p className="text-[#F39F5F] font-medium mb-2 text-sm sm:text-base">
            Every Child’s Journey, Celebrated 
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B2C49] mb-4 leading-tight">
            Track Your Child’s <br /> Achievements, Growth <br /> & Memories
          </h1>
          <p className="text-[#4B5563] text-base sm:text-lg mb-6">
            Peenly is a joyful, all-in-one platform that helps parents and tutors celebrate every milestone in a child’s life.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-6">
            <button className="bg-[#F39F5F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ec9c54] transition">
              Get Started Free
            </button>
            <button className="flex items-center text-[#0B2C49] font-semibold">
              <FaPlay className="mr-2 bg-[#F39F5F] text-white p-2 rounded-full w-8 h-8" />
              Play
            </button>
          </div>

       
          <div className="flex items-center justify-center md:justify-start flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                src={`/assets/images/avatar${i}.svg`} 
                alt={`Avatar ${i}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
            ))}
            <span className="text-sm text-[#4B5563] ml-2">Loved by 10K+ families</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2">
          <Image
            src="/assets/images/download 1.svg"
            alt="Excited child holding certificate"
            width={629}
            height={826}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
