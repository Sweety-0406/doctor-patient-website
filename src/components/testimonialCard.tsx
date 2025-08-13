
"use client"
import { BiSolidQuoteSingleRight } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  profession: string;
  description: string;
  iconText: string;
}

const TestimonialCard = ({
  name,
  profession,
  description,
  iconText
}: TestimonialCardProps) => {
  return (
    <motion.div
      className="flex cursor-pointer flex-col justify-start bg-white/80 backdrop-blur-md p-6 rounded-xl shadow border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(13, 148, 136, 0.3)"
      }}
    >
      <div className="flex">
        <BiSolidQuoteSingleRight className="text-violet-200 size-10" />
        <BiSolidQuoteSingleRight className="text-violet-200 -ml-4 size-10" />
      </div>

      <div className="text-zinc-500 text-sm font-thin italic text-start mt-4">
        &quot;{description}&quot;
      </div>

      <div className="flex gap-2 my-3">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <FaStar
              key={idx}
              className="size-[18px] fill-teal-400"
            />
          ))}
      </div>

      <div className="flex gap-3 mt-4">
        <div className="flex justify-center items-center bg-teal-500 from-[#00c4cc] via-[#6420ff] to-[#7d2ae7] p-3 size-12 rounded-full">
          {iconText}
        </div>
        <div className="text-start mt-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-gray-500">{profession}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
