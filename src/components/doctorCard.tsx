"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { isDoctorAvailableToday } from "@/lib/utils";

type dataType = {
  id: string;
  name: string;
  specialization: string;
  image: string;
  description: string;
  timing: string;
  rating?: number;
  fees: number
  available:string[]
};

export default function DoctorCard({
  id,
  name,
  specialization,
  timing,
  description,
  image,
  rating = 3.5, 
  fees = 500,
  available
}: dataType) {
  const [isFav, setIsFav] = useState(false);
  const router = useRouter();
  const availableToday = isDoctorAvailableToday(available);

  const onClickHandler = (
    e: React.MouseEvent<HTMLDivElement | SVGElement>
  ) => {
    e.stopPropagation();
    setIsFav((val) => !val);
  };

  return (
    <div
      className="max-w-sm relative my-4 bg-white rounded-3xl shadow-lg overflow-hidden  hover:shadow-xl transition duration-300 hover:scale-105"
    >
      <div className="absolute z-15 right-5 top-5">
        <FiHeart
            onClick={onClickHandler}
            className={`text-xl cursor-pointer transition ${
              isFav ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
      </div>
      <div className="relative h-28 w-full bg-gradient-to-t from-white to-teal-500">
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white">
          <Image
            src={image || "/images/doc.png"}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-12 pb-6 px-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg text-center w-full font-semibold text-gray-800">{name}</h3>
          
        </div>
        <p className="text-sm text-teal-500 font-medium mb-3">
          {specialization}
        </p>

        <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {rating.toFixed(1)}
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              availableToday
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            {availableToday ? "Available Today" : "Not Available"}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">{description}</p>
        <p className="text-sm text-gray-700 font-semibold mb-4">
          ⏰ {timing}
        </p>
        <p className="text-sm text-gray-800 font-semibold mb-4">
          💰 Fees: ₹{fees}
        </p>

        <button onClick={()=>router.push(`/patient/booking/${id}`)} className="mt-2 cursor-pointer w-full text-teal-500 bg-white py-2 border-2 hover:text-white hover:bg-teal-500 border-teal-500 rounded-full text-sm font-semibold">
          View & book
        </button>
      </div>
      
    </div>
  );
}
