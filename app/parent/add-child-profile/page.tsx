"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParentStore } from "@/stores/useParentStores";
import { useChildStore } from "@/stores/useChildStores";
import Image from "next/image";

function FormGroup({
  label,
  type = "text",
  value,
  setValue,
  error,
  placeholder,
  optional = false,
}: {
  label: string;
  type?: string;
  value: string;
  setValue: (v: string) => void;
  error?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-[16px] font-medium mb-2">
        {label}{" "}
        {optional && <span className="text-gray-500 text-sm">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function SelectGroup({
  label,
  value,
  setValue,
  options,
  error,
  placeholder = "Select",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[16px] font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Custom MultiSelectGroup component for dropdown with checkboxes
function MultiSelectGroup({
  label,
  value, // This will be an array of selected strings
  setValue, // This will update the array of selected strings
  options,
  error,
  placeholder = "Select",
}: {
  label: string;
  value: string[];
  setValue: (v: string[]) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    if (value.includes(option)) {
      setValue(value.filter((item) => item !== option));
    } else {
      setValue([...value, option]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-[16px] font-medium mb-2">{label}</label>
      <div
        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5FFF] cursor-pointer flex justify-between items-center"
        onClick={handleToggle}
      >
        {value.length > 0 ? value.join(", ") : placeholder}
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                readOnly // Make it read-only as clicks are handled by the div
                className="mr-2 h-4 w-4 text-[#2F5FFF] rounded focus:ring-[#2F5FFF]"
              />
              {option}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function FooterButtons({
  backAction,
  nextText,
  nextAction,
  showBackButton = true,
}: {
  backAction: () => void;
  nextText: string;
  nextAction: () => void;
  showBackButton?: boolean;
}) {
  return (
    <div className="flex justify-end space-x-4 mt-10">
      {showBackButton && (
        <button
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          onClick={backAction}
        >
          Back
        </button>
      )}
      <button
        className="px-6 py-2 bg-[#2F5FFF] text-white rounded-md hover:bg-[#1d46ff] transition-colors duration-200"
        onClick={nextAction}
      >
        {nextText}
      </button>
    </div>
  );
}

function Circle({ active, done }: { active?: boolean; done?: boolean }) {
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ${
        done
          ? "bg-[#2F5FFF]"
          : active
          ? "border-2 border-[#2F5FFF] bg-white"
          : "bg-gray-400/40"
      }`}
    >
      {done && (
        <svg className="w-9 h-9 text-white p-[5px]" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
          />
        </svg>
      )}
    </div>
  );
}

function Line() {
  return <div className="w-px h-16 bg-gray-300 mx-auto" />;
}

export default function AddChildProfilePage() {
  const router = useRouter();
  const { childProfile, setChildProfile } = useChildStore();
  const { token, setProfile } = useParentStore();

  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const [form, setForm] = useState({
    firstName: childProfile.firstName || "",
    lastName: childProfile.lastName || "",
    middleName: childProfile.middleName || "",
    gender: childProfile.gender || "",
    dob: childProfile.dateOfBirth || "",
    schoolName: childProfile.schoolName || "",
    schoolClass: childProfile.Class || "",
    favoriteSubjects: childProfile.favoriteSubjects || [], // Initialize as array
    interests: childProfile.interests || [], // Initialize as array
    sports: childProfile.sports || [], // Initialize as array
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string | string[]) => {
    setForm({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};
    if (currentStep === 1) {
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
      if (!form.gender) newErrors.gender = "Gender is required";
      if (!form.dob) newErrors.dob = "Date of birth is required";
    } else if (currentStep === 2) {
      if (!form.schoolName) newErrors.schoolName = "School name is required";
      if (!form.schoolClass) newErrors.schoolClass = "Class is required";
      // Favorite subjects are optional, no validation needed here.
    } else if (currentStep === 3) {
      if (form.interests.length === 0)
        newErrors.interests = "At least one interest is required";
      if (form.sports.length === 0)
        newErrors.sports = "At least one sport/game is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      submitProfile();
    }
  };

  const submitProfile = async () => {
    // Update childProfile store with current form data
    setChildProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName,
      gender: form.gender,
      dateOfBirth: form.dob,
      schoolName: form.schoolName,
      Class: form.schoolClass,
      favoriteSubjects: form.favoriteSubjects, // Sent as array
      interests: form.interests, // Sent as array
      sports: form.sports, // Sent as array
    });

    setCreating(true);
    setErrors({});

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not defined in environment variables."
        );
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/child/add-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          middleName: form.middleName,
          gender: form.gender,
          dateOfBirth: form.dob,
          schoolName: form.schoolName,
          Class: form.schoolClass,
          favoriteSubjects: form.favoriteSubjects, // Sent as array
          interests: form.interests, // Sent as array
          sports: form.sports, // Sent as array
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const childId = data.child?._id;

        if (childId) {
          setProfile({ childId });
          setChildProfile({ childId });
          setTimeout(() => {
            setCreating(false);
            setCreated(true);
            setTimeout(() => {
              router.push(`/child/${childId}`);
            }, 2000);
          }, 2000);
        }
      } else {
        const errorData = await res.json();
        setErrors({
          apiError:
            errorData.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err: unknown) {
      setCreating(false);
      let message = "Something went wrong. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      setErrors({ apiError: message });
    }
  };

  const genders = ["Male", "Female", "Other"];
  const schoolYears = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Year 6",
    "Year 7",
    "Year 8",
    "Year 9",
    "Year 10",
    "Year 11",
    "Year 12",
    "Year 13",
  ];
  const interestsOptions = [
    "Drawing",
    "Reading",
    "Coding",
    "Music",
    "Crafts",
    "Gaming",
    "Science",
    "Nature",
  ];
  const sportsOptions = [
    "Football",
    "Basketball",
    "Tennis",
    "Swimming",
    "Athletics",
    "Cycling",
    "Martial Arts",
  ];
  const favoriteSubjectsOptions = [
    "Maths",
    "English",
    "Science",
    "History",
    "Geography",
    "Art",
    "Music",
    "Computer Science",
  ];

  const progressSteps = [
    "Complete Profile",
    "Verify Account",
    "Add Child's Profile",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <header className="h-14 flex items-center px-6 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header>

      {/* Main content area, adjusted for mobile responsiveness */}
      <div className="flex flex-1 mt-14 flex-col md:flex-row">
        {/* Sidebar Progress - Hidden on small screens, shown on medium and up */}
        <aside className="hidden md:flex md:w-80 bg-white flex-col items-center py-10 space-y-6">
          <h2 className="text-[22px] font-semibold mb-8">Child Profile</h2>

          {progressSteps.map((label, index) => (
            <div key={label} className="flex flex-col items-center">
              <Circle active={index === 2} done={index < 2} />
              <p className={`text-xs mt-2 ${index === 2 ? "" : "opacity-40"}`}>
                {label}
              </p>
              {index < progressSteps.length - 1 && <Line />}
            </div>
          ))}
        </aside>

        {/* Main Content - Takes full width on small screens, flex-1 on medium and up */}
        <main className="flex-1 flex justify-center items-start py-10 px-4 md:px-8">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow p-6 sm:p-8 md:p-10">
            <h2 className="text-[22px] font-semibold mb-8 text-center md:text-left">
              {step === 1 && "Child Bio"}
              {step === 2 && "Child School"}
              {step === 3 && "Child Interest & Hobbies"}
            </h2>

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <FormGroup
                  label="First Name"
                  placeholder="Child's first name"
                  value={form.firstName}
                  setValue={(v) => handleChange("firstName", v)}
                  error={errors.firstName}
                />
                <FormGroup
                  label="Last Name"
                  placeholder="Child's last name"
                  value={form.lastName}
                  setValue={(v) => handleChange("lastName", v)}
                  error={errors.lastName}
                />
                <FormGroup
                  label="Middle Name"
                  placeholder="Child's middle name"
                  value={form.middleName}
                  setValue={(v) => handleChange("middleName", v)}
                  optional={true}
                />
                <SelectGroup
                  label="Gender"
                  placeholder="Select Child's gender"
                  value={form.gender}
                  setValue={(v) => handleChange("gender", v)}
                  options={genders}
                  error={errors.gender}
                />
                <div className="md:col-span-2">
                  {" "}
                  {/* This ensures it spans 2 columns on md and up */}
                  <FormGroup
                    label="Date of birth"
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={form.dob}
                    setValue={(v) => handleChange("dob", v)}
                    error={errors.dob}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <FormGroup
                  label="School name"
                  placeholder="Child's school name"
                  value={form.schoolName}
                  setValue={(v) => handleChange("schoolName", v)}
                  error={errors.schoolName}
                />
                <SelectGroup
                  label="Year/Class"
                  placeholder="Select class"
                  value={form.schoolClass}
                  setValue={(v) => handleChange("schoolClass", v)}
                  options={schoolYears}
                  error={errors.schoolClass}
                />
                <div className="md:col-span-2">
                  <MultiSelectGroup // Using MultiSelectGroup
                    label="Favorite subjects"
                    placeholder="Select favorite"
                    value={form.favoriteSubjects}
                    setValue={(v) => handleChange("favoriteSubjects", v)}
                    options={favoriteSubjectsOptions}
                    error={errors.favoriteSubjects}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <MultiSelectGroup // Using MultiSelectGroup
                  label="Interests"
                  placeholder="Select interest"
                  value={form.interests}
                  setValue={(v) => handleChange("interests", v)}
                  options={interestsOptions}
                  error={errors.interests}
                />
                <MultiSelectGroup // Using MultiSelectGroup
                  label="Favorite sports/games"
                  placeholder="Select"
                  value={form.sports}
                  setValue={(v) => handleChange("sports", v)}
                  options={sportsOptions}
                  error={errors.sports}
                />
              </div>
            )}

            {errors.apiError && (
              <p className="text-red-500 text-sm mt-4 text-center md:text-left">
                {errors.apiError}
              </p>
            )}

            <FooterButtons
              backAction={() => (step > 1 ? setStep(step - 1) : router.back())}
              nextText={
                step === 1
                  ? "Next Step: Child School Info"
                  : step === 2
                  ? "Next Step: Add Child interest"
                  : "Create Profile"
              }
              nextAction={nextStep}
              showBackButton={true}
            />
          </div>
        </main>
      </div>

      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl px-10 py-8 text-center shadow-lg w-full max-w-[300px] h-[250px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Creating profile...</p>
          </div>
        </div>
      )}

      {created && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl px-10 py-8 text-center shadow-lg w-full max-w-[300px] h-[250px] flex flex-col items-center justify-center">
            <div className="text-white bg-[#2F5FFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <p className="text-lg font-semibold">Profile Created!</p>
          </div>
        </div>
      )}
    </div>
  );
}
