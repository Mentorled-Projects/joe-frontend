"use client"

import React from "react"
import Image from "next/image"
import { FaPlay } from "react-icons/fa"

const HeroSection = () => {
  return (
    <section className="bg-[#F4EEE5] py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
      
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 -mt-28">
          <p className="text-[#F39F5F] font-medium mb-2">
            Every Child’s Journey, Celebrated ✨
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B2C49] mb-4 leading-tight">
            Track Your Child’s <br /> Achievements, Growth <br /> & Memories
          </h1>
          <p className="text-[#4B5563] text-base md:text-lg mb-6">
            Peenly is a joyful, all-in-one platform that helps parents, tutors celebrate every milestone in a child’s life.
          </p>

          
          <div className="flex items-center gap-4 mb-4">
            <button className="bg-[#F39F5F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ec9c54] transition">
              Get Started Free
            </button>
            <button className="flex items-center text-[#0B2C49] font-semibold">
              <FaPlay className="mr-2 bg-[#F39F5F] text-white p-2 rounded-full w-8 h-8" />
              Play
            </button>
          </div>

          {/* Avatars */}
          <div className="flex items-center space-x-2">
           
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                src={`/assets/images/avatar${i}.jpg`} 
                alt={`Avatar ${i}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
            ))}
            <span className="text-sm text-[#4B5563] ml-2">Loved by 10K+ families</span>
          </div>
        </div>

        
        <div className="md:w-1/2 relative">
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
