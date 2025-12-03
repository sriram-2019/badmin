import React from 'react';
import { FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
       <footer className="bg-[#1a3c2f] text-white py-6 px-4 sm:px-6 lg:px-8 text-sm">

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* About Section */}
                    <div className="md:col-span-2">
                        <div className="logo logo-footer text-2xl md:text-3xl mb-2">
                            <span className="code">ASA</span><span className="clubs">associates</span>
                        </div>
                        <p className="text-gray-400 mb-2">
                            Some words about the club.
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.instagram.com/asa_associates23" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={18} />
                            </a>
                            <a href="https://youtube.com/@asaassociates23" className="text-gray-400 hover:text-white transition-colors">
                                <FaYoutube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-1 md:col-start-4 text-left md:text-right">
                        <h4 className="text-base font-semibold mb-2">Contact</h4>
                        <ul className="space-y-1 text-gray-400">
                            <li>
                                <a href="mailto:asaassociates07@gmail.com">asaassociates07@gmail.com</a>
                            </li>
                            <li>
                                <a href="tel:+919884797312">+91 9884797312</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Google Maps Embed */}
               

                {/* Divider */}
                <div className="border-t border-gray-800 my-4"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm">
                    <div className="text-white mb-2 md:mb-0">
                        &copy; {new Date().getFullYear()} kammu&co. All rights reserved.
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-white hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-white hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-white hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
