"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { useParentStore } from "@/stores/useParentStores";

const documents = [
  {
    label: "Driver's License",
    value: "driver's license",
    image: "/assets/images/licenseImage.svg",
  },
  {
    label: "Passport",
    value: "passport",
    image: "/assets/images/passportPlaceholder.svg",
  },
  {
    label: "National ID",
    value: "national id",
    image: "/assets/images/NationalID.svg",
  },
  {
    label: "Other",
    value: "other",
    image: "/assets/images/Other.svg",
  },
];

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
  return <div className="w-px h-28 bg-gray-400 mx-auto" />;
}

export default function VerifyParentAccount() {
  const router = useRouter();
  const { setProfile } = useParentStore();

  const [selected, setSelected] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [progressStep, setProgressStep] = useState(1);

  const steps = ["Complete Profile", "Verify Account", "Add Child's Profile"];

  const handleSelect = (docType: string) => {
    setSelected(docType);
    setProfile({ verificationDocumentType: docType });
    setShowUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size < 5 * 1024 * 1024) {
      setFile(f);
    } else {
      alert("File too large. Max size: 5MB");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setShowUploadModal(false);
    setShowSuccessModal(true);
    setProgressStep(2);

    setTimeout(() => {
      setShowSuccessModal(false);
      router.push("/parent/add-child-profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* <header className="h-14 flex items-center px-6 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <Image
          src="/assets/icons/Logo.svg"
          alt="Peenly"
          width={100}
          height={32}
        />
      </header> */}

      <div className="flex flex-1">
        <aside className="w-80 bg-white flex flex-col items-center py-10 space-y-6">
          <h2 className="text-[22px] font-semibold mb-8">Verify Identity</h2>

          {steps.map((label, index) => (
            <div key={label} className="flex flex-col items-center">
              <Circle
                active={progressStep === index}
                done={progressStep > index}
              />
              <p
                className={`text-xs mt-2 mb-3 ${
                  progressStep < index ? "opacity-40" : ""
                }`}
              >
                {label}
              </p>
              {index < steps.length - 1 && <Line />}
            </div>
          ))}
        </aside>

        <main className="flex-1 flex justify-center items-start py-10 px-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow p-10">
            <h3 className="text-lg font-semibold mb-5">Select your document</h3>

            <div className="flex flex-col space-y-4">
              {documents.map((doc) => (
                <button
                  key={doc.value}
                  onClick={() => handleSelect(doc.value)}
                  className="border rounded-lg p-4  flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div>
                    <p className="font-medium">{doc.label}</p>
                    <p className="text-sm text-green-600">
                      Issued by a government agency
                    </p>
                  </div>
                  <Image
                    src={doc.image}
                    alt={doc.label}
                    width={100}
                    height={60}
                  />
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                disabled={!file}
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors duration-200"
              onClick={() => setShowUploadModal(false)}
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-2 capitalize">
              Upload Your {selected}
            </h2>
            <p className="text-sm mb-6">
              Make sure it’s clear and includes both front and back if required.
            </p>
            <label className="block border-2 border-dashed border-purple-300 rounded-xl p-10 text-center bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors duration-200">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <MdCloudUpload size={48} className="mx-auto mb-2 text-gray-600" />
              <p className="text-gray-700">
                Click to upload or drag and drop
                <br />
                <span className="text-xs">PNG, JPG or PDF (max 5MB)</span>
              </p>
            </label>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-sm px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                disabled={!file}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white rounded-2xl px-16 py-12 text-center shadow-xl w-[400px] h-[300px] flex flex-col items-center justify-center">
            <div className="text-white w-20 h-20 rounded-full bg-blue-600 text-5xl flex items-center justify-center mb-4">
              ✓
            </div>
            <p className="text-lg font-semibold">File Uploaded!</p>
          </div>
        </div>
      )}
    </div>
  );
}
