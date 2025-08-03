"use client"
import { useRouter } from "next/navigation";
import React from "react";

const NoAppointmentCard = () => {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center  mt-20">
      <div className="bg-white border border-teal-500 rounded-xl shadow-lg  p-6 w-80 text-center">
        {/* Illustration */}
        <div className="mb-4 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2920/2920349.png"
            alt="No appointment"
            className="w-28"
          />
        </div>
        {/* Heading */}
        <h2 className="text-lg font-semibold mb-2">
          You don&apos;t have an appointment yet
        </h2>
        {/* Description */}
        <p className="text-gray-500 text-sm mb-5">
          Please click the button below to book an appointment.
        </p>
        {/* Button */}
        <button onClick={()=>{router.push("/patient/dashboard")}} className="bg-teal-500  hover:bg-teal-600 cursor-pointer text-white font-medium py-3 px-6 rounded-lg w-full transition-colors">
          Book appointment
        </button>
      </div>
    </div>
  );
};

export default NoAppointmentCard;
