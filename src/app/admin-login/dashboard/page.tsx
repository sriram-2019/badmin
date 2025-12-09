// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = "https://BackendBadminton.pythonanywhere.com/api/registrations/";

interface RegistrationData {
  id: number;
  name: string;
  age: number | null;
  dob: string | null;
  gender: string;
  state: string;
  district: string;
  level: string;
  email: string;
  phone_no: string;
  address: string;
  document: string | null;
  document_exists?: boolean;
  document_name?: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [showTable, setShowTable] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);

  // Fetch events for dropdown
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("https://BackendBadminton.pythonanywhere.com/api/events/");
        if (res.ok) {
          const data = await res.json();
          setEvents(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    }
    fetchEvents();
  }, []);

  async function fetchRegistrations() {
    try {
      setLoadingRegistrations(true);
      setError(null);
      
      // Build URL with event filter if selected
      let url = API_URL;
      if (selectedEventId) {
        url += `?event_id=${selectedEventId}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : [data]);
      setShowTable(true);
    } catch (err: any) {
      setError("Failed to load registrations: " + (err?.message || String(err)));
    } finally {
      setLoadingRegistrations(false);
    }
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  function formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }

  async function downloadImage(registrationId: number) {
    try {
      const response = await fetch(`https://BackendBadminton.pythonanywhere.com/api/registrations/${registrationId}/download-image/`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.can_reupload) {
          alert(`Document was deleted from database.\n\nYou can re-upload the document by updating the registration.`);
        } else {
          throw new Error(errorData.error || "Failed to download image");
        }
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${registrationId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError("Failed to download image: " + (err?.message || String(err)));
    }
  }

  async function deleteImageFile(registrationId: number) {
    if (!confirm("Are you sure you want to delete this image data from the database? The registration record will be kept.")) {
      return;
    }

    try {
      setDeletingImage(registrationId);
      const response = await fetch(`https://BackendBadminton.pythonanywhere.com/api/registrations/${registrationId}/delete-image-file/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete image file");
      }

      const data = await response.json();
      setError(null);
      alert(data.message || "Image file deleted successfully!");
      
      // Refresh registrations
      await fetchRegistrations();
    } catch (err: any) {
      setError("Failed to delete image file: " + (err?.message || String(err)));
    } finally {
      setDeletingImage(null);
    }
  }

  // Download registrations as CSV (uses dedicated backend endpoint)
  async function downloadRegistrationsData() {
    try {
      // Build URL with event filter if selected
      let csvUrl = `https://BackendBadminton.pythonanywhere.com/api/registrations/export/csv/`;
      if (selectedEventId) {
        csvUrl += `?event_id=${selectedEventId}`;
      }
      
      const response = await fetch(
        csvUrl,
        {
          method: "GET",
          headers: {
            Accept: "text/csv",
          },
        }
      );

      if (!response.ok) {
        throw new Error("CSV download failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "registrations.csv";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to download CSV.");
      console.error(error);
    }
  }


  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
          Event Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
          Choose what you want to manage.
        </p>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">

          {/* Card 1 – Event Detail */}
          <Link href="/admin-login/event-reg" className="group">
            <div className="h-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-lg transition hover:-translate-y-1 cursor-pointer flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Event Detail</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create, edit, or view details of upcoming events.
                </p>
              </div>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                Go to Event Detail →
              </div>
            </div>
          </Link>

          {/* Card 2 – Completed */}
          <Link href="/user_entry_completed" className="group">
            <div className="h-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-lg transition hover:-translate-y-1 cursor-pointer flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Completed</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  View all completed events and their summaries.
                </p>
              </div>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                View Completed Events →
              </div>
            </div>
          </Link>

          
       
        </div>

        {/* Event Filter for Registrations */}
        <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Filter Registrations by Event
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            >
              <option value="">All Registrations (No Filter)</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.event_name} (Reg: {event.registration_from} to {event.registration_to}, Event: {event.event_from} to {event.event_to || event.event_from})
                </option>
              ))}
            </select>
            <button
              onClick={fetchRegistrations}
              disabled={loadingRegistrations}
              className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingRegistrations ? "Loading..." : "Apply Filter"}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Select an event to view registrations created within that event's date range (registration period to event end date)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 text-xs sm:text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Registrations Table */}
        {showTable && (
          <div className="mt-4 sm:mt-8 bg-white rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-300 sm:border-2 overflow-hidden">
            <div className="bg-blue-900 text-white p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
              <h3 className="text-lg sm:text-2xl font-bold">Registered Persons Details</h3>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* CSV Export */}
                <button
                  onClick={downloadRegistrationsData}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs sm:text-sm font-medium"
                >
                  Download CSV
                </button>

                {/* Close Table */}
                <button
                  onClick={() => setShowTable(false)}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Mobile Card View / Desktop Table View */}
            <div className="block sm:hidden">
              {/* Mobile: Card Layout */}
              {registrations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No registrations found.</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-base text-gray-900">{reg.name}</div>
                          <div className="text-xs text-gray-500">ID: {reg.id}</div>
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(reg.dob)}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="font-medium">Age:</span> {reg.age || "-"}</div>
                        <div><span className="font-medium">Gender:</span> {reg.gender || "-"}</div>
                        <div><span className="font-medium">State:</span> {reg.state || "-"}</div>
                        <div><span className="font-medium">District:</span> {reg.district || "-"}</div>
                        <div><span className="font-medium">Level:</span> {reg.level || "-"}</div>
                        <div><span className="font-medium">Email:</span> <span className="break-all">{reg.email || "-"}</span></div>
                      </div>
                      
                      <div className="text-xs">
                        <div className="font-medium">Phone:</div>
                        <div className="text-gray-700">{reg.phone_no || "-"}</div>
                      </div>
                      
                      {reg.address && (
                        <div className="text-xs">
                          <div className="font-medium">Address:</div>
                          <div className="text-gray-700">{reg.address}</div>
                        </div>
                      )}
                      
                      <div className="text-xs">
                        <div className="font-medium">Document:</div>
                        {reg.document ? (
                          <div className="flex flex-col gap-1 mt-1">
                            {reg.document_exists !== false ? (
                              <>
                                <a
                                  href={reg.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  View
                                </a>
                                <button
                                  onClick={() => downloadImage(reg.id)}
                                  className="text-green-600 hover:text-green-800 hover:underline text-left"
                                >
                                  Download
                                </button>
                                <button
                                  onClick={() => deleteImageFile(reg.id)}
                                  disabled={deletingImage === reg.id}
                                  className="text-red-600 hover:text-red-800 hover:underline text-left disabled:opacity-50"
                                >
                                  {deletingImage === reg.id ? "Deleting..." : "Delete"}
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="text-orange-600 font-medium">Deleted</span>
                                <button
                                  onClick={() => downloadImage(reg.id)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                                >
                                  Check/Re-upload
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                        Registered: {formatDateTime(reg.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden sm:block overflow-x-auto">
              {registrations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No registrations found.</div>
              ) : (
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">ID</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Name</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Age</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">DOB</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Gender</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">State</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">District</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Level</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Email</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Phone</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Address</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Document</th>
                      <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-semibold text-blue-900">Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr
                        key={reg.id}
                        className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
                      >
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.id}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 font-medium">{reg.name}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.age || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{formatDate(reg.dob)}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 capitalize">{reg.gender || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.state || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.district || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.level || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 break-all max-w-[120px]">{reg.email || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{reg.phone_no || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 max-w-[150px] truncate" title={reg.address || ""}>{reg.address || "-"}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          {reg.document ? (
                            <div className="flex flex-col gap-1">
                              {reg.document_exists !== false ? (
                                <>
                                  <a
                                    href={reg.document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    View
                                  </a>
                                  <button
                                    onClick={() => downloadImage(reg.id)}
                                    className="text-green-600 hover:text-green-800 hover:underline text-left"
                                  >
                                    Download
                                  </button>
                                  <button
                                    onClick={() => deleteImageFile(reg.id)}
                                    disabled={deletingImage === reg.id}
                                    className="text-red-600 hover:text-red-800 hover:underline text-left disabled:opacity-50"
                                  >
                                    {deletingImage === reg.id ? "Deleting..." : "Delete"}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-orange-600 font-medium">Deleted</span>
                                  <button
                                    onClick={() => downloadImage(reg.id)}
                                    className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                                    title="Try to download (will show re-upload message)"
                                  >
                                    Check/Re-upload
                                  </button>
                                  <button
                                    onClick={() => deleteImageFile(reg.id)}
                                    disabled={deletingImage === reg.id}
                                    className="text-gray-400 text-left disabled:opacity-50"
                                    title="Already deleted"
                                  >
                                    {deletingImage === reg.id ? "Processing..." : "Already Deleted"}
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700">{formatDateTime(reg.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
