"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { CompletedEvent } from "@/lib/api";

function App() {
  const [events, setEvents] = useState<CompletedEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState(6);

  // Fetch completed events from database with caching
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    async function fetchCompletedEvents() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use optimized fetch with caching
        const { fetchCompletedEvents: fetchEvents } = await import('@/lib/api');
        
        // Start fetching in the background
        const dataPromise = fetchEvents();
        
        // Show skeleton immediately, don't block UI
        if (!isMounted) return;
        
        const data = await dataPromise;
        
        if (!isMounted) return;
        
        setEvents(data);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error fetching completed events:", err);
        setError(err.message || "Failed to load completed events");
        setEvents([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCompletedEvents();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter events based on search term
  const filteredEvents = events
    .slice(0, visibleEvents)
    .filter((event) =>
      event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleLoadMore = () => {
    setVisibleEvents((prev) => prev + 6);
  };

  const hasMoreEvents = visibleEvents < events.length;

  // Skeleton loader component
  const EventSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="relative h-96 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Retry function
  const retryFetch = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 text-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          Completed Events
        </h1>

        {/* Search Bar */}
        {!isLoading && events.length > 0 && (
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-600 mb-3">Error: {error}</p>
            <button
              onClick={retryFetch}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No completed events found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Completed events will appear here once they are added.
            </p>
          </div>
        ) : !isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative h-96 bg-gray-100">
                    {event.poster ? (
                      <>
                        <img
                          src={
                            event.poster.startsWith('http') || event.poster.startsWith('/')
                              ? event.poster // URL format
                              : event.poster.startsWith('data:')
                              ? event.poster // Base64 with data URI
                              : `data:image/jpeg;base64,${event.poster}` // Base64 without prefix
                          }
                          alt={event.event_name}
                          className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          onLoad={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                              fallback.classList.remove('hidden');
                            }
                          }}
                          style={{ opacity: 0 }}
                        />
                        <div className="hidden w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center absolute inset-0">
                          <p className="text-gray-400 text-sm">Failed to load image</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center absolute inset-0">
                        <p className="text-gray-400">No poster available</p>
                      </div>
                    )}
                    {/* Overlay with text - lighter overlay so image is visible */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-10">
                      <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                        {event.event_name}
                      </h3>
                      <p className="text-gray-100 text-base drop-shadow">
                        {formatDate(event.event_conducted_date)}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <Link
                      href={`/completed/${event.id}`}
                      className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                                 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200 active:scale-95 text-base"
                    >
                      View Results & Gallery
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Section */}
            {hasMoreEvents && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                             text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  Load More Events
                </button>
              </div>
            )}

            {!hasMoreEvents && visibleEvents > 6 && (
              <div className="flex justify-center mt-8">
                <p className="text-gray-500 text-sm">No more events to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
