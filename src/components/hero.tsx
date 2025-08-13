
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <main className="min-h-screen relative flex flex-col bg-black overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/images/landing-page3.jpg')] bg-cover bg-center opacity-50 z-0"
        aria-hidden="true"
      />

      <div className="flex items-center justify-center flex-1 px-4">
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT EMPTY SPACE */}
          <div className="md:w-1/2" />

          {/* RIGHT SECTION */}
          <motion.div
            className="md:w-1/2 flex flex-col gap-5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-teal-600">Patient</span> Management System
            </motion.h1>

            <motion.p
              className="text-gray-100 text-base sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              Oncosurgical Unit <br />
              Teaching Hospital Anuradhapura <br />
              Sri Lanka
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            >
              <Link href="/doctor/login">
                <button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded w-fit transition">
                  Login as Doctor
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
