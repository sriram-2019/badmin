"use client";

import React, { useState, useRef } from "react";

// Use env var in prod, fall back to localhost for dev
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/registrations/";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    event: "Badminton", // Event Name field (editable)
    phone_no: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_BYTES = 2 * 1024 * 1024; // 2MB

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onChooseFileClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
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

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.phone_no.trim()) return "Phone number required.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    const err = validate();
    if (err) {
      setStatus({ type: "error", text: err });
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (file) fd.append("document", file);

    try {
      setLoading(true);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      const text = await res.text();
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {}

      if (res.ok) {
        setStatus({ type: "success", text: "Registration successful!" });
        setForm({
          name: "",
          age: "",
          gender: "",
          event: "Badminton",
          phone_no: "",
        });
        clearFile();
      } else {
        setStatus({
          type: "error",
          text = typeof json === "object" && json !== null
            ? JSON.stringify(json)
            : "Server error",
        });
      }
    } catch (err: any) {
      setStatus({ type: "error", text: "Network error: " + err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h3 className="text-2xl font-semibold mb-4">Badminton Registration</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 p-2"
            placeholder="Enter your name"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Age</label>
            <input
              name="age"
              value={form.age}
              type="number"
              onChange={handleChange}
              className="mt-1 w-full rounded border-gray-300 p-2"
              placeholder="Age"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded border-gray-300 p-2"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Event Name */}
        <div>
          <label className="text-sm font-medium">Event Name</label>
          <input
            name="event"
            value={form.event}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 p-2"
            placeholder="Event name (e.g. Badminton)"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            name="phone_no"
            value={form.phone_no}
            onChange={handleChange}
            className="mt-1 w-full rounded border-gray-300 p-2"
            placeholder="9876543210"
          />
        </div>

        {/* JPG Upload */}
        <div>
          <label className="text-sm font-medium">
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
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {file ? "Change File" : "Choose File"}
            </button>

            <div className="flex items-center gap-3">
              {file && (
                <div className="text-sm text-gray-700">{file.name}</div>
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
            className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                age: "",
                gender: "",
                event: "Badminton",
                phone_no: "",
              });
              clearFile();
              setStatus({ type: "", text: "" });
            }}
            className="px-4 py-2 rounded border"
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
  );
}
