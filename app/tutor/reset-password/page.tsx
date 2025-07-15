"use client";

import { useEffect, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber");
    const storedOtp = localStorage.getItem("otp");

    if (storedPhone) setPhone(storedPhone);
    if (storedOtp) setOtp(storedOtp);
  }, []);

  useEffect(() => {
    setCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const allValid = Object.values(criteria).every(Boolean);
    if (!allValid) {
      setError("Password does not meet all requirements.");
      return;
    }

    try {
      setError("");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password`,
        {
          phoneNumber: phone,
          otp,
          newPassword: password,
        }
      );

      //show success modal
      router.push("/auth/reset-success");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly Logo"
          width={120}
          height={40}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md w-full max-w-md px-6 py-8">
        <h2 className="text-xl font-bold text-center mb-4">
          Create new password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm pr-10"
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm pr-10"
                placeholder="********"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Password Rules */}
          <ul className="text-sm mt-2 space-y-1 text-gray-700">
            <li className={criteria.length ? "text-blue-600" : "text-gray-400"}>
              At least 8 characters
            </li>
            <li
              className={criteria.uppercase ? "text-blue-600" : "text-gray-400"}
            >
              At least one uppercase letter
            </li>
            <li className={criteria.number ? "text-blue-600" : "text-gray-400"}>
              At least one number
            </li>
            <li
              className={criteria.special ? "text-blue-600" : "text-gray-400"}
            >
              At least one special character
            </li>
          </ul>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#2F5FFF] text-white py-2 mt-4 rounded font-medium hover:bg-[#204fd4]"
          >
            NEXT
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
