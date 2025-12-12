"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminNav from "@/component/AdminNav";
import { useAuth } from "@/component/useAuth";

function EventResultsContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    winner: "",
  });
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEventNameFromUrl, setIsEventNameFromUrl] = useState(false);

  // Get event name and date from URL params
  useEffect(() => {
    const eventName = searchParams.get('event_name');
    const eventDate = searchParams.get('event_date');
    
    if (eventName && eventDate) {
      // Use the EXACT event name from the completed event (no modifications)
      const decodedName = decodeURIComponent(eventName);
      const decodedDate = decodeURIComponent(eventDate);
      setFormData({
        event_name: decodedName, // Decode to get exact name
        event_date: decodedDate,
        winner: "",
      });
      setIsEventNameFromUrl(true); // Mark that event name came from URL
      console.log("Event results page - Using exact event name from URL:", decodedName);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError("Please upload only PNG, JPG, or JPEG files.");
      return;
    }

    // Validate file sizes (max 5MB each)
    const largeFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      setError("Each file must be less than 5MB.");
      return;
    }

    // Add new files to existing ones
    const newFiles = [...eventImages, ...files];
    setEventImages(newFiles);
    setError(null);

    // Create previews for all images
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = eventImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setEventImages(newImages);
    setImagePreviews(newPreviews);
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

    if (!formData.event_date) {
      setError("Event date is required.");
      return;
    }

    if (eventImages.length === 0) {
      setError("Please upload at least one event image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("event_name", formData.event_name);
      submitData.append("event_date", formData.event_date);
      submitData.append("winner", formData.winner);

      // Append all images with simple keys
      eventImages.forEach((file, index) => {
        submitData.append(`image_${index}`, file);
      });

      const response = await fetch("https://backendbadminton.pythonanywhere.com/api/event-results/", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to create event result" }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSuccess("Event results saved successfully!");
      
      // Clear cache for event results to show new data
      const { clearCache } = await import('@/lib/api');
      clearCache('/event-results/');
      
      // Reset form but keep event name if it came from URL
      if (isEventNameFromUrl) {
        // Keep the event name and date from URL
        setFormData({
          event_name: formData.event_name,
          event_date: formData.event_date,
          winner: "",
        });
      } else {
        // Reset everything if manually entered
        setFormData({
          event_name: "",
          event_date: "",
          winner: "",
        });
      }
      setEventImages([]);
      setImagePreviews([]);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/admin-login/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating event result:", err);
      setError(err.message || "Failed to save event results. Please try again.");
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add Event Results
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
                  readOnly={isEventNameFromUrl}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                    isEventNameFromUrl ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter event name"
                />
                {isEventNameFromUrl && (
                  <p className="text-xs text-blue-600 mt-1">
                    ℹ️ Event name is locked to match the completed event. Images will only be shown for this specific event.
                  </p>
                )}
                {!isEventNameFromUrl && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Make sure this matches the exact event name from the completed event for images to display correctly.
                  </p>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="event_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date of Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-700 bg-white"
                />
              </div>

              {/* Winner */}
              <div>
                <label
                  htmlFor="winner"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Winner
                </label>
                <textarea
                  id="winner"
                  name="winner"
                  value={formData.winner}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter winner(s) name(s)"
                />
              </div>

              {/* Event Images */}
              <div>
                <label
                  htmlFor="event_images"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Event Images <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">(PNG, JPG, or JPEG only, max 5MB each)</span>
                </label>
                <input
                  type="file"
                  id="event_images"
                  name="event_images"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {eventImages[index]?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {eventImages.length} image(s) selected
                </p>
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
                {isSubmitting ? "Submitting..." : "Save Event Results"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EventResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EventResultsContent />
    </Suspense>
  );
}

