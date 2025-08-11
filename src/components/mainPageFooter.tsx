"use client";

import { FaGithub, FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8  rounded-lg bg-gradient-to-r from-teal-500  to-teal-700" />
            <div className="font-bold text-lg">Doc-Center</div>
          </div>
          <p className="mt-2 text-gray-500 text-sm max-w-xs">
            The ultimate design platform for creators, teams, and businesses worldwide.
          </p>
          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
              <div className="size-6">
                  <Image className="mt-1 object-cover w-full h-full" src="/images/fb-logo.png" alt="fb-logo" width={45} height={45}/>
              </div>
              <div className="size-8">
                  <Image className="object-cover w-full h-full" src="/images/twitter-logo.png" alt="twitter-logo" width={45} height={45}/>
              </div>
              <div className="size-8">
                  <Image className="object-cover w-full h-full" src="/images/insta-logo.png" alt="insta-logo" width={45} height={45}/>
              </div>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-gray-900">Features</a></li>
            <li><a href="#" className="hover:text-gray-900">Templates</a></li>
            <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
            <li><a href="#" className="hover:text-gray-900">Enterprise</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
            <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
            <li><a href="#" className="hover:text-gray-900">Community</a></li>
            <li><a href="#" className="hover:text-gray-900">API Docs</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-gray-900">About</a></li>
            <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            <li><a href="#" className="hover:text-gray-900">Press</a></li>
            <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-sm">
        © 2024 PixelForge. All rights reserved.
      </div>
    </footer>
  );
}
