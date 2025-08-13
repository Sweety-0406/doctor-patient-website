

"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  description: string
  icon: IconType | LucideIcon
  color: string
}

const StatsCard = ({
  title,
  description,
  icon: Icon,
  color
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(13, 148, 136, 0.3)" }}
      className="flex cursor-pointer flex-col justify-center items-center bg-white/80 backdrop-blur-md p-6 py-10 rounded-xl shadow border border-gray-100"
    >
      <motion.div
        whileHover={{ rotate: 10 }}
        className="size-16 group-hover:scale-125 transition mb-4 flex justify-center items-center bg-teal-500 p-2 rounded-lg"
      >
        <Icon className={cn("size-8 text-white flex justify-center")} />
      </motion.div>
      <h3 className={`text-2xl md:text-5xl font-semibold ${color}`}>{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </motion.div>
  )
}

export default StatsCard
