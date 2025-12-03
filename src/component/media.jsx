"use client";

import React, { useState } from "react";

export default function MediaGallery({ images = [] }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-4">
      {/* Grid of images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Gallery ${index}`}
            className="rounded-lg cursor-pointer hover:opacity-80"
            onClick={() => setSelected(img)}
          />
        ))}
      </div>

      {/* Modal view */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="Selected"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
