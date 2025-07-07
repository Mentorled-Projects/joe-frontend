"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Step = 1 | 2;
type Errs = Record<string, string>;

export default function TutorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [showDone, setShowDone] = useState(false);

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLang] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");

  const [category, setCat] = useState("");
  const [experience, setExp] = useState("");
  const [subject, setSub] = useState("");
  const [availability, setAvail] = useState("");

  const [errors1, setErr1] = useState<Errs>({});
  const [errors2, setErr2] = useState<Errs>({});

  const nigeriaCities = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"];
  const ukCities = ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"];
  const currentCities = country === "Nigeria" ? nigeriaCities : ukCities;

  const languages = [
    "English",
    "Spanish",
    "French",
    "Arabic",
    "Yoruba",
    "Other",
  ];
  const categories = [
    "Early Childhood",
    "Primary",
    "Secondary",
    "Special Needs",
  ];
  const subjects = ["Maths", "English", "Science", "History", "Geography"];
  const availabilities = [
    "Once a week",
    "Twice a week",
    "Weekends",
    "Evenings",
  ];
  const experiences = ["Beginner", "Intermediate", "Advanced"];

  const validateStep1 = () => {
    const e: Errs = {};
    if (!firstName) e.firstName = "Required";
    if (!lastName) e.lastName = "Required";
    if (!email) e.email = "Required";
    if (!gender) e.gender = "Choose one";
    if (!language) e.language = "Required";
    if (!city) e.city = "Required";
    if (!country) e.country = "Required";
    if (!dob) e.dob = "Required";
    setErr1(e);
    return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e: Errs = {};
    if (!category) e.category = "Required";
    if (!experience) e.experience = "Required";
    if (!subject) e.subject = "Required";
    if (!availability) e.availability = "Required";
    setErr2(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => validateStep1() && setStep(2);
  const prevStep = () => setStep(1);
  const finish = () => {
    if (!validateStep2()) return;
    setShowDone(true);
    setTimeout(() => router.push("/tutor/profile"), 2000);
  };

  const Circle = ({ active, done }: { active?: boolean; done?: boolean }) => (
    <div
      className={`w-9 h-9 rounded-full ${
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
  const Line = () => <div className="w-px h-16 bg-gray-300 mx-auto" />;

  return (
    <div className="min-h-screen pt-14 flex flex-col bg-[#F5F5F5]">
      <header className="h-14 flex items-center px-6 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header>

      <div className="flex flex-1">
        <aside className="w-80 bg-[#2F5FFF26] flex flex-col items-center py-10 space-y-6">
          <div className="flex flex-col items-center">
            <Circle active={step === 1} done={step === 2} />
            <p className="text-xs mt-2">Complete Profile</p>
          </div>
          <Line />
          <div className="flex flex-col items-center">
            <Circle active={step === 2} />
            <p className="text-xs mt-2">Add Teaching Profile</p>
          </div>
          <Line />
          <div className="flex flex-col items-center opacity-40">
            <Circle />
            <p className="text-xs mt-2">Verify Account</p>
          </div>
        </aside>

        <main className="flex-1 flex justify-center items-start py-10 px-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow p-10">
            {step === 1 ? (
              <>
                <h2 className="text-[22px] font-semibold mb-8">
                  Personal information
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup
                    label="First Name"
                    value={firstName}
                    setValue={setFirst}
                    error={errors1.firstName}
                  />
                  <FormGroup
                    label="Last Name"
                    value={lastName}
                    setValue={setLast}
                    error={errors1.lastName}
                  />

                  <FormGroup
                    label="Email"
                    type="email"
                    value={email}
                    setValue={setEmail}
                    error={errors1.email}
                  />
                  <SelectGroup
                    label="Gender"
                    value={gender}
                    setValue={setGender}
                    options={["Male", "Female", "Other"]}
                    error={errors1.gender}
                  />
                  {/* language / city */}
                  <SelectGroup
                    label="Primary language"
                    value={language}
                    setValue={setLang}
                    options={languages}
                    error={errors1.language}
                  />
                  <SelectGroup
                    label="City/Town"
                    value={city}
                    setValue={setCity}
                    options={currentCities}
                    error={errors1.city}
                  />
                  {/* country / dob */}
                  <SelectGroup
                    label="Country of Residence"
                    value={country}
                    setValue={(v) => {
                      setCountry(v);
                      setCity("");
                    }}
                    options={["Nigeria", "UK"]}
                    error={errors1.country}
                  />
                  <FormGroup
                    label="Date of birth"
                    type="date"
                    value={dob}
                    setValue={setDob}
                    error={errors1.dob}
                  />
                </form>

                <FooterButtons
                  backAction={() => router.back()}
                  nextText="Next Step: Teaching Profile"
                  nextAction={nextStep}
                />
              </>
            ) : (
              <>
                <h2 className="text-[22px] font-semibold mb-8">
                  Teaching profile
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectGroup
                    label="Teaching Category"
                    value={category}
                    setValue={setCat}
                    options={categories}
                    error={errors2.category}
                  />
                  <SelectGroup
                    label="Experience"
                    value={experience}
                    setValue={setExp}
                    options={experiences}
                    error={errors2.experience}
                  />
                  <SelectGroup
                    label="Subject"
                    value={subject}
                    setValue={setSub}
                    options={subjects}
                    error={errors2.subject}
                  />
                  <SelectGroup
                    label="Availability"
                    value={availability}
                    setValue={setAvail}
                    options={availabilities}
                    error={errors2.availability}
                  />
                </form>

                <FooterButtons
                  backAction={prevStep}
                  nextText="Create Profile"
                  nextAction={finish}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {showDone && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow p-10 text-center w-72">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2F5FFF] mx-auto mb-4">
              <svg className="w-7 h-7 text-white" viewBox="0 0 20 20">
                <path
                  fill="currentColor"
                  d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                />
              </svg>
            </div>
            <p className="font-medium">Your profile has been created.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FormGroup({
  label,
  type = "text",
  value,
  setValue,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  setValue: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[16px] mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-field"
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
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[16px] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input-field"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
function FooterButtons({
  backAction,
  nextText,
  nextAction,
}: {
  backAction: () => void;
  nextText: string;
  nextAction: () => void;
}) {
  return (
    <div className="flex justify-end space-x-4 mt-10">
      <button className="btn-outline" onClick={backAction}>
        Cancel
      </button>
      <button className="btn-primary" onClick={nextAction}>
        {nextText}
      </button>
    </div>
  );
}
