"use client";

export default function Instagram() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <div className="h-48 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center w-full">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          ASA Badminton Club Instagram
        </h1>
      </div>

      {/* Instagram Embed */}
      <div className="w-full max-w-5xl px-4 py-10">
        <iframe
          src="https://www.instagram.com/asa_associates23/embed"
          width="100%"
          height="800"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          className="rounded-xl shadow-lg w-full"
        ></iframe>
      </div>
    </div>
  );
}
