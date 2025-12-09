"use client";

import React from "react";
import { FaYoutube, FaInstagram } from 'react-icons/fa';
import { Mail, Phone, MapPin, Send, Users, Trophy, Calendar } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
              Contact Us
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Let's Connect
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Want to join our badminton community? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Left side - Badminton Image & Contact Info */}
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Badminton Image Section */}
            <div className="relative h-64 sm:h-80 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
              {/* Badminton Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/img/tour.jpg"
                  alt="Badminton"
                  className="w-full h-full object-cover opacity-20"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Badminton Icon/Illustration Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Badminton Racket SVG */}
                  <svg 
                    className="w-32 h-32 sm:w-40 sm:h-40 text-white opacity-90 animate-pulse"
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Racket Frame */}
                    <ellipse cx="50" cy="50" rx="35" ry="45" stroke="currentColor" strokeWidth="3" fill="none"/>
                    {/* Racket Handle */}
                    <rect x="45" y="85" width="10" height="15" fill="currentColor" rx="2"/>
                    {/* Strings */}
                    <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="30" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="35" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="65" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  
                  {/* Shuttlecock */}
                  <div className="absolute -top-8 -right-8 animate-bounce">
                    <svg className="w-12 h-12 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L8 8h8l-4-6zm0 6l-2 4h4l-2-4zm-2 4l-2 4h8l-2-4H10z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Contact Details */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                We'd love to hear from you. Reach out to us using any of the methods below!
              </p>

              <div className="space-y-4 mb-6">
                <a 
                  href="mailto:asaassociates07@gmail.com"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-gray-800 font-semibold">asaassociates07@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="tel:+919884797312"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-gray-800 font-semibold">+91 9884797312</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-gray-800 font-semibold">Chennai, India</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-4 font-medium">Follow Us</p>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/asa_associates23" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a 
                    href="https://youtube.com/@asaassociates23" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <FaYoutube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Quick Actions & Registration */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Join Our Community</h3>
                </div>
                <p className="text-indigo-100 mb-6">
                  Become part of our badminton family! Register now to participate in tournaments and events.
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Register Now
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Tournaments</h4>
                <p className="text-sm text-gray-600">Join exciting badminton tournaments and competitions</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Events</h4>
                <p className="text-sm text-gray-600">Stay updated with our upcoming events and activities</p>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Quick Response
              </h4>
              <p className="text-sm text-gray-700">
                We typically respond within 24 hours. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
