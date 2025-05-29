"use client"

import React from "react"
import Image from "next/image"

const features = [
  {
    title: "Create Your Profile",
    description:
      "Parents create a safe profile for their child. Choose interests, age, and goals.",
    icon: "/assets/images/ABC.svg",
  },
  {
    title: "Track & Celebrate",
    description: "Upload artworks, grades, achievements",
    icon: "/assets/images/Track.svg",
  },
  {
    title: "Learn",
    description:
      "Access fun games, quizzes, and educational tools tailored to your child&apos;s level and passions.",
    icon: "/assets/images/learn.svg",
  },
  {
    title: "Share & Celebrate",
    description:
      "Showcase progress with family or close friends and earn badges for their journey!",
    icon: "/assets/images/share.svg",
  },
]

const HowItWorks = () => {
  return (
    <section className="bg-[#E7E5E5] py-30 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B2C49] mb-2">
          How Peenly Works
        </h2>
        <p className="text-[#4B5563] mb-16">
          Empowering your child&apos;s growth in 4 joyful steps!
        </p>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={295}
                  height={109}
                />
              </div>
              <h3 className="text-[#0B2C49] text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-[#4B5563] text-sm max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
