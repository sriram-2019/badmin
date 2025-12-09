// app/events/page.tsx
"use client";

import React, { useState, useEffect } from "react";

interface EventFormData {
  event_name: string;
  registration_from: string;
  registration_to: string;
  registration_deadline_time: string;
  event_from: string;
  event_to: string;
  event_time: string;
  event_place: string;
  age_limit: string;
  categories: string;
  entry_fee: string;
  winner_prize: string;
  runner_prize: string;
  semifinalist_prize: string;
  other_awards: string;
  rules: string;
  category_times: string;
}

interface Event extends EventFormData {
  id?: number | string;
  registration_deadline_time?: string | null;
  event_time?: string | null;
  categories?: string;
  entry_fee?: string | number | null;
  winner_prize?: string;
  runner_prize?: string;
  semifinalist_prize?: string;
  other_awards?: string;
  rules?: string;
  category_times?: string;
}

const EventsPage: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    event_name: "",
    registration_from: "",
    registration_to: "",
    registration_deadline_time: "",
    event_from: "",
    event_to: "",
    event_time: "",
    event_place: "",
    age_limit: "", // Keep in state but don't show in form
    categories: "",
    entry_fee: "",
    winner_prize: "",
    runner_prize: "",
    semifinalist_prize: "",
    other_awards: "",
    rules: "",
    category_times: "",
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Fetch previous events from database on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await fetch("https://BackendBadminton.pythonanywhere.com/api/events/");
        
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        
        const data = await response.json();
        // API returns an array of events
        const eventsList = Array.isArray(data) ? data : [data];
        setEvents(eventsList);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        // Don't show error to user, just log it
        // Events will remain empty if fetch fails
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const validate = (): boolean => {
    const {
      event_name,
      registration_from,
      registration_to,
      event_from,
      event_to,
      event_place,
    } = formData;

    if (
      !event_name ||
      !registration_from ||
      !registration_to ||
      !event_from ||
      !event_place
    ) {
      setError("Please fill in all required fields (Event Name, Registration Dates, Event Date, and Event Place).");
      return false;
    }

    // Age limit can be any text (e.g., "below 18", "above 18", "18+", etc.)
    // No numeric validation needed

    if (registration_from > registration_to) {
      setError("Registration 'From' date cannot be after 'To' date.");
      return false;
    }

    // Only validate event_to if it's provided (it's optional)
    if (event_to && event_from > event_to) {
      setError("Event 'From' date cannot be after 'To' date.");
      return false;
    }

    if (registration_to > event_from) {
      setError("Registration should end on or before the event start date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Parse categories and times from the combined input
      // Format: "Category Name Age Limit: HH:MM" or "Category Name Age Limit HH:MM"
      const categoriesInput = formData.categories || "";
      const categoryLines = categoriesInput.split(/[,\n]/).map(l => l.trim()).filter(l => l);
      
      const categoriesList: string[] = [];
      const categoryTimesList: string[] = [];
      
      categoryLines.forEach(line => {
        // Check if line contains a time (format: "Category: HH:MM" or "Category HH:MM")
        // Try with colon first: "Category: HH:MM"
        let timeMatch = line.match(/(.+?):\s*(\d{1,2}):(\d{2})$/);
        if (!timeMatch) {
          // Try without colon: "Category HH:MM"
          timeMatch = line.match(/(.+?)\s+(\d{1,2}):(\d{2})$/);
        }
        
        if (timeMatch) {
          // Line has time format
          const categoryName = timeMatch[1].trim();
          const time = `${timeMatch[2]}:${timeMatch[3]}`;
          categoriesList.push(categoryName);
          categoryTimesList.push(`${categoryName}: ${time}`);
        } else {
          // Line doesn't have time, just add category
          categoriesList.push(line);
        }
      });

      // Adjust URL to match your Django REST API
      const response = await fetch("https://BackendBadminton.pythonanywhere.com/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: formData.event_name,
          registration_from: formData.registration_from,
          registration_to: formData.registration_to,
          registration_deadline_time: formData.registration_deadline_time || null,
          event_from: formData.event_from,
          event_to: formData.event_to || null,
          event_time: formData.event_time || null,
          event_place: formData.event_place,
          age_limit: "", // Age limits are now part of categories, not a global field
          categories: categoriesList.join(", "),
          entry_fee: formData.entry_fee || null,
          winner_prize: formData.winner_prize || "",
          runner_prize: formData.runner_prize || "",
          semifinalist_prize: formData.semifinalist_prize || "",
          other_awards: formData.other_awards || "",
          rules: formData.rules || "",
          category_times: categoryTimesList.join(", "),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          (data?.detail as string) || "Failed to create event. Check API."
        );
      }

      const newEvent: Event = await response.json();

      // Refresh events list from database to include the newly created event
      // This ensures we have the latest data from the database
      const refreshResponse = await fetch("https://BackendBadminton.pythonanywhere.com/api/events/");
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        const eventsList = Array.isArray(refreshedData) ? refreshedData : [refreshedData];
        setEvents(eventsList);
      } else {
        // Fallback: add new event to existing list if refresh fails
        setEvents(prev => [newEvent, ...prev]);
      }
      
      setSuccess("Event created successfully!");
      setFormData({
        event_name: "",
        registration_from: "",
        registration_to: "",
        registration_deadline_time: "",
        event_from: "",
        event_to: "",
        event_time: "",
        event_place: "",
        age_limit: "",
        categories: "",
        entry_fee: "",
        winner_prize: "",
        runner_prize: "",
        semifinalist_prize: "",
        other_awards: "",
        rules: "",
        category_times: "", // Will be auto-generated from categories
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-800">
            Create Event
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Fill in the details below to create a new event.
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
            </div>

            {/* Registration Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registration From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="registration_from"
                  value={formData.registration_from}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registration To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="registration_to"
                  value={formData.registration_to}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Registration Deadline Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Registration Deadline Time
              </label>
              <input
                type="time"
                name="registration_deadline_time"
                value={formData.registration_deadline_time}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                Time when registration closes (e.g., 8:00 PM)
              </p>
            </div>

            {/* Event Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Event From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="event_from"
                  value={formData.event_from}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Event To
                </label>
                <input
                  type="date"
                  name="event_to"
                  value={formData.event_to}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Event Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Event Start Time
              </label>
              <input
                type="time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                Tournament start time (e.g., 9:00 AM)
              </p>
            </div>

            {/* Event Place */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Event Place
              </label>
              <input
                type="text"
                name="event_place"
                value={formData.event_place}
                onChange={handleChange}
                placeholder="e.g. Auditorium, City Hall"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
            </div>

            {/* Categories with Age Limits and Times */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">
                Tournament Categories with Age Limits & Start Times
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4">
                Enter each category with its age limit and start time in the same line. Format: <strong>Category Name Age Limit: Start Time</strong>
              </p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categories with Start Times
                </label>
                <textarea
                  name="categories"
                  value={formData.categories}
                  onChange={handleChange}
                  placeholder={`Example:
Women's Doubles Below 30: 12:00
Men's Doubles Below 30: 9:30
Children Below 18: 10:00
Women's Doubles Above 30: 11:00
Men's Doubles Above 30: 14:00`}
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter one category per line. Include age limit and start time. Format: <strong>Category Name Age Limit: HH:MM</strong> (24-hour format, e.g., 12:00, 9:30, 10:00)
                </p>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">💡 Example Format:</p>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>Women's Doubles Below 30: 12:00</p>
                  <p>Men's Doubles Below 30: 9:30</p>
                  <p>Children Below 18: 10:00</p>
                  <p className="mt-2 text-blue-600">Each line: Category Name + Age Limit + Start Time</p>
                </div>
              </div>
            </div>

            {/* Entry Fee */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Entry Fee
              </label>
              <input
                type="number"
                name="entry_fee"
                value={formData.entry_fee}
                onChange={handleChange}
                placeholder="e.g. 800"
                step="0.01"
                min="0"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                Entry fee amount (e.g., 800)
              </p>
            </div>

            {/* Prizes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Winner Prize
                </label>
                <input
                  type="text"
                  name="winner_prize"
                  value={formData.winner_prize}
                  onChange={handleChange}
                  placeholder="e.g. 2500+Trophy"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Runner-up Prize
                </label>
                <input
                  type="text"
                  name="runner_prize"
                  value={formData.runner_prize}
                  onChange={handleChange}
                  placeholder="e.g. 1500+Trophy"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Semifinalist Prize
                </label>
                <input
                  type="text"
                  name="semifinalist_prize"
                  value={formData.semifinalist_prize}
                  onChange={handleChange}
                  placeholder="e.g. Trophy"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Other Awards */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Other Awards & Gifts
              </label>
              <textarea
                name="other_awards"
                value={formData.other_awards}
                onChange={handleChange}
                placeholder="e.g. BEST PLAYER AWARDS & OTHER SURPRISING GIFTS"
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                Additional awards, gifts, or special mentions
              </p>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tournament Rules
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                placeholder="e.g. Mavis 350 shuttle will be used, Umpires & Organizers decision will be final, Entry fee will not refund (one rule per line)"
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
              <p className="text-xs text-slate-400 mt-1">
                List tournament rules (one per line)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Saving..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>

        {/* Events Preview Card */}
        <div className="bg-slate-900 text-slate-50 rounded-2xl p-6 md:p-7 shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Recent Events</h2>
          <p className="text-xs text-slate-400 mb-4">
            Previous events from the database.
          </p>

          {isLoadingEvents ? (
            <div className="text-sm text-slate-400 border border-dashed border-slate-700 rounded-xl p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400 mx-auto mb-2"></div>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-sm text-slate-400 border border-dashed border-slate-700 rounded-xl p-4">
              No events found in the database.
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {events.map(ev => (
                <div
                  key={ev.id ?? `${ev.event_name}-${ev.event_from}`}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-50">
                      {ev.event_name}
                    </span>
                    <span className="text-[11px] text-sky-300">
                      Age: {ev.age_limit}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-300">
                    <div>
                      <span className="font-medium text-slate-400">
                        Reg:
                      </span>{" "}
                      {ev.registration_from} → {ev.registration_to}
                    </div>
                    <div>
                      <span className="font-medium text-slate-400">
                        Event:
                      </span>{" "}
                      {ev.event_from} → {ev.event_to}
                    </div>
                    <div>
                      <span className="font-medium text-slate-400">
                        Place:
                      </span>{" "}
                      {ev.event_place}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
