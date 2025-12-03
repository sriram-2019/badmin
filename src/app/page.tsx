"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import heroImage from "@/img/pic1.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import Youtube from "@/component/youtube";
import { Agbalumo } from "next/font/google";
import Insta from "@/component/insta";

const agbalumo = Agbalumo({ weight: "400", subsets: ["latin"] });
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [showYoutube, setShowYoutube] = useState(false);
  const [showInsta, setShowInsta] = useState(false);

  const youtubeRef = useRef<HTMLDivElement | null>(null);
  const instaRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to YouTube
  useEffect(() => {
    if (showYoutube && youtubeRef.current) {
      youtubeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showYoutube]);

  // Auto-scroll to Insta
  useEffect(() => {
    if (showInsta && instaRef.current) {
      instaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showInsta]);

  // Toggle handlers
  const handleYoutubeToggle = () => {
    setShowYoutube((prev) => !prev);
  };

  const handleInstaToggle = () => {
    setShowInsta((prev) => !prev);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
    <section className="relative h-[85vh] w-full mt-[64px]">
  <Image
    src={heroImage}
    alt="Badminton hero banner"
    fill
    priority
    className="object-cover object-center"
  />

  <div className="absolute inset-0 bg-black/40" />

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
  <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight drop-shadow-2xl uppercase">
    Smash Your Limits
    <span className="block text-pink-400">With Every Serve & Every Smash</span>
  </h1>

  <p className="text-lg md:text-2xl mt-8 text-white/80 font-light">
    Champions rise here — join us and feel the thrill of true competition.
  </p>
</div>


</section>


      {/* Achievements Section */}
      <Achievements
        onYoutubeClick={handleYoutubeToggle}
        onInstaClick={handleInstaToggle}
      />

      {/* YouTube Embed */}
      <AnimatePresence>
        {showYoutube && (
          <motion.div
            ref={youtubeRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            <Youtube />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram Embed */}
      <AnimatePresence>
        {showInsta && (
          <motion.div
            ref={instaRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            <Insta />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg">
      <div className="w-full flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/img/logo.jpeg"
            alt="Logo"
            width={60}
            height={40}
            className="object-contain"
          />
          <div className="leading-tight">
           <span className={`font-bold text-2xl ${agbalumo.className}`}>
  ASA <span className="text-sm text-pink-400">Associates</span>
</span>


          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link">
              Tournaments
            </Link>
          </li>
          <li>
            <Link href="/Contact_Us" className="nav-link">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-3xl focus:outline-none"
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
            <div className="flex justify-end p-4">
              <button className="text-2xl" onClick={() => setOpen(false)}>
                ✖
              </button>
            </div>
            <ul className="flex flex-col items-center space-y-4 pb-6 text-lg">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 hover:text-pink-400"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:text-pink-400"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/tournaments"
                  className="block px-4 py-2 hover:text-pink-400"
                  onClick={() => setOpen(false)}
                >
                  Tournaments
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ---------------- ACHIEVEMENTS ---------------- */
function Achievements({
  onYoutubeClick,
  onInstaClick,
}: {
  onYoutubeClick: () => void;
  onInstaClick: () => void;
}) {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        {/* Swiper Slider */}
        <div className="relative w-full md:w-[500px] h-[250px] md:h-[300px] mx-auto overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="w-full h-full overflow-hidden shadow-xl rounded-lg"
          >
            <SwiperSlide>
              <div className="rhombus-img">
                <img
                  src="/img/WhatsApp Image 2025-09-19 at 23.40.32_dfc68ea3.jpg"
                  alt="Badminton 1"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rhombus-img">
                <img
                  src="/img/WhatsApp Image 2025-09-19 at 23.40.31_63410364.jpg"
                  alt="Badminton 2"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rhombus-img">
                <img
                  src="/img/WhatsApp Image 2025-09-19 at 23.40.31_2648f40c.jpg"
                  alt="Badminton 3"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Achievement Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/upcoming" className="btn-upcoming">
            🏆 Upcoming Event
          </Link>

          <Link href="/completed" className="btn-upcoming">
            <span style={{ fontSize: "2rem", marginRight: "0.5rem" }}>✔️</span>
            <span style={{ fontSize: "1.5rem" }}>Completed Events</span>
          </Link>
        </div>
      </div>

      {/* Stay Connected */}
      <div className="text-center mt-16">
        <h2 className="font-bold text-3xl text-dark">
          Stay <span className="text-pink-500">Connected</span>
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Follow us on social media and never miss an update!
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-6">
          {/* Instagram */}
          <button
            onClick={onInstaClick}
            className="btn btn-outline-danger rounded-circle flex items-center justify-center"
            style={{ width: "50px", height: "50px" }}
          >
            <i className="bi bi-instagram fs-4"></i>
          </button>

          {/* YouTube */}
          <button
            onClick={onYoutubeClick}
            className="btn btn-outline-danger rounded-circle flex items-center justify-center"
            style={{ width: "50px", height: "50px" }}
          >
            <i className="bi bi-youtube fs-4"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
