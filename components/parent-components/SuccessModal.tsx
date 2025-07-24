"use client";

import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

interface SuccessModalProps {
  onClose: () => void;
  message: string;
}

export default function SuccessModal({ onClose, message }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs relative p-6 text-center">
        <div className="flex justify-center mb-4">
          <IoCheckmarkCircleOutline size={60} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600 text-sm mb-4">
          Your action was successful.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}
