"use client";

import { useState } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FiTrash } from "react-icons/fi";
import Image from "next/image";

import { useChildStore } from "@/stores/useChildStores";
import { useParentStore } from "@/stores/useParentStores";
import { uploadFile } from "@/stores/uploadService"; // adjust path if needed

export default function ChildEducation() {
  const { childProfile, setChildProfile } = useChildStore();
  const { profile } = useParentStore(); // should have phoneNumber

  /* ------------ local modal state ------------ */
  const [showModal, setShowModal] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const [schoolName, setSchoolName] = useState("");
  const [certificate, setCertificate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ------------ helpers ------------ */
  const resetForm = () => {
    setSchoolName("");
    setCertificate("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setLogoFile(null);
    setLogoPreview(null);
    setErrors({});
    setEditingIdx(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (idx: number) => {
    const edu = childProfile.education?.[idx];
    if (!edu) return;
    setSchoolName(edu.schoolName);
    setCertificate(edu.certificate);
    setStartDate(edu.startDate);
    setEndDate(edu.endDate);
    setDescription(edu.description);
    setLogoPreview(edu.logo ?? null);
    setEditingIdx(idx);
    setShowModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!schoolName.trim()) e.schoolName = "School name is required";
    if (!certificate.trim()) e.certificate = "Certificate is required";
    if (!startDate) e.startDate = "Start date required";
    if (!endDate) e.endDate = "End date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEntry = async () => {
    if (!validate()) return;

    setUploading(true);
    try {
      /* 1. upload logo if changed or newly added */
      let logoUrl: string | null = logoPreview;
      const logoChanged = logoFile && !logoPreview?.startsWith("data:");
      if (logoFile && logoChanged && profile?.phoneNumber) {
        const res = await uploadFile(logoFile, profile.phoneNumber);
        logoUrl = res?.url || res;
      }

      const entry = {
        schoolName,
        certificate,
        startDate,
        endDate,
        description,
        logo: logoUrl,
      };

      let newArray = childProfile.education ?? [];
      if (editingIdx !== null) {
        newArray = newArray.map((e, i) => (i === editingIdx ? entry : e));
      } else {
        newArray = [...newArray, entry];
      }
      setChildProfile({ education: newArray });

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Save education failed:", err);
      alert("Failed to save education entry. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteEntry = (idx: number) => {
    const filtered = (childProfile.education ?? []).filter((_, i) => i !== idx);
    setChildProfile({ education: filtered });
  };

  const handleLogoSelect = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  /* ------------ component ------------ */
  return (
    <section className="max-w-5xl mx-auto bg-white rounded-lg shadow border border-gray-200 px-6 py-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <div className="flex gap-4">
          <button onClick={openAddModal} title="Add Education">
            <IoMdAdd size={22} className="text-gray-600 hover:text-black" />
          </button>
          <button onClick={() => setShowModal(true)} title="Edit Education">
            <MdEdit size={20} className="text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* List */}
      {(childProfile.education ?? []).map((edu, idx) => (
        <div
          key={idx}
          className="relative flex gap-4 mb-6 p-3 rounded hover:bg-gray-50"
        >
          {/* action icons */}
          <div className="absolute right-2 top-2 flex gap-2">
            <button onClick={() => openEditModal(idx)} title="Edit">
              <MdEdit size={16} className="text-gray-500 hover:text-black" />
            </button>
            <button onClick={() => deleteEntry(idx)} title="Delete">
              <FiTrash size={16} className="text-red-600 hover:text-red-800" />
            </button>
          </div>

          {/* logo */}
          {edu.logo ? (
            <Image
              src={edu.logo}
              alt="School Logo"
              width={60}
              height={60}
              className="rounded object-contain bg-white border p-1"
            />
          ) : (
            <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
              No Logo
            </div>
          )}

          {/* details */}
          <div>
            <h3 className="font-semibold">{edu.schoolName}</h3>
            <p className="text-sm text-gray-700">{edu.certificate}</p>
            <p className="text-sm text-gray-600">
              {edu.startDate} – {edu.endDate}
            </p>
            <div className="text-sm text-gray-800 whitespace-pre-line mt-2">
              {edu.description}
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {editingIdx !== null ? "Edit Education" : "Add Education"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className={`p-3 border rounded-lg w-full ${
                    errors.schoolName && "border-red-500"
                  }`}
                />
                {errors.schoolName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.schoolName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Certificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className={`p-3 border rounded-lg w-full ${
                    errors.certificate && "border-red-500"
                  }`}
                />
                {errors.certificate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.certificate}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`p-3 border rounded-lg w-full ${
                    errors.startDate && "border-red-500"
                  }`}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`p-3 border rounded-lg w-full ${
                    errors.endDate && "border-red-500"
                  }`}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <textarea
              placeholder="Activities, achievements, and notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 mt-4 border rounded-lg"
              rows={4}
            />

            {/* Logo uploader */}
            <label className="block mt-4 p-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 text-sm text-gray-700">
              {logoPreview ? (
                <span>Change Logo</span>
              ) : (
                "Choose School Logo (optional)"
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoSelect(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {logoPreview && (
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={80}
                height={80}
                className="mt-2 rounded object-contain border"
              />
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={saveEntry}
                disabled={uploading}
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
