"use client";

import React from "react";

const CyclingChampionshipPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-4">🏆</span>
        <h1 className="text-4xl font-bold">Cycling Championship 2023</h1>
        <p className="text-lg text-gray-300 mt-2">Stage 5: Mountain Ascent</p>
        <button className="mt-6 px-6 py-3 border rounded-lg hover:bg-white hover:text-black transition">
          📸 View Media
        </button>
      </div>

      {/* Results Section */}
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-lg p-8 mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          🏅 Event Results
        </h2>
        <div className="space-y-4">
          <p className="text-lg">
            📅 <span className="font-semibold">Date:</span> 25th September 2025
          </p>
          <p className="text-lg">
            🏆 <span className="font-semibold">Winner:</span> Asa
          </p>
          <p className="text-lg">
            🥈 <span className="font-semibold">Runner-up:</span> Bharadhan
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyclingChampionshipPage;
