"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

export default function EventResultsPage() {
  const [eventResults, setEventResults] = useState<EventResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all event results from database (optimized with caching)
  useEffect(() => {
    let isMounted = true;

    async function fetchEventResults() {
      try {
        setIsLoading(true);
        
        const { fetchEventResults } = await import('@/lib/api');
        const data = await fetchEventResults();
        
        if (!isMounted) return;
        
        setEventResults(data);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error fetching event results:", err);
        setError(err.message || "Failed to load event results");
        setEventResults([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEventResults();

    return () => {
      isMounted = false;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading event results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/completed"
            className="text-blue-300 hover:text-blue-100 transition-colors flex items-center gap-2"
          >
            ← Back to Completed Events
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">
          🏆 Event Results
        </h1>
        <p className="text-center text-gray-300 mb-12">
          All completed event results and winners
        </p>

        {/* Event Results List */}
        {eventResults.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No event results found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Event results will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800"
              >
                {/* Event Header */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-4 text-center">
                    {result.event_name}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6 text-lg">
                    <p>
                      📅 <span className="font-semibold">Date:</span>{" "}
                      {formatDate(result.event_date)}
                    </p>
                    {result.winner && (
                      <p>
                        🏆 <span className="font-semibold">Winner:</span>{" "}
                        {result.winner}
                      </p>
                    )}
                    <p>
                      📸 <span className="font-semibold">Images:</span>{" "}
                      {result.images.length}
                    </p>
                  </div>
                </div>

                {/* Event Images Gallery */}
                {result.images.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">
                      Event Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.images
                        .sort((a, b) => a.image_order - b.image_order)
                        .map((img) => (
                          <div
                            key={img.id}
                            className="relative group overflow-hidden rounded-lg border border-gray-700"
                          >
                            <img
                              src={img.image}
                              alt={`${result.event_name} - Image ${img.image_order + 1}`}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">
                                Image {img.image_order + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Divider between events */}
                {result.id !== eventResults[eventResults.length - 1].id && (
                  <div className="mt-8 pt-8 border-t border-gray-800"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
