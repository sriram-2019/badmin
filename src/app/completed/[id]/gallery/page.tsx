"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CompletedEvent, EventResult } from "@/lib/api";

export default function GalleryPage() {
  const params = useParams();
  const eventId = params?.id as string;
  
  const [completedEvent, setCompletedEvent] = useState<CompletedEvent | null>(null);
  const [eventResults, setEventResults] = useState<EventResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch completed event and matching event results
  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) return;

      try {
        setIsLoading(true);
        
        // Fetch all completed events and event results in parallel (optimized)
        const { fetchCompletedEvents, fetchEventResults } = await import('@/lib/api');
        const [completedEvents, allResults] = await Promise.all([
          fetchCompletedEvents(),
          fetchEventResults(),
        ]);
        
        const event = completedEvents.find((e: CompletedEvent) => e.id === parseInt(eventId));
        
        if (!event) {
          throw new Error("Event not found");
        }
        
        setCompletedEvent(event);
        
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

  // Collect all images from all matching event results
  const allImages = eventResults.flatMap(result => 
    (result.images || []).map(img => ({
      ...img,
      eventResultId: result.id,
      eventName: result.event_name
    }))
  ).sort((a, b) => a.image_order - b.image_order);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error || !completedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-sm sm:text-base px-4">Error: {error || "Event not found"}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Header - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <Link
            href={`/completed/${eventId}`}
            className="text-blue-300 hover:text-blue-100 transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Back to Event Details</span>
            <span className="xs:hidden">Back</span>
          </Link>
        </div>

        {/* Gallery Header - Responsive */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 break-words">
            📸 {completedEvent.event_name} - Gallery
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4 md:mb-6">
            📅 {formatDate(completedEvent.event_conducted_date)}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            {allImages.length} {allImages.length === 1 ? 'Image' : 'Images'}
          </p>
        </div>

        {/* Gallery Grid - Responsive */}
        {allImages.length === 0 ? (
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-800 text-center">
            <p className="text-gray-400 text-base sm:text-lg">No images available for this event yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {allImages.map((img, index) => (
              <div
                key={img.id || index}
                className="relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={() => setSelectedImage(img.image)}
              >
                <div className="aspect-square relative">
                  <img
                    src={img.image}
                    alt={`${completedEvent.event_name} - Image ${img.image_order + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs sm:text-sm text-center font-medium">
                    Image {img.image_order + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal - Responsive */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[95vh] sm:max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

