// src/app/Add-event/page.jsx
'use client';

import React, { useState } from "react";

/**
 * AddEventForm (named export)
 * Props:
 * - apiUrl (string) : base url of your Django app, e.g. http://localhost:8000
 * - authToken (string | null) : admin token (optional) to authorize POST requests
 * - onSuccess (fn) : optional callback receiving created event JSON
 */
export function AddEventForm({
  apiUrl = "http://localhost:8000",
  authToken = null,
  onSuccess = null,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrors("Title is required.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      if (formUrl) fd.append("form_url", formUrl);
      if (startDatetime) fd.append("start_datetime", startDatetime);
      if (endDatetime) fd.append("end_datetime", endDatetime);
      fd.append("is_published", isPublished ? "true" : "false");
      if (imageFile) fd.append("image", imageFile);

      const endpoint = `${apiUrl.replace(/\/$/, "")}/api/events/`;

      const headers = {};
      if (authToken) headers["Authorization"] = `Token ${authToken}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: fd,
      });

      if (!res.ok) {
        let payload = null;
        try {
          payload = await res.json();
        } catch (_) {
          throw new Error(`Server returned ${res.status}`);
        }
        const serverErr = JSON.stringify(payload);
        throw new Error(serverErr || `Server returned ${res.status}`);
      }

      const created = await res.json();
      setSuccessMsg("Event created successfully.");
      setTitle("");
      setDescription("");
      setFormUrl("");
      setStartDatetime("");
      setEndDatetime("");
      setIsPublished(true);
      setImageFile(null);
      setImagePreview(null);

      if (onSuccess) onSuccess(created);
    } catch (err) {
      console.error(err);
      setErrors(err.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Event</h2>

      {errors && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">{errors}</div>
      )}
      {successMsg && (
        <div className="mb-4 text-sm text-green-800 bg-green-100 p-3 rounded">{successMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Event title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 h-28"
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Registration / form URL</label>
            <input
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Published</label>
            <div className="flex items-center gap-3">
              <input
                id="published"
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm">Visible on site</label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start datetime</label>
            <input
              type="datetime-local"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End datetime</label>
            <input
              type="datetime-local"
              value={endDatetime}
              onChange={(e) => setEndDatetime(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-3">
              <div className="text-sm mb-1">Preview</div>
              <img src={imagePreview} alt="preview" className="w-48 h-28 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>

          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setFormUrl("");
              setStartDatetime("");
              setEndDatetime("");
              setIsPublished(true);
              setImageFile(null);
              setImagePreview(null);
              setErrors(null);
              setSuccessMsg(null);
            }}
            className="px-4 py-2 rounded-full border"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">
        <div>Note: this form posts multipart/form-data to <code>{apiUrl.replace(/\/$/, "")}/api/events/</code>.</div>
        <div>If your backend requires authentication, pass an admin token via the <code>authToken</code> prop.</div>
      </div>
    </div>
  );
}

/**
 * Default page export — Next.js expects the page file to default-export a component.
 * We render the named AddEventForm here. This ensures Next.js sees a valid component
 * as the default export and avoids the "invalid default export" error.
 */
export default function Page() {
  return <AddEventForm />;
}
