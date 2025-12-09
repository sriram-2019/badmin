// app/upcoming-events/page.tsx  (or wherever your route is)
"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../component/nav"; // ✅ adjust path if needed

/**
 * Small helper to format dates
 */
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr; // fallback
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

/**
 * Event Card Component
 */
interface EventCardProps {
  title: string;
  image: string;
  description: string;
  formUrl: string;
  eventFrom?: string;
  eventTo?: string;
  eventTime?: string;
  eventPlace?: string;
  ageLimit?: string;
  regFrom?: string;
  regTo?: string;
  regDeadlineTime?: string;
  categories?: string;
  categoryTimes?: string;
  entryFee?: string | number;
  winnerPrize?: string;
  runnerPrize?: string;
  semifinalistPrize?: string;
  otherAwards?: string;
  rules?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  description,
  formUrl,
  eventFrom,
  eventTo,
  eventTime,
  eventPlace,
  ageLimit,
  regFrom,
  regTo,
  regDeadlineTime,
  categories,
  categoryTimes,
  entryFee,
  winnerPrize,
  runnerPrize,
  semifinalistPrize,
  otherAwards,
  rules,
}) => {
  // Helper to format time
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Helper to parse categories (comma or newline separated)
  // Also handles combined format: "Category Name: HH:MM" - extracts just the category name
  const parseCategories = (catStr?: string) => {
    if (!catStr) return [];
    return catStr.split(/[,\n]/).map(c => {
      const trimmed = c.trim();
      // If line contains time format (e.g., "Category: HH:MM"), extract just the category part
      const timeMatch = trimmed.match(/^(.+?):\s*\d{1,2}:\d{2}$/);
      if (timeMatch) {
        return timeMatch[1].trim();
      }
      return trimmed;
    }).filter(c => c);
  };
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300">
      {/* Hero Image Section */}
      <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">{title}</h1>
          {eventPlace && (
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-base sm:text-lg font-medium">{eventPlace}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 sm:p-8 md:p-10">
        
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {/* Registration Period */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[140px]">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide whitespace-nowrap">Registration</h3>
            </div>
            {(regFrom || regTo) ? (
              <>
                {regFrom && regTo ? (
                  <p className="text-lg sm:text-xl font-bold break-words">
                    {regFrom === regTo ? formatDate(regFrom) : `${formatDate(regFrom)} - ${formatDate(regTo)}`}
                  </p>
                ) : regFrom ? (
                  <p className="text-lg sm:text-xl font-bold break-words">
                    {formatDate(regFrom)}
                  </p>
                ) : (
                  <p className="text-base opacity-90">Dates TBA</p>
                )}
                {regDeadlineTime && (
                  <p className="text-sm sm:text-base mt-2 opacity-90">
                    Closes at {formatTime(regDeadlineTime)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base opacity-90">Dates TBA</p>
            )}
          </div>

          {/* Event Period */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[140px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 rounded-lg p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide">Event Dates</h3>
            </div>
            {(eventFrom || eventTo) ? (
              <>
                {eventFrom && eventTo ? (
                  <p className="text-lg sm:text-xl font-bold break-words">
                    {eventFrom === eventTo ? formatDate(eventFrom) : `${formatDate(eventFrom)} - ${formatDate(eventTo)}`}
                  </p>
                ) : eventFrom ? (
                  <p className="text-lg sm:text-xl font-bold break-words">
                    {formatDate(eventFrom)}
                  </p>
                ) : (
                  <p className="text-base opacity-90">Dates TBA</p>
                )}
                {eventTime && (
                  <p className="text-sm sm:text-base mt-2 opacity-90">
                    Starts at {formatTime(eventTime)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base opacity-90">Dates TBA</p>
            )}
          </div>

          {/* Entry Fee */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[140px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 rounded-lg p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide">Entry Fee</h3>
            </div>
            {entryFee ? (
              <p className="text-2xl sm:text-3xl font-extrabold">₹{entryFee}</p>
            ) : (
              <p className="text-base opacity-90">TBA</p>
            )}
          </div>
        </div>

        {/* Categories with Times Section */}
        {categories && parseCategories(categories).length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="bg-indigo-100 rounded-lg p-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Tournament Categories</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {parseCategories(categories).map((cat, idx) => {
                // Extract time from the original categories field (combined format)
                // Format: "Category Name: HH:MM" or "Category Name HH:MM" or "Category Name starts at HH:MM"
                let categoryTime = "";
                
                // First, try to find the original line in categories that contains this category
                const categoryLines = categories.split(/[,\n]/).map(l => l.trim()).filter(l => l);
                const originalLine = categoryLines.find(line => {
                  // Check if this line contains the category name
                  const lineLower = line.toLowerCase();
                  const catLower = cat.toLowerCase();
                  // Remove time from line for comparison
                  const lineWithoutTime = line.replace(/:\s*\d{1,2}:\d{2}/g, '').replace(/\s+\d{1,2}:\d{2}/g, '').replace(/\s+starts\s+at\s+\d{1,2}:\d{2}\s*(AM|PM)?/gi, '').trim().toLowerCase();
                  return lineWithoutTime === catLower || lineLower.includes(catLower);
                });
                
                if (originalLine) {
                  // Extract time from the original line (handle both 24h and 12h formats)
                  const timeMatch = originalLine.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
                  if (timeMatch) {
                    let hour = parseInt(timeMatch[1]);
                    const minutes = timeMatch[2];
                    const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : (hour >= 12 ? "PM" : "AM");
                    
                    // If no AM/PM specified, convert 24h to 12h
                    if (!timeMatch[3]) {
                      hour = hour % 12 || 12;
                    } else if (ampm === "PM" && hour !== 12) {
                      hour = hour + 12;
                    } else if (ampm === "AM" && hour === 12) {
                      hour = 0;
                    }
                    
                    const displayHour = hour % 12 || 12;
                    categoryTime = `${displayHour}:${minutes} ${ampm}`;
                  }
                } else if (categoryTimes) {
                  // Fallback: Try to match with category_times (for backward compatibility)
                  const timeLines = categoryTimes.split(/[,\n]/).map(l => l.trim()).filter(l => l);
                  
                  // Normalize category name for matching
                  const normalizeText = (text: string) => {
                    return text
                      .toLowerCase()
                      .replace(/'/g, '')
                      .replace(/\s+/g, ' ')
                      .trim();
                  };
                  
                  const catNormalized = normalizeText(cat);
                  const catNameForMatch = catNormalized.replace(/\s*(below|above|under|over)\s*\d+/gi, '').trim();
                  const catKeyWords = catNameForMatch.split(' ').filter(w => w.length > 2);
                  
                  const timeLine = timeLines.find(line => {
                    const lineNormalized = normalizeText(line);
                    
                    if (lineNormalized.includes(catNormalized)) return true;
                    
                    const lineWithoutAge = lineNormalized.replace(/\s*(below|above|under|over)\s*\d+/gi, '').trim();
                    const catWithoutAge = catNormalized.replace(/\s*(below|above|under|over)\s*\d+/gi, '').trim();
                    const catWithoutAgeRegex = new RegExp(`\\b${catWithoutAge.replace(/\s+/g, '\\s+')}\\b`, 'i');
                    if (catWithoutAgeRegex.test(lineWithoutAge)) return true;
                    
                    if (catKeyWords.length >= 2) {
                      const firstWord = catKeyWords[0];
                      const secondWord = catKeyWords[1];
                      const firstWordRegex = new RegExp(`\\b${firstWord}\\b`, 'i');
                      const firstWordMatches = firstWordRegex.test(lineNormalized);
                      if (!firstWordMatches) return false;
                      
                      const secondWordMatches = 
                        lineNormalized.includes(secondWord) ||
                        (secondWord === 'double' && lineNormalized.includes('doubles')) ||
                        (secondWord === 'doubles' && lineNormalized.includes('double'));
                      
                      if (firstWordMatches && secondWordMatches) return true;
                    }
                    
                    return false;
                  });
                  
                  if (timeLine) {
                    const timeMatch = timeLine.match(/(\d{1,2}):(\d{2})/);
                    if (timeMatch) {
                      const [hours, minutes] = timeMatch[0].split(':');
                      const hour = parseInt(hours);
                      const ampm = hour >= 12 ? "PM" : "AM";
                      const displayHour = hour % 12 || 12;
                      categoryTime = `${displayHour}:${minutes} ${ampm}`;
                    }
                  }
                }
                
                // Build display text: Category name with time in one line
                const displayText = categoryTime ? `${cat} - ${categoryTime}` : cat;
                
                return (
                  <div key={idx} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium text-sm sm:text-base hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200">
                    {displayText}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prizes Section */}
        {(winnerPrize || runnerPrize || semifinalistPrize || otherAwards) && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="bg-yellow-100 rounded-lg p-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v1m0 13V12a2 2 0 112 2v1m0 13V18a2 2 0 112 2v1M12 8l-4-4m4 4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Prizes & Awards</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {winnerPrize && (
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥇</span>
                    <h4 className="font-bold text-sm uppercase">Winner</h4>
                  </div>
                  <p className="text-lg font-bold">{winnerPrize}</p>
                </div>
              )}
              {runnerPrize && (
                <div className="bg-gradient-to-br from-gray-400 to-slate-500 rounded-xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥈</span>
                    <h4 className="font-bold text-sm uppercase">Runner-up</h4>
                  </div>
                  <p className="text-lg font-bold">{runnerPrize}</p>
                </div>
              )}
              {semifinalistPrize && (
                <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥉</span>
                    <h4 className="font-bold text-sm uppercase">Semifinalist</h4>
                  </div>
                  <p className="text-lg font-bold">{semifinalistPrize}</p>
                </div>
              )}
            </div>
            {otherAwards && (
              <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-5 text-white shadow-lg">
                <h4 className="font-bold text-base sm:text-lg mb-2">Additional Awards</h4>
                <p className="text-sm sm:text-base">{otherAwards}</p>
              </div>
            )}
          </div>
        )}

        {/* Other Awards */}
        {otherAwards && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-pink-200">
            <h3 className="font-semibold text-gray-800 text-xs sm:text-sm uppercase tracking-wide mb-2">Additional Awards</h3>
            <p className="text-gray-700 text-sm sm:text-base">{otherAwards}</p>
          </div>
        )}

        {/* Rules */}
        {rules && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Tournament Rules</h3>
            </div>
            <ul className="space-y-3">
              {rules.split(/[,\n]/).map((rule, idx) => {
                const trimmed = rule.trim();
                if (!trimmed) return null;
                return (
                  <li key={idx} className="text-gray-700 text-sm sm:text-base flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-indigo-600 font-bold mt-0.5">✓</span>
                    <span className="flex-1">{trimmed}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-4 border-t-2 border-gray-200">
          <a
            href={formUrl}
            className="block w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 active:scale-98 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-base sm:text-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>Register Now</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Event Interface from API
 */
interface Event {
  id: number | string;
  event_name: string;
  registration_from: string;
  registration_to: string;
  registration_deadline_time?: string | null;
  event_from: string;
  event_to?: string | null;
  event_time?: string | null;
  event_place: string;
  age_limit?: string;
  categories?: string;
  category_times?: string;
  entry_fee?: string | number | null;
  winner_prize?: string;
  runner_prize?: string;
  semifinalist_prize?: string;
  other_awards?: string;
  rules?: string;
}

/**
 * Single Event — Centered Page WITH NAVBAR
 * Fetches event data from Django API
 */
const UpcomingEvents: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch only upcoming events (not ended) from Django API
        const response = await fetch("https://BackendBadminton.pythonanywhere.com/api/events/?upcoming=true");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        // If API returns an array, pick the first item (most recently created); otherwise use single object
        const eventsList = Array.isArray(data) ? data : [data];
        
        if (eventsList.length === 0) {
          setEvent(null);
          setError("No events found");
          return;
        }

        // Get the most recently created event (first in array, already sorted by -created_at)
        const eventData = eventsList[0];
        setEvent(eventData);
        
        // Debug: Log the event data to see what we received
        console.log("Total upcoming events:", eventsList.length);
        console.log("Selected event (most recent):", eventData);
        console.log("Event created_at:", eventData.created_at);
        console.log("Categories:", eventData.categories);
        console.log("Category Times:", eventData.category_times);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            </div>
            <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg font-medium">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  // Error or no-event state
  if (error || !event) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-sm sm:text-base text-red-600 mb-4 sm:mb-6 break-words">{error || "No events available"}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Description built from event data
  const description = `Join us for ${event.event_name}! ${
    event.event_place ? `Location: ${event.event_place}. ` : ""
  }${
    event.age_limit
      ? `Age requirement: ${event.age_limit}.`
      : ""
  }`;

  return (
    <>
      {/* TOP NAVBAR */}
      <Nav />

      {/* PAGE CONTENT */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4 md:p-6 py-8 sm:py-10 md:py-12">
        <div className="w-full max-w-2xl">
          <EventCard
          title={event.event_name}
          image="/img/tour.jpg" // static image; change or add image field in DB if needed
          description={description}
          formUrl="/register"
          eventFrom={event.event_from}
          eventTo={event.event_to || undefined}
          eventTime={event.event_time || undefined}
          eventPlace={event.event_place}
          ageLimit={event.age_limit || undefined}
          regFrom={event.registration_from}
          regTo={event.registration_to}
          regDeadlineTime={event.registration_deadline_time || undefined}
          categories={event.categories || undefined}
          categoryTimes={event.category_times || undefined}
          entryFee={event.entry_fee || undefined}
          winnerPrize={event.winner_prize || undefined}
          runnerPrize={event.runner_prize || undefined}
          semifinalistPrize={event.semifinalist_prize || undefined}
          otherAwards={event.other_awards || undefined}
          rules={event.rules || undefined}
        />
        </div>
      </div>
    </>
  );
};

export default UpcomingEvents;
