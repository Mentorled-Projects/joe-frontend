"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { format, addDays, isSameDay, isToday } from "date-fns";

interface ScheduleModalProps {
  onClose: () => void;
  tutorName: string;
  onScheduleSuccess: () => void;
}

export default function ScheduleModal({
  onClose,
  tutorName,
  onScheduleSuccess,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 7 days starting from today
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  // Mock time slots (you might fetch these from tutor's availability later)
  const timeSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      // In a real app, you'd send this data to your backend
      console.log(
        `Scheduling session with ${tutorName} on ${format(
          selectedDate,
          "PPP"
        )} at ${selectedTime}`
      );
      onScheduleSuccess(); // Trigger success modal and navigation
    } else {
      alert("Please select both a date and a time.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Book a Session with {tutorName}
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Select a date and time that works for you. {tutorName} typically
          responds to booking requests within 24 hours.
        </p>

        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Select a date
          </h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
                  ${
                    selectedDate && isSameDay(day, selectedDate)
                      ? "bg-[#2F5FFF] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                  ${isToday(day) ? "border-2 border-[#2F5FFF]" : ""}
                `}
              >
                <span className="text-xs font-medium">
                  {format(day, "EEE")}
                </span>
                <span className="text-base font-bold">{format(day, "d")}</span>
                <span className="text-xs">{format(day, "MMM")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            What time works?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-md transition-colors duration-200
                  ${
                    selectedTime === time
                      ? "bg-[#2F5FFF] text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                  ${!selectedDate ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={!selectedDate} // Disable time selection if no date is chosen
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSchedule}
          disabled={!selectedDate || !selectedTime}
          className="w-full py-3 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
        >
          Schedule
        </button>
      </div>
    </div>
  );
}
