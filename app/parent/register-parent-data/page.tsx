"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterParentData() {
  const router = useRouter();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDone, setDone] = useState(false);

  const nigeriaCities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
  const ukCities = ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"];
  const currentCities = country === "Nigeria" ? nigeriaCities : ukCities;

  const validateEmail = (email: string) =>
    /^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(email);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!first) newErrors.first = "First name is required";
    if (!last) newErrors.last = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!country) newErrors.country = "Country is required";
    if (!city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateForm()) return;

    localStorage.setItem(
      "parentProfile",
      JSON.stringify({ first, last, email, country, city })
    );

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://167.71.131.143:3000/api/v1/auth/send-email-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      console.log("Email OTP Response:", res.status, data);

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          country: data.message || "Failed to send OTP",
        }));
        return;
      }

      setDone(true);
      setTimeout(() => router.push("/parent/verify-parent-email"), 3000);
    } catch (error) {
      console.error("Failed to send OTP", error);
      setErrors((prev) => ({
        ...prev,
        country: "Something went wrong. Try again.",
      }));
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <header className="h-14 flex items-center px-6 bg-white shadow-sm sticky top-0 z-10">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header>

      <main className="flex-1 flex justify-center items-start py-12 px-4">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow p-10">
          <h2 className="text-[22px] font-semibold mb-8">
            Personal information
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-sm">First Name</label>
              <input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="input-field"
              />
              {errors.first && (
                <p className="text-red-500 text-sm">{errors.first}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm">Last Name</label>
              <input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="input-field"
              />
              {errors.last && (
                <p className="text-red-500 text-sm">{errors.last}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm">Country</label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                className="input-field"
              >
                <option value="">Select</option>
                <option>Nigeria</option>
                <option>UK</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm">City/Town</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field"
              >
                <option value="">Select</option>
                {currentCities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
          </form>

          <div className="flex justify-end gap-4 mt-10">
            <button className="btn-outline" onClick={() => router.back()}>
              Cancel
            </button>
            <button className="btn-primary" onClick={saveProfile}>
              Create Profile
            </button>
          </div>
        </div>
      </main>

      {showDone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow p-10 text-center w-72">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2F5FFF] mx-auto mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                />
              </svg>
            </div>
            <p className="mb-3 font-medium">Please check your email for OTP</p>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 bg-[#2F5FFF] rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-2 h-2 bg-[#2F5FFF] rounded-full animate-bounce [animation-delay:0s]" />
              <span className="w-2 h-2 bg-[#dbeafe] rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
