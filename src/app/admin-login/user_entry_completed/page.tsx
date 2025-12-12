"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNav from "@/component/AdminNav";
import { useAuth } from "@/component/useAuth";

export default function UserEntryCompleted() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    event_name: "",
    event_conducted_date: "",
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PNG, JPG, or JPEG file only.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      setPosterFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.event_name.trim()) {
      setError("Event name is required.");
      return;
    }

    if (!formData.event_conducted_date) {
      setError("Event conducted date is required.");
      return;
    }

    if (!posterFile) {
      setError("Event poster is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("event_name", formData.event_name);
      submitData.append("event_conducted_date", formData.event_conducted_date);
      submitData.append("poster", posterFile);

      const response = await fetch("https://backendbadminton.pythonanywhere.com/api/completed-events/", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to create event" }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Event created successfully:", result);
      
      // Clear cache for completed events to show new data
      const { clearCache } = await import('@/lib/api');
      clearCache('/completed-events/');
      
      // Store event data before resetting
      const eventName = formData.event_name;
      const eventDate = formData.event_conducted_date;
      
      console.log("Preparing redirect with:", { eventName, eventDate });
      
      // Show success message briefly
      setSuccess("Event created successfully! Redirecting...");
      
      // Reset form
      setFormData({
        event_name: "",
        event_conducted_date: "",
      });
      setPosterFile(null);
      setPosterPreview(null);
      
      // Redirect immediately using window.location for full page reload
      // Use EXACT event name to ensure strict matching
      const redirectUrl = `/admin-login/event-results?event_name=${encodeURIComponent(eventName.trim())}&event_date=${encodeURIComponent(eventDate)}`;
      console.log("Redirecting to event-results with exact event name:", eventName.trim());
      console.log("Redirect URL:", redirectUrl);
      
      // Force redirect
      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-100 py-8 px-4 pt-24 sm:pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Event Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add Completed Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div>
                <label
                  htmlFor="event_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="event_name"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter event name"
                />
              </div>

              {/* Event Conducted Date */}
              <div>
                <label
                  htmlFor="event_conducted_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Conducted Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="event_conducted_date"
                  name="event_conducted_date"
                  value={formData.event_conducted_date}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-700 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Click to open calendar and select the event date
                </p>
              </div>

              {/* Event Poster */}
              <div>
                <label
                  htmlFor="poster"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Poster <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">(PNG, JPG, or JPEG only, max 5MB)</span>
                </label>
                <input
                  type="file"
                  id="poster"
                  name="poster"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                
                {/* Preview */}
                {posterPreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

