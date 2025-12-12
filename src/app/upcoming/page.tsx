// app/upcoming-events/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../component/nav";

/**
 * Small helper to format dates
 */
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
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
  poster?: string | null;
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
  poster,
}) => {
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Check if registration is open
  const isRegistrationOpen = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Check if registration has started
    if (regFrom) {
      const regFromDate = new Date(regFrom);
      regFromDate.setHours(0, 0, 0, 0);
      if (today < regFromDate) {
        return false; // Registration hasn't started yet
      }
    }
    
    // Check if registration has closed
    if (regTo) {
      const regToDate = new Date(regTo);
      regToDate.setHours(23, 59, 59, 999); // End of day
      if (today > regToDate) {
        return false; // Registration has closed
      }
    }
    
    return true; // Registration is open
  };

  // Get registration status message
  const getRegistrationStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (regFrom) {
      const regFromDate = new Date(regFrom);
      regFromDate.setHours(0, 0, 0, 0);
      if (today < regFromDate) {
        return {
          open: false,
          message: `Registration opens on ${formatDate(regFrom)}`,
          error: `Registration is not open yet. Registration will open on ${regFromDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}.`
        };
      }
    }
    
    if (regTo) {
      const regToDate = new Date(regTo);
      regToDate.setHours(23, 59, 59, 999);
      if (today > regToDate) {
        return {
          open: false,
          message: `Registration closed on ${formatDate(regTo)}`,
          error: `Registration has closed. The registration period ended on ${regToDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}.`
        };
      }
    }
    
    return { open: true, message: "", error: "" };
  };

  // Handle registration button click
  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const status = getRegistrationStatus();
    if (!status.open) {
      e.preventDefault();
      setRegistrationError(status.error);
      // Clear error after 5 seconds
      setTimeout(() => setRegistrationError(null), 5000);
      return false;
    }
    setRegistrationError(null);
    return true;
  };
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

  // Helper to parse categories
  const parseCategories = (catStr?: string) => {
    if (!catStr) return [];
    return catStr.split(/[,\n]/).map(c => {
      const trimmed = c.trim();
      let cleaned = trimmed
        .replace(/:\s*\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
        .replace(/\s+\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
        .replace(/\s+starts\s+at\s+\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
        .replace(/\s+starts\s+at\s*$/gi, '')
        .replace(/\s+starts\s+at\s+/gi, ' ')
        .replace(/\s+starts\s+at$/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      return cleaned;
    }).filter(c => c);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Hero Image Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          {eventPlace && (
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-base font-medium">{eventPlace}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Banner Button */}
        {poster && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowPosterModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Banner
            </button>
          </div>
        )}
        
        {/* Key Information - Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Registration */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-blue-900 text-sm uppercase">Registration</h3>
            </div>
            {(regFrom || regTo) ? (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {regFrom && regTo ? (regFrom === regTo ? formatDate(regFrom) : `${formatDate(regFrom)} - ${formatDate(regTo)}`) : formatDate(regFrom)}
                </p>
                {regDeadlineTime && (
                  <p className="text-sm text-gray-600 mt-1">Closes at {formatTime(regDeadlineTime)}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">TBA</p>
            )}
          </div>

          {/* Event Dates */}
          <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-purple-900 text-sm uppercase">Event Dates</h3>
            </div>
            {(eventFrom || eventTo) ? (
              <>
                <p className="text-lg font-bold text-gray-900">
                  {eventFrom && eventTo ? (eventFrom === eventTo ? formatDate(eventFrom) : `${formatDate(eventFrom)} - ${formatDate(eventTo)}`) : formatDate(eventFrom)}
                </p>
                {eventTime && (
                  <p className="text-sm text-gray-600 mt-1">Starts at {formatTime(eventTime)}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">TBA</p>
            )}
          </div>

          {/* Entry Fee */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-green-900 text-sm uppercase">Entry Fee</h3>
            </div>
            {entryFee ? (
              <p className="text-2xl font-bold text-gray-900">₹{entryFee}</p>
            ) : (
              <p className="text-sm text-gray-500">TBA</p>
            )}
          </div>
        </div>

        {/* Categories Section */}
        {categories && parseCategories(categories).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tournament Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {parseCategories(categories).map((cat, idx) => {
                let categoryTime = "";
                
                const categoryLines = categories.split(/[,\n]/).map(l => l.trim()).filter(l => l);
                const originalLine = categoryLines.find(line => {
                  const lineLower = line.toLowerCase();
                  const catLower = cat.toLowerCase();
                  const lineWithoutTime = line.replace(/:\s*\d{1,2}:\d{2}/g, '').replace(/\s+\d{1,2}:\d{2}/g, '').replace(/\s+starts\s+at\s+\d{1,2}:\d{2}\s*(AM|PM)?/gi, '').trim().toLowerCase();
                  return lineWithoutTime === catLower || lineLower.includes(catLower);
                });
                
                if (originalLine) {
                  const timeMatch = originalLine.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
                  if (timeMatch) {
                    let hour = parseInt(timeMatch[1]);
                    const minutes = timeMatch[2];
                    const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : (hour >= 12 ? "PM" : "AM");
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
                  const timeLines = categoryTimes.split(/[,\n]/).map(l => l.trim()).filter(l => l);
                  const normalizeText = (text: string) => {
                    return text.toLowerCase().replace(/'/g, '').replace(/\s+/g, ' ').trim();
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
                      if (firstWordRegex.test(lineNormalized)) {
                        return lineNormalized.includes(secondWord) ||
                          (secondWord === 'double' && lineNormalized.includes('doubles')) ||
                          (secondWord === 'doubles' && lineNormalized.includes('double'));
                      }
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
                
                let cleanCategoryName = cat
                  .replace(/:\s*\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
                  .replace(/\s+\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
                  .replace(/\s+starts\s+at\s+\d{1,2}:\d{2}(\s*(AM|PM))?/gi, '')
                  .replace(/\s+starts\s+at\s*$/gi, '')
                  .replace(/\s+starts\s+at\s+/gi, ' ')
                  .replace(/\s+starts\s+at$/gi, '')
                  .replace(/\s+/g, ' ')
                  .trim();
                
                const displayText = categoryTime ? `${cleanCategoryName} - ${categoryTime}` : cleanCategoryName;
                
                const colors = [
                  'bg-indigo-100 border-indigo-300 text-indigo-900',
                  'bg-pink-100 border-pink-300 text-pink-900',
                  'bg-blue-100 border-blue-300 text-blue-900',
                  'bg-green-100 border-green-300 text-green-900',
                  'bg-yellow-100 border-yellow-300 text-yellow-900',
                  'bg-purple-100 border-purple-300 text-purple-900',
                ];
                const colorClass = colors[idx % colors.length];
                
                return (
                  <div key={idx} className={`${colorClass} border-2 rounded-lg p-3 text-sm font-medium`}>
                    {displayText}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prizes Section */}
        {(winnerPrize || runnerPrize || semifinalistPrize || otherAwards) && (
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v1m0 13V12a2 2 0 112 2v1m0 13V18a2 2 0 112 2v1M12 8l-4-4m4 4l4-4" />
              </svg>
              Prizes & Awards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {winnerPrize && (
                <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥇</span>
                    <h4 className="font-bold text-yellow-900 text-sm uppercase">Winner</h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{winnerPrize}</p>
                </div>
              )}
              {runnerPrize && (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥈</span>
                    <h4 className="font-bold text-gray-900 text-sm uppercase">Runner-up</h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{runnerPrize}</p>
                </div>
              )}
              {semifinalistPrize && (
                <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥉</span>
                    <h4 className="font-bold text-orange-900 text-sm uppercase">Semifinalist</h4>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{semifinalistPrize}</p>
                </div>
              )}
            </div>
            {otherAwards && (
              <div className="mt-4 bg-pink-100 border-2 border-pink-300 rounded-lg p-4">
                <h4 className="font-bold text-pink-900 text-base mb-1">Additional Awards</h4>
                <p className="text-gray-900">{otherAwards}</p>
              </div>
            )}
          </div>
        )}

        {/* Rules Section */}
        {rules && (
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Tournament Rules
            </h3>
            <ul className="space-y-2">
              {rules.split(/[,\n]/).map((rule, idx) => {
                const trimmed = rule.trim();
                if (!trimmed) return null;
                return (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2 bg-white rounded p-3">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span className="flex-1">{trimmed}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Registration Error Message */}
        {registrationError && (
          <div className="pt-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium text-sm">{registrationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Register Button */}
        <div className="pt-4">
          {(() => {
            const status = getRegistrationStatus();
            return (
              <>
                <a
                  href={formUrl}
                  onClick={handleRegisterClick}
                  className={`block w-full text-center font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg ${
                    status.open
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {status.open ? "Register Now" : (regTo && new Date() > new Date(regTo) ? "Registration Closed" : "Registration Not Open Yet")}
                </a>
                {!status.open && status.message && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {status.message}
                  </p>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Poster Modal */}
      {showPosterModal && poster && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPosterModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPosterModal(false)}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Poster Image */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tournament Banner</h2>
              <div className="mb-4">
                <img
                  src={poster}
                  alt="Tournament Banner"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = poster;
                    link.download = `tournament-banner-${title.replace(/\s+/g, '-')}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  poster?: string | null;
}

/**
 * Single Event — Centered Page WITH NAVBAR
 */
const UpcomingEvents: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use optimized fetch with caching
        const { fetchUpcomingEvents } = await import('@/lib/api');
        const data = await fetchUpcomingEvents();
        
        if (!isMounted) return;

        const eventsList = Array.isArray(data) ? data : [data];
        
        if (eventsList.length === 0) {
          setEvent(null);
          setError("No events found");
          return;
        }

        const eventData = eventsList[0];
        setEvent(eventData);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || "Something went wrong");
        console.error("Error fetching events:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-base text-red-600 mb-6">{error || "No events available"}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const description = `Join us for ${event.event_name}! ${
    event.event_place ? `Location: ${event.event_place}. ` : ""
  }${
    event.age_limit ? `Age requirement: ${event.age_limit}.` : ""
  }`;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <EventCard
            title={event.event_name}
            image="/img/tour.jpg"
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
            poster={event.poster || undefined}
          />
        </div>
      </div>
    </>
  );
};

export default UpcomingEvents;
