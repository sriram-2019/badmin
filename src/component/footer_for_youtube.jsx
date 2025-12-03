"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-md">
      {/* Banner Image */}
      <div className="relative w-full h-40 md:h-56">
        <Image
          src="/img/badminton-banner.jpg" // <-- place your academy banner in public/img/
          alt="Badminton Academy Banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Logo + Academy Name */}
      <div className="flex items-center px-6 py-4">
        <Image
          src="/img/logo.png" // <-- your academy logo in public/img/
          alt="Academy Logo"
          width={60}
          height={60}
          className="rounded-full border shadow"
        />
        <h1 className="ml-4 text-2xl font-bold text-gray-800">
          Smash Badminton Academy
        </h1>
      </div>
    </header>
  );
}
