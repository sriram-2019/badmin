"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react"; // for search icon
import Image from "next/image";
const links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Tournaments", href: "/events" },
  { name: "Contacts", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50 border-t-4 border-pink-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
      

        {/* Menu */}
        <ul className="flex space-x-6 text-sm font-medium items-center">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`px-3 py-1 rounded-md transition ${
                  pathname === link.href
                    ? "bg-pink-500 text-white"
                    : "hover:text-pink-400"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Search Icon */}
          <li>
            <button className="hover:text-pink-400">
              <Search size={18} />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
