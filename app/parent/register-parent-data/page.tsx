"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParentStore } from "@/stores/useParentStores";

export default function RegisterParentData() {
  const router = useRouter();
  const { setProfile, token } = useParentStore();

  const [step, setStep] = useState(1);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmailState] = useState("");

  const [relationship, setRelationship] = useState("");
  const [religion, setReligion] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDone, setDone] = useState(false);

  const nigeriaCities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
  const ukCities = ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"];
  const currentCities = country === "Nigeria" ? nigeriaCities : ukCities;

  const validateEmail = (email: string) =>
    /^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(email);

  const validateStep1 = () => {
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

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!relationship) newErrors.relationship = "Relationship is required";
    if (!religion) newErrors.religion = "Religion is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!language) newErrors.language = "Preferred language is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setProfile({ firstName: first, lastName: last, email });
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setProfile({
      firstName: first,
      lastName: last,
      email,
      country,
      city,
      relationship,
      religion,
      dateOfBirth,
      gender,
      language,
    });

    if (!token) {
      console.error("No authentication token found. Please log in first.");
      setErrors((prev) => ({
        ...prev,
        apiError: "Authentication required. Please log in again.",
      }));

      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Completing profile with token:", token);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/guardian/complete-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            firstName: first,
            lastName: last,
            country,
            city,
            relationship,
            religion,
            dateOfBirth,
            gender,
            language,
          }),
        }
      );

      const data = await res.json();
      console.log("Complete Profile Response:", res.status, data);

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          apiError: data.message || "Something went wrong. Try again.", // Use apiError for general API messages
        }));
        return;
      }

      setDone(true);
      setTimeout(() => router.push("/parent/verify-parent-email"), 3000);
    } catch (error) {
      console.error("Failed to complete profile", error);
      setErrors((prev) => ({
        ...prev,
        apiError:
          "Something went wrong. Please check your network and try again.", // Use apiError
      }));
    }
  };

  const renderStep1 = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          {errors.last && <p className="text-red-500 text-sm">{errors.last}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmailState(e.target.value)}
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
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-10">
        <button className="btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block mb-2 text-sm">Relationship with Child</label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="input-field"
          >
            <option value="">Select</option>
            <option>Mother</option>
            <option>Father</option>
            <option>Guardian</option>
            <option>Other</option>
          </select>
          {errors.relationship && (
            <p className="text-red-500 text-sm">{errors.relationship}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm">Religion</label>
          <select
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            className="input-field"
          >
            <option value="">Select</option>
            <option>Christianity</option>
            <option>Islam</option>
            <option>Buddhism</option>
            <option>Jew</option>
            <option>Traditional</option>
            <option>Other</option>
          </select>
          {errors.religion && (
            <p className="text-red-500 text-sm">{errors.religion}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
          >
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm">Preferred Language</label>
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          />
          {errors.language && (
            <p className="text-red-500 text-sm">{errors.language}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="input-field"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10">
        <button className="btn-outline" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="btn-primary" onClick={handleSubmit}>
          Complete Profile
        </button>
      </div>
    </>
  );

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
            {step === 1 ? "Personal Information" : "More About You"}
          </h2>
          {step === 1 ? renderStep1() : renderStep2()}
          {errors.apiError && ( // Display general API errors
            <p className="text-red-500 text-sm mt-4 text-center">
              {errors.apiError}
            </p>
          )}
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
            <p className="mb-3 font-medium">Completing Profile</p>
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
