"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";

type Props = {
  phone: string;
  onClose: () => void;
  onSuccess: () => void;
};

const VerifyOTPModal: React.FC<Props> = ({ phone, onClose, onSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(179);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      setError("Please input correct code");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://167.71.131.143:3000/api/v1/auth/resend-otp", {
        phoneNumber: `+234${phone}`,
        otp: code,
      });

      onSuccess();
    } catch {
      setError("Please input correct code");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-600"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-bold text-center mb-2">
          Enter verification code
        </h2>
        <p className="text-sm text-center text-gray-600 mb-5">
          Enter the 6-digit code sent to <br />
          <span className="font-medium">+234 {phone}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              className={`w-full text-center text-lg font-medium px-4 py-3 rounded border outline-none transition ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300"
              }`}
              placeholder="______"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
            )}
          </div>

          <p className="text-sm text-center text-gray-500">
            Code expires in{" "}
            <span className="font-semibold">{formatTime(timer)}</span>
          </p>

          <div className="flex justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-[#2F5FFF] text-[#2F5FFF] py-2 rounded font-medium hover:bg-blue-50"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white py-2 rounded font-medium hover:bg-[#204fd4]"
              disabled={loading}
            >
              {loading ? "Verifying..." : "VERIFY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPModal;
