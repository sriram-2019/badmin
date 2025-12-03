"use client";

import React from "react";
import { FaYoutube, FaInstagram } from 'react-icons/fa';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-50 to-orange-50">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full shadow-lg rounded-2xl overflow-hidden bg-white">
        
        {/* Left side - Contact details */}
        <div className="p-8 bg-rose-100 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-rose-800 mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            We’d love to hear from you. Reach out to us using the details below!
          </p>

          <div className="space-y-3 text-gray-800">
            <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-rose-600" /> asaassociates07@gmail.com</p>
            <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-rose-600" /> +91 9884797312</p>
            <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-600" /> Chennai, India</p>
          </div>

          <div className="flex gap-4 mt-6">
            <a href="https://www.instagram.com/asa_associates23" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={18} />
                                </a>
            <a href="https://youtube.com/@asaassociates23" className="text-gray-400 hover:text-white transition-colors">
                                <FaYoutube size={18} />
                            </a>
          </div>
        </div>

        {/* Right side - Registration link */}
        <div className="p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Want to join us?</h3>
          <p className="text-gray-600 mb-6 text-center">
            Click the button below to register and be part of our community.
          </p>
          <a
            href="/registration"
            className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg shadow hover:bg-rose-700 transition"
          >
            Go to Registration Form
          </a>
        </div>

      </div>
    </div>
  );
}
