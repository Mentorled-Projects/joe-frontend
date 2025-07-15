"use client";

import React from "react";
import Image from "next/image";

const features = [
  {
    title: "Interactive Learning",
    desc: "Progress trackers and achievements to motivate kids.",
    icon: "/assets/images/love-abc.svg",
  },
  {
    title: "Safe Social Networking for Kids",
    desc: "Privacy and digital safety, no exposure to strangers.",
    icon: "/assets/images/love-brain.svg",
  },
  {
    title: "Track milestones",
    desc: "Tools for parents to monitor progress.",
    icon: "/assets/images/love-paint.svg",
  },
  {
    title: "Get tutor",
    desc: "Easily get recommended tutor.",
    icon: "/assets/images/love-guitar.svg",
  },
];

const WhyLovePeenly = () => {
  return (
    <section
      className="py-20 px-6 md:px-16"
      style={{
        background: "linear-gradient(to right, #F7E8FF, #D0C1F7)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-[50%]">
          <div className="rounded-[60px] overflow-hidden shadow-md">
            <Image
              src="/assets/images/kids-apple.svg"
              alt="Kids smiling and learning"
              width={610}
              height={551}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full lg:w-[50%]">
          <h2 className="text-[#0B2C49] text-2xl md:text-3xl font-bold mb-8 text-center lg:text-left">
            Why Kids & Parents Love Peenly
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white/30 p-4 rounded-lg shadow-sm"
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={56}
                    height={56}
                  />
                </div>
                <div>
                  <h4 className="text-[#0B2C49] font-semibold mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[#4B5563] text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLovePeenly;
