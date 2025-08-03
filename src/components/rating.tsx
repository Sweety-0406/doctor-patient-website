"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { addRating } from "@/lib/api";

interface RatingComponentProps {
  ratingProp: number;
  appointmentId: string; 
};

export default function RatingComponent({ ratingProp, appointmentId }: RatingComponentProps) {
  const [rating, setRating] = useState<number>(ratingProp);
  const [hover, setHover] = useState<number | null>(null);

  const handleRating = async (star: number) => {
    setRating(star);

    try {
      const res = await addRating(appointmentId, star)
      console.log(res)
      if (res.ok){
        toast.success("Thank you for you rating!!");
      }else{
        toast.error("Something went wrong.")
        setRating(0)
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          className={`cursor-pointer ${
            (hover || rating) >= star ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
    </div>
  );
}
