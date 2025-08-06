"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaChevronDown, FaPhone } from "react-icons/fa";
import { usePatientAuth } from "@/context/patientAuthContext";
import { FaPhoneVolume, FaWhatsapp } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { BsChatDots } from "react-icons/bs";

const faqs = [
  {
    question: "What is Doc-Center",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  { question: "How do I cancel an appointment?", answer: "You can cancel by going to My Appointments page." },
  { question: "Why I can't book appointment?", answer: "Please check your internet or doctor's availability." },
  { question: "Why are there no appointment slots available?", answer: "Doctor may not be available currently." },
];

export default function HelpAndSupportPage() {
  const { patient, loading } = usePatientAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"FAQ" | "Contact">("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !patient) {
      router.push("/patient/login");
    }
  }, [loading, patient]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex lg:px-[5%] bg-teal-500 items-center p-4 border-b bg-whit">
        <button onClick={() => router.back()} className="text-white cursor-pointer text-xl md:text-2xl">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg text-white md:text-2xl font-semibold ml-4">Help and support</h1>
      </div>

      {/* Tabs */}
      <div className="md:px[10%]  flex justify-around border-b bg-white">
        {["FAQ", "Contact"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "FAQ" | "Contact")}
            className={`relative cursor-pointer py-2 text-sm md:text-lg font-medium ${
              activeTab === tab ? "text-teal-500" : "text-gray-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-teal-500"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="md:px-[10%] flex-1 overflow-y-auto p-4">
        {activeTab === "FAQ" && (
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="transform transition-transform duration-300 hover:scale-105 bg-white border rounded-lg p-3 shadow-sm cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{item.question}</span>
                  <FaChevronDown
                    className={`transform transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-2 text-gray-500 text-sm">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "Contact" && (
          <div className="space-y-4">
            {/* Call */}
            <div className="transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-teal-100 rounded-full">
                <FaPhoneVolume className="text-teal-500 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Call us</p>
                <p className="text-gray-500 text-sm">+91 98745 61238</p>
              </div>
            </div>

            {/* Email */}
            <div className="transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-violet-100 rounded-full">
                <IoIosMail  className="text-violet-500 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email us</p>
                <p className="text-gray-500 text-sm">support@doc-center.com</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-green-100 rounded-full">
                <FaWhatsapp  className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">WhatsApp</p>
                <p className="text-gray-500 text-sm">+91 98745 61238</p>
              </div>
            </div>

            {/* Live Chat */}
            <div className="transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-blue-100 rounded-full">
                <BsChatDots  className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Live Chat</p>
                <p className="text-gray-500 text-sm">Available 9 AM - 8 PM</p>
              </div>
            </div>
          </div>
        )}

      </div>

      
    </div>
  );
}
