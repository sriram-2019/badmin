"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";

const API_URL = "http://127.0.0.1:8000/api/registrations/";

// Define the shape of our form data
interface FormData {
  name: string;
  age: string;
  dob: string;
  gender: string;
  state: string;
  district: string;
  level: string; // National / State / District
  email: string;
  phone_no: string;
  address: string;
  event: string; // still keep event = "Badminton"
}

interface StatusData {
  type: "success" | "error" | "";
  text: string;
}

export default function RegisterUserTailwind() {
  const [form, setForm] = useState<FormData>({
    name: "",
    age: "",
    dob: "",
    gender: "",
    state: "",
    district: "",
    level: "",
    email: "",
    phone_no: "",
    address: "",
    event: "Badminton",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusData>({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onChooseFileClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return clearFile();

    if (!["image/jpeg", "image/jpg"].includes(f.type)) {
      setStatus({ type: "error", text: "Only JPG files allowed." });
      return;
    }

    if (f.size > MAX_BYTES) {
      setStatus({ type: "error", text: "File too large (max 2MB)." });
      return;
    }

    setFile(f);
    setStatus({ type: "", text: "" });

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Name is required.";
    if (!form.age.trim()) return "Age is required.";
    if (!form.dob.trim()) return "Date of birth is required.";
    if (!form.gender.trim()) return "Gender is required.";
    if (!form.state.trim()) return "State is required.";
    if (!form.level.trim()) return "Level of playing is required.";
    if (!form.email.trim()) return "Email ID is required.";
    if (!form.phone_no.trim()) return "Contact number is required.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    const err = validate();
    if (err) {
      setStatus({ type: "error", text: err });
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("document", file);

    try {
      setLoading(true);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {}

      if (res.ok) {
        setStatus({ type: "success", text: "Registration successful!" });
        setForm({
          name: "",
          age: "",
          dob: "",
          gender: "",
          state: "",
          district: "",
          level: "",
          email: "",
          phone_no: "",
          address: "",
          event: "Badminton",
        });
        clearFile();
      } else {
        setStatus({
          type: "error",
          text: json ? JSON.stringify(json) : "Server error",
        });
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        text: "Network error: " + (err?.message || String(err)),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto p-8 bg-gray-50 rounded-xl shadow-2xl border-2 border-gray-300">
        <h3 className="text-3xl font-bold mb-6 text-blue-900 text-center">
          Badminton Registration
        </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-blue-900">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        {/* Age & DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-blue-900">Age</label>
            <input
              name="age"
              value={form.age}
              type="number"
              onChange={handleChange}
              className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Age"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">Date of Birth</label>
            <input
              name="dob"
              value={form.dob}
              type="date"
              onChange={handleChange}
              className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-blue-900">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* State & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-blue-900">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="State"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-blue-900">District</label>
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="District"
            />
          </div>
        </div>

        {/* Level of playing */}
        <div>
          <label className="text-sm font-medium text-blue-900">
            Level of Playing
          </label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
          >
            <option value="">Select</option>
            <option value="National">National</option>
            <option value="State">State</option>
            <option value="District">District</option>
          </select>
        </div>

        {/* Email ID */}
        <div>
          <label className="text-sm font-medium text-blue-900">Email ID</label>
          <input
            name="email"
            value={form.email}
            type="email"
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="text-sm font-medium text-blue-900">Contact Number</label>
          <input
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="9876543210"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-blue-900">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full rounded border-2 border-blue-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="Full postal address"
            rows={3}
          />
        </div>

        {/* JPG Upload: hidden input + styled button */}
        <div>
          <label className="text-sm font-medium text-blue-900">
            Upload JPG Proof (optional)
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={handleFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={onChooseFileClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
            >
              {file ? "Change File" : "Choose File"}
            </button>

            <div className="flex items-center gap-3">
              {file && (
                <div className="text-sm text-gray-700">
                  {file.name}
                </div>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              )}
              {file && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-red-600 text-sm ml-2"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 shadow-md transition-all duration-200 font-semibold"
          >
            {loading ? "Saving..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                age: "",
                dob: "",
                gender: "",
                state: "",
                district: "",
                level: "",
                email: "",
                phone_no: "",
                address: "",
                event: "Badminton",
              });
              clearFile();
              setStatus({ type: "", text: "" });
            }}
            className="px-6 py-2 rounded-lg border-2 border-blue-400 text-blue-700 hover:bg-blue-50 transition-all duration-200 font-semibold"
          >
            Clear
          </button>
        </div>

        {status.text && (
          <div
            className={`mt-3 p-3 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.text}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
