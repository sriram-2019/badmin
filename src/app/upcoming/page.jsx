"use client";

import React from "react";

/**
 * @typedef {Object} EventCardProps
 * @property {string} title
 * @property {string} image
 * @property {string} description
 * @property {string} formUrl
 */

/**
 * @param {EventCardProps} props
 */
const EventCard = ({ title, image, description, formUrl }) => {
  return (
    <div className="w-full max-w-md bg-gray-100 p-4 rounded-lg shadow-md">
      {/* image fills the card width and keeps aspect ratio */}
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover rounded-md"
      />

      <h3 className="text-xl font-bold mt-4 text-center">{title}</h3>
      <p className="text-gray-600 text-center mt-2">{description}</p>

      <div className="flex justify-center">
        <a
          href={formUrl}
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all"
        >
          Register Now
        </a>
      </div>
    </div>
  );
};

/**
 * UpcomingEvents component
 */
const UpcomingEvents = () => {
  const events = [
    {
      title: "ASA Badminton Championship",
      image: "/img/tour.jpg",
      description:
        "Join our annual championship! Compete with the best players in the club and showcase your skills on the court.",
      formUrl: "/register",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Upcoming Badminton Events
      </h1>

      {/* center each grid item; cards have a max width so images fill them */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            image={event.image}
            description={event.description}
            formUrl={event.formUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
