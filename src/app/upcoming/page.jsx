"use client";

import React from "react";
import Nav from "../../component/nav"; // ✅ adjust path if needed

/**
 * Event Card Component
 */
const EventCard = ({ title, image, description, formUrl }) => {
  return (
    <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover rounded-md"
      />

      <h3 className="text-2xl font-bold mt-4 text-center">{title}</h3>
      <p className="text-gray-600 text-center mt-3">{description}</p>

      <div className="flex justify-center">
        <a
          href={formUrl}
          className="mt-5 inline-block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all"
        >
          Register Now
        </a>
      </div>
    </div>
  );
};

/**
 * Single Event — Centered Page WITH NAVBAR
 */
const UpcomingEvents = () => {
  const event = {
    title: "ASA Badminton Championship",
    image: "/img/tour.jpg",
    description:
      "Join our annual championship! Compete with top players and showcase your skills on the court.",
    formUrl: "/register",
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <Nav />

      {/* PAGE CONTENT */}
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <EventCard
          title={event.title}
          image={event.image}
          description={event.description}
          formUrl={event.formUrl}
        />
      </div>
    </>
  );
};

export default UpcomingEvents;
