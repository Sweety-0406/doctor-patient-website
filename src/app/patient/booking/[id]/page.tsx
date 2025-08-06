"use client";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById } from "@/lib/api";
import { useEffect, useState } from "react";
import { IoIosArrowDropright } from "react-icons/io";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { Doctor } from "@/app/types";
import { getNextAvailableSlot } from "@/lib/utils";

export default function BookingPage() {
  const { id } = useParams(); 
  const router = useRouter()
  const [doc, setDoc] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const doctor = await getDoctorById(Number(id));
      setDoc(doctor);
    };
    fetchData();
  }, [id]);


  if (!doc) return <div>Loading...</div>;

  const nextAvailable = getNextAvailableSlot({
    available: doc.available,
    startTime: doc.startTime,
    endTime: doc.endTime
  });
  return (
    <div className="relative min-h-screen">
      {/* Header Background */}
      <div className="bg-teal-500 w-full absolute h-40 rounded-b-4xl z-0" />

      <div className="absolute w-full p-4 z-10">
        <div className="flex items-center text-white text-2xl font-semibold mb-8">
          <FaArrowLeft onClick={() => router.back()} className="mr-3 cursor-pointer" />
          Book Appointment
        </div>

        <div className="flex flex-col  gap-6 mx-auto max-w-6xl">
          
          {/* Doctor Card */}
          <div className="bg-white mx-[5%] lg:mx-[10%] shadow rounded-2xl p-4 flex  gap-4 items-center">
            <img
              src={doc.image || "/images/doc.png"}
              alt={doc.name}
              className="rounded-xl w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-cover"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{doc.name}</h2>
              <p className="text-gray-500 text-sm">{doc.specialization}</p>
              <p className="text-teal-500 text-sm">{doc.qualification}</p>
              <p className="text-gray-400 text-xs">Fellow of Sankara Natrayala, Chennai</p>

              {/* Phone Number */}
              <p className="text-sm text-gray-600">📞 {doc.phone || "Not Available"}</p>

              {/* Rating */}
              {doc.rating && (
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {"⭐".repeat(Math.floor(doc.rating))}<span className="text-gray-600 ml-1">({doc.rating}/5)</span>
                </div>
              )}
              <p className="text-sm text-gray-800 font-semibold mb-4">
                💰 Fees: ₹{doc.fees}
              </p>
            </div>
          </div>

          {/* Details Panel */}
          <div className="bg-white shadow rounded-2xl p-6 mx-[5%] lg:mx-w[10%] space-y-4">
            <div>
              <h3 className="font-semibold text-base mb-2">Speciality</h3>
              <div className="flex flex-wrap gap-2">
                {doc.specialties.map((speciality: string) => (
                  <span
                    key={speciality}
                    className="px-3 py-1 text-sm border border-teal-500 bg-teal-50 font-semibold rounded-full"
                  >
                    {speciality}
                  </span>
                ))}
              </div>
            </div>

            {/* About Doctor */}
            <div>
              <h3 className="font-semibold text-base mb-1">About Doctor</h3>
              <p className="text-gray-600 text-sm">{doc.description}</p>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-semibold text-base mb-1">Availability For Consulting</h3>
              <div className="flex flex-wrap gap-2">
                {doc.available.map((day: string) => (
                  <span
                    key={day}
                    className="px-3 w-16 text-center py-1 text-sm border border-teal-500 bg-teal-50  font-semibold rounded-full"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Appointment Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
              <FaCalendarAlt className="text-gray-500 text-xl" />
              <div className="flex justify-between w-full bg-white p-2 rounded-md items-center">
                <div>
                  <p className="text-xs text-teal-500">Earliest Available Appointment</p>
                  <p className="text-sm font-medium">{nextAvailable.date} | {nextAvailable.slot}</p>
                </div>
                <IoIosArrowDropright className="text-gray-400 text-xl" />
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={() => router.push(`/patient/booking/appointment/${id}`)}
              className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 py-3 rounded-lg text-white font-semibold"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
