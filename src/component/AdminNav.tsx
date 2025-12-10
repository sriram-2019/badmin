"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Agbalumo } from "next/font/google";

const agbalumo = Agbalumo({ weight: "400", subsets: ["latin"] });

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className="w-full flex items-center justify-between py-2 px-4">
        {/* Logo */}
        <Link href="/admin-login" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Image
            src="/img/logo.jpeg"
            alt="Logo"
            width={45}
            height={30}
            className="object-contain"
          />
          <div className="leading-tight">
            <span className={`font-bold text-xl ${agbalumo.className}`}>
              ASA <span className="text-xs text-pink-400">Associates</span>
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/admin-login" className="nav-link hover:text-pink-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/admin-login/dashboard" className="nav-link hover:text-pink-400 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin-login/event-reg" className="nav-link hover:text-pink-400 transition-colors">
              Events
            </Link>
          </li>
        </ul>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-2xl focus:outline-none hover:text-pink-400 transition-colors"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-black text-white md:hidden shadow-lg"
          >
            <div className="flex justify-end p-2">
              <button 
                className="text-xl hover:text-pink-400 transition-colors" 
                onClick={() => setOpen(false)}
              >
                ✖
              </button>
            </div>
            <ul className="flex flex-col items-center space-y-3 pb-4 text-base">
              <li>
                <Link
                  href="/admin-login"
                  className="block px-4 py-2 hover:text-pink-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-login/dashboard"
                  className="block px-4 py-2 hover:text-pink-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-login/event-reg"
                  className="block px-4 py-2 hover:text-pink-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Events
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

