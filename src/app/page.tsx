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
            className="mt-10 relative"
          >
            {/* Close Button - Fixed Position */}
            <button
              onClick={handleYoutubeToggle}
              className="fixed top-24 right-6 z-[60] bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-white"
              aria-label="Close YouTube"
              title="Close YouTube"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
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
            className="mt-10 relative"
          >
            {/* Close Button - Fixed Position */}
            <button
              onClick={handleInstaToggle}
              className="fixed top-24 right-6 z-[60] bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-white"
              aria-label="Close Instagram"
              title="Close Instagram"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
            <Insta />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Admin Button - Bottom Right */}
      <Link
        href="/admin-login"
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110 group"
        title="Admin Login"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Admin
        </span>
      </Link>
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
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/upcoming" className="nav-link">
              Tournaments
            </Link>
          </li>
          <li>
            <Link href="/Contact_Us" className="nav-link">
              Contact Us
            </Link>
          </li>
          <li>
            <Link 
              href="/admin-login" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔐 Admin
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
                  href="/upcoming"
                  className="block px-4 py-2 hover:text-pink-400"
                  onClick={() => setOpen(false)}
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/Contact_Us"
                  className="block px-4 py-2 hover:text-pink-400"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
              <li className="w-full px-4">
                <Link
                  href="/admin-login"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  🔐 Admin Login
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
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        {/* Modern Image Carousel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[350px] md:h-[400px] mx-auto group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ 
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-white/60 !w-3 !h-3',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-pink-500 !w-8'
              }}
              loop={true}
              className="w-full h-full"
            >
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/img/WhatsApp Image 2025-09-19 at 23.40.32_dfc68ea3.jpg"
                    alt="Badminton Event 1"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/img/WhatsApp Image 2025-09-19 at 23.40.31_63410364.jpg"
                    alt="Badminton Event 2"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/img/WhatsApp Image 2025-09-19 at 23.40.31_2648f40c.jpg"
                    alt="Badminton Event 3"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </motion.div>

        {/* Modern Event Buttons with Logo and Glitter */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* Upcoming Event Button */}
          <Link 
            href="/upcoming"
            className="group relative block overflow-hidden rounded-3xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 hover:scale-[1.02]"
            style={{ minHeight: '140px' }}
          >
            {/* Glitter/Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 via-pink-500 to-purple-600 bg-[length:200%_200%] animate-gradient-shine opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            
            {/* Glitter Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-transparent via-white/30 to-transparent transform rotate-45 animate-shimmer" />
            </div>
            
            <div className="relative p-6 md:p-8 flex items-center gap-4 md:gap-6">
              {/* Logo/Icon */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-2 border-white/40">
                <Image
                  src="/img/logo.jpeg"
                  alt="Logo"
                  width={45}
                  height={30}
                  className="object-contain"
                />
              </div>
              {/* Trophy Icon */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-2xl md:text-3xl opacity-90 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12 transition-all drop-shadow-lg">
                🏆
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-1 md:mb-2 group-hover:translate-x-2 transition-transform drop-shadow-lg">
                  Upcoming Event
                </h3>
                <p className="text-white/95 text-xs md:text-sm lg:text-base font-medium">
                  Discover tournaments coming soon
                </p>
              </div>
              {/* Arrow */}
              <div className="text-white text-2xl md:text-3xl group-hover:translate-x-3 transition-transform drop-shadow-lg">
                →
              </div>
            </div>
          </Link>

          {/* Completed Events Button */}
          <Link 
            href="/completed"
            className="group relative block overflow-hidden rounded-3xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 hover:scale-[1.02]"
            style={{ minHeight: '140px' }}
          >
            {/* Glitter/Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 via-blue-500 to-purple-600 bg-[length:200%_200%] animate-gradient-shine opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            
            {/* Glitter Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-transparent via-white/30 to-transparent transform rotate-45 animate-shimmer" />
            </div>
            
            <div className="relative p-6 md:p-8 flex items-center gap-4 md:gap-6">
              {/* Logo/Icon */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-2 border-white/40">
                <Image
                  src="/img/logo.jpeg"
                  alt="Logo"
                  width={45}
                  height={30}
                  className="object-contain"
                />
              </div>
              {/* Checkmark Icon */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-2xl md:text-3xl opacity-90 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-12 transition-all drop-shadow-lg">
                ✓
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-1 md:mb-2 group-hover:translate-x-2 transition-transform drop-shadow-lg">
                  Completed Events
                </h3>
                <p className="text-white/95 text-xs md:text-sm lg:text-base font-medium">
                  Relive past tournaments & championships
                </p>
              </div>
              {/* Arrow */}
              <div className="text-white text-2xl md:text-3xl group-hover:translate-x-3 transition-transform drop-shadow-lg">
                →
              </div>
            </div>
          </Link>
        </motion.div>
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
