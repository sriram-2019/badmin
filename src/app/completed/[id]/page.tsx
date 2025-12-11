"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";

interface CompletedEvent {
  id: number;
  event_name: string;
  event_conducted_date: string;
  poster: string | null;
  created_at: string;
}

interface EventResult {
  id: number;
  event_name: string;
  event_date: string;
  winner: string;
  images: Array<{
    id: number;
    image: string;
    image_order: number;
  }>;
  created_at: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  
  const [completedEvent, setCompletedEvent] = useState<CompletedEvent | null>(null);
  const [eventResults, setEventResults] = useState<EventResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced firecracker animation on page load
  useEffect(() => {
    if (isLoading) return;
    
    // Multiple bursts of firecrackers
    const fireFirecrackers = () => {
      // Initial big burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF6B9D', '#C44569'],
        shapes: ['circle', 'square'],
        scalar: 1.2
      });

      // Left side firecrackers
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.5 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
          shapes: ['circle', 'square']
        });
      }, 200);

      // Right side firecrackers
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.5 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
          shapes: ['circle', 'square']
        });
      }, 400);

      // Center burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 360,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D'],
          shapes: ['circle', 'square'],
          scalar: 1.5
        });
      }, 600);

      // Continuous smaller bursts
      const interval = setInterval(() => {
        const randomX = Math.random();
        const randomY = Math.random() * 0.5 + 0.2;
        
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { x: randomX, y: randomY },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
          shapes: ['circle', 'square'],
          scalar: 0.8
        });
      }, 800);

      // Stop after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
    };

    // Delay to ensure page is rendered
    const timer = setTimeout(fireFirecrackers, 500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Fetch completed event and matching event results
  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) return;

      try {
        setIsLoading(true);
        
        // Fetch all completed events to find the one with matching ID
        const completedResponse = await fetch("http://localhost:8000/api/completed-events/");
        if (!completedResponse.ok) {
          throw new Error("Failed to fetch completed events");
        }
        const completedEvents = await completedResponse.json();
        const event = completedEvents.find((e: CompletedEvent) => e.id === parseInt(eventId));
        
        if (!event) {
          throw new Error("Event not found");
        }
        
        setCompletedEvent(event);

        // Fetch all event results and filter by event name
        const resultsResponse = await fetch("http://localhost:8000/api/event-results/");
        if (!resultsResponse.ok) {
          throw new Error("Failed to fetch event results");
        }
        const allResults = await resultsResponse.json();
        
        // Filter results that match the event name EXACTLY (case-insensitive, strict matching)
        // Only show images for the specific event that was clicked
        const normalizeName = (name: string) => name.toLowerCase().trim();
        const eventNameNormalized = normalizeName(event.event_name);
        
        const matchingResults = allResults.filter((result: EventResult) => {
          const resultNameNormalized = normalizeName(result.event_name);
          return resultNameNormalized === eventNameNormalized;
        });
        
        setEventResults(matchingResults);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching event data:", err);
        setError(err.message || "Failed to load event data");
        setCompletedEvent(null);
        setEventResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [eventId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !completedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-sm sm:text-base px-4">{error || "Event not found"}</p>
          <Link
            href="/completed"
            className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base transition-colors"
          >
            ← Back to Completed Events
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total images
  const hasImages = eventResults.length > 0 && eventResults.some(r => r.images && Array.isArray(r.images) && r.images.length > 0);
  const totalImages = eventResults.reduce((sum, r) => {
    const imgCount = (r.images && Array.isArray(r.images)) ? r.images.length : 0;
    return sum + imgCount;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-5 sm:top-20 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Sparkle Particles - Responsive count */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Bar - Responsive */}
      <div className="relative bg-black/20 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link
            href="/completed"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 font-medium group text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Back to Events</span>
            <span className="xs:hidden">Back</span>
          </Link>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Event Title Section - Animated - Responsive */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <div className="inline-block mb-4 sm:mb-6 animate-bounce-slow">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
              ✨ Completed Event ✨
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 px-2 animate-slide-up bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent leading-tight">
            {completedEvent.event_name}
          </h1>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/90 text-sm sm:text-lg md:text-xl animate-fade-in-delay px-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold break-words">{formatDate(completedEvent.event_conducted_date)}</span>
          </div>
        </div>

        {/* Winner Section - Epic Animated Design - Responsive */}
        {eventResults.length > 0 && eventResults[0]?.winner ? (
          <div className="mb-8 sm:mb-12 md:mb-16 animate-scale-in px-2 sm:px-0">
            <div className="relative">
              {/* Glowing outer ring */}
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl opacity-75 animate-pulse"></div>
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl p-0.5 sm:p-1">
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16">
                  <div className="text-center">
                    {/* Animated Trophy Icon - Responsive */}
                    <div className="mb-4 sm:mb-6 md:mb-8 animate-bounce-slow">
                      <div className="relative inline-block">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
                          <svg className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Winner Label - Animated - Responsive */}
                    <div className="mb-4 sm:mb-6 animate-fade-in-delay px-2">
                      <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs sm:text-sm md:text-lg font-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full uppercase tracking-wider sm:tracking-widest shadow-lg transform hover:scale-105 transition-transform">
                        🏆 CHAMPION 🏆
                      </span>
                    </div>
                    
                    {/* Winner Name - Epic Typography - Responsive */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 mb-4 sm:mb-6 md:mb-8 animate-slide-up-delay drop-shadow-2xl px-2 break-words leading-tight">
                      {eventResults[0].winner}
                    </h2>
                    
                    {/* Animated Decorative Line - Responsive */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10 animate-fade-in-delay px-4">
                      <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-400 flex-1 max-w-20 sm:max-w-32 md:max-w-40 rounded-full"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                      <div className="h-0.5 sm:h-1 bg-gradient-to-l from-transparent via-yellow-400 to-yellow-400 flex-1 max-w-20 sm:max-w-32 md:max-w-40 rounded-full"></div>
                    </div>
                    
                    {/* Event Date - Styled - Responsive */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 text-sm sm:text-base md:text-lg px-4">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-bold break-words">{formatDate(eventResults[0].event_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Buttons - Animated - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 md:mb-16 animate-fade-in-delay px-4 sm:px-0">
          {hasImages && totalImages > 0 && (
            <Link
              href={`/completed/${eventId}/gallery`}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 overflow-hidden text-sm sm:text-base md:text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 relative z-10 transform group-hover:rotate-12 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">View Gallery</span>
              <span className="relative z-10 bg-white/30 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                {totalImages} {totalImages === 1 ? 'Photo' : 'Photos'}
              </span>
            </Link>
          )}
        </div>

        {/* Event Information Card - Glassmorphism - Responsive */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 border border-white/20 animate-fade-in-delay">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Event Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="space-y-2 sm:space-y-3 bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
              <p className="text-xs sm:text-sm font-bold text-yellow-300 uppercase tracking-wider">Event Name</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-white break-words">{completedEvent.event_name}</p>
            </div>
            <div className="space-y-2 sm:space-y-3 bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
              <p className="text-xs sm:text-sm font-bold text-yellow-300 uppercase tracking-wider">Event Date</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-white break-words">{formatDate(completedEvent.event_conducted_date)}</p>
            </div>
          </div>
        </div>

        {/* Results Section - Animated Cards - Responsive */}
        {eventResults.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-center border border-white/20 animate-fade-in-delay">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-4">No Results Available</h3>
            <p className="text-sm sm:text-base text-white/70 px-4">Event results will appear here once they are added.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {eventResults.map((result, index) => (
              <div
                key={result.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] animate-fade-in-delay"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white truncate">Event Results</h3>
                        <p className="text-xs sm:text-sm text-white/60 font-semibold">Result #{index + 1}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-8 text-white/90">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-bold text-sm sm:text-base md:text-lg break-words">{formatDate(result.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-bold text-sm sm:text-base md:text-lg">{result.images?.length || 0} Images</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 1.2s ease-out 0.4s both;
        }
        
        .animate-scale-in {
          animation: scale-in 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

