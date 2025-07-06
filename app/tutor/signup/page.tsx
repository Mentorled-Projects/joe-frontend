"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

const TutorSignUpPage = () => {
  const [countryCode, setCountryCode] = useState("+234"); // default: Nigeria
  const [phone, setPhone] = useState("");
  const [password, setPwd] = useState("");
  const [showPwd, setShow] = useState(false);
  const [errors, setErr] = useState("");

  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();

  useEffect(() => {
    setCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*-]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10,11}$/; // checks only local number
    if (!phoneRegex.test(phone)) {
      setErr("Please enter a valid phone number.");
      return;
    }

    if (!Object.values(criteria).every(Boolean)) {
      setErr("Password does not meet all requirements.");
      return;
    }

    setErr("");
    const fullPhone = countryCode + phone.trim();

    try {
      await axios.post(
        "http://167.71.131.143:3000/api/v1/auth/register-tutor",
        { phoneNumber: fullPhone, password }
      );

      localStorage.setItem("phoneNumber", fullPhone);
      router.push("/tutor/verify-code");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErr(
          err.response?.data?.message ??
            "Registration failed. Please try again."
        );
      } else {
        setErr("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F5]">
      <div className="hidden md:flex w-[502px] h-screen bg-[#2F5FFF] text-white flex-col justify-between px-10 py-12">
        <Image
          src="/assets/icons/Logo-white.svg"
          alt="Peenly Logo"
          width={120}
          height={40}
        />
        <div>
          <div className="relative h-[280px]">
            <Image
              src="/assets/images/tutor-apple.svg"
              alt="Educator"
              width={380}
              height={260}
              className="rounded-[40px] object-cover absolute top-14"
            />
            <Image
              src="/assets/images/pencil-1.svg"
              alt="Pencil"
              width={44}
              height={44}
              className="absolute top-22 left-0"
            />
          </div>
          <p className="text-xl font-medium mt-[170px]">
            Empowering educators. Connecting with families
          </p>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center px-4 sm:px-6 pt-[40px] sm:pt-[60px]">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-[600px] mx-auto">
          <h2 className="text-2xl font-bold text-[#0B2C49] mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-2 py-2 text-sm border border-[#D1D5DB] rounded bg-white"
                >
                  <option value="+234">+234&nbsp;(Nig)</option>
                  <option value="+44">+44&nbsp;(UK)</option>
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2 text-sm border border-[#D1D5DB] rounded outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="********"
                  className="w-full border border-[#D1D5DB] rounded px-4 py-2 text-sm pr-10 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPwd)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPwd ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>

              {/* CHECKLIST */}
              <ul className="text-sm mt-3 space-y-1">
                <li
                  className={
                    criteria.length ? "text-green-600" : "text-gray-400"
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    criteria.uppercase ? "text-green-600" : "text-gray-400"
                  }
                >
                  At least one uppercase letter
                </li>
                <li
                  className={
                    criteria.number ? "text-green-600" : "text-gray-400"
                  }
                >
                  At least one number
                </li>
                <li
                  className={
                    criteria.special ? "text-green-600" : "text-gray-400"
                  }
                >
                  At least one special character
                </li>
              </ul>
            </div>

            {errors && <p className="text-red-500 text-sm">{errors}</p>}

            <button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
            >
              SIGN UP
            </button>

            {/* CHECKBOXES & TERMS */}
            <div className="space-y-2 text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#2F5FFF]" />
                Keep me logged in
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="accent-[#2F5FFF] mt-1" />
                By continuing, you agree to&nbsp;
                <Link href="#" className="text-[#2F5FFF] hover:underline">
                  Peenly’s Terms of Service
                </Link>
                &nbsp;and&nbsp;
                <Link href="#" className="text-[#2F5FFF] hover:underline">
                  policy
                </Link>
              </label>
            </div>

            {/* SIGN-IN LINK */}
            <p className="text-sm text-center mt-6">
              Already on Peenly?{" "}
              <Link
                href="/tutor/signin"
                className="text-[#2F5FFF] font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default TutorSignUpPage;
