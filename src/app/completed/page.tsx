"use client";
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
}

const allEvents: Event[] = [
  {
    id: 1,
    title: "City Marathon 2023",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/2402354/pexels-photo-2402354.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 2,
    title: "Annual Charity Basketball Tournament",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 3,
    title: "Annual Charity Tour",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 4,
    title: "Fitm Slum",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 5,
    title: "Steart",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 6,
    title: "Grand Slam Final",
    date: "October 28, 2023",
    image:
      "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 7,
    title: "Olympic Swimming Championship",
    date: "November 15, 2023",
    image:
      "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 8,
    title: "Professional Boxing Match",
    date: "November 20, 2023",
    image:
      "https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 9,
    title: "International Soccer Cup",
    date: "November 25, 2023",
    image:
      "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 10,
    title: "Cycling World Championship",
    date: "December 5, 2023",
    image:
      "https://images.pexels.com/photos/163407/cycling-bike-trail-sport-163407.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 11,
    title: "Winter Sports Festival",
    date: "December 10, 2023",
    image:
      "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
  {
    id: 12,
    title: "Volleyball Championship",
    date: "December 15, 2023",
    image:
      "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Sports");
  const [isJoined, setIsJoined] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const filteredEvents = allEvents
    .slice(0, visibleEvents)
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        event.category === selectedCategory
    );

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleEvents((prev) => prev + 6);
      setIsLoading(false);
    }, 800);
  };

  const hasMoreEvents = visibleEvents < allEvents.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 text-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">
          Completed Events
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Section */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Sports</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <button
            onClick={() => setIsJoined(!isJoined)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
              isJoined
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Join / Unjoin
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold mb-1 text-white drop-shadow-lg">
                    {event.title}
                  </h3>
                  <p className="text-gray-100 text-sm drop-shadow">
                    {event.date}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <Link
                  href="/completed/event1"
                  className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                             text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200 active:scale-95"
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
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 
                         disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                         text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                "Load More Events"
              )}
            </button>
          </div>
        )}

        {!hasMoreEvents && visibleEvents > 6 && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500 text-sm">No more events to load</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
