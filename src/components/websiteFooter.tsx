"use client"

import React from "react";

export default function WebsiteFooter() {
  return (
    <footer className="bg-teal-500 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="font-bold mb-3">Practo</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-bold mb-3">For patients</h3>
          <ul className="space-y-2">
            <li><a href="#">Search for doctors</a></li>
            <li><a href="#">Search for clinics</a></li>
            <li><a href="#">Search for hospitals</a></li>
            <li><a href="#">Practo Plus</a></li>
            <li><a href="#">Covid Hospital listing</a></li>
            <li><a href="#">Practo Care Clinics</a></li>
            <li><a href="#">Read health articles</a></li>
            <li><a href="#">Read about medicines</a></li>
            <li><a href="#">Practo drive</a></li>
            <li><a href="#">Health app</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-bold mb-3">For doctors</h3>
          <ul className="space-y-2">
            <li><a href="#">Practo Profile</a></li>
          </ul>
          <h3 className="font-bold mt-6 mb-3">For clinics</h3>
          <ul className="space-y-2">
            <li><a href="#">Ray by Practo</a></li>
            <li><a href="#">Practo Reach</a></li>
            <li><a href="#">Ray Tab</a></li>
            <li><a href="#">Practo Pro</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-bold mb-3">For hospitals</h3>
          <ul className="space-y-2">
            <li><a href="#">Insta by Practo</a></li>
            <li><a href="#">Qikwell by Practo</a></li>
            <li><a href="#">Practo Profile</a></li>
            <li><a href="#">Practo Reach</a></li>
            <li><a href="#">Practo Drive</a></li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="font-bold mb-3">For Corporates</h3>
          <ul className="space-y-2">
            <li><a href="#">Wellness Plans</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 text-center text-gray-300">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-[#3ED6FF]">•</span>practo<span className="text-[#3ED6FF]">•</span>
        </h1>
        <p className="text-sm mt-2">Copyright © 2017, Practo. All rights reserved.</p>
      </div>
    </footer>
  );
}
