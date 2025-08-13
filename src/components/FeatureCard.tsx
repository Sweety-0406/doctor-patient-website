
"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"
import { motion } from "framer-motion"

interface FeatureCardProps {
    title: string
    description: string
    icon: IconType | LucideIcon
    index?: number 
}

const FeatureCard = ({
    title,
    description,
    icon: Icon,
    index = 0
}: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.15, 
                ease: "easeOut"
            }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            className="flex cursor-pointer flex-col justify-start bg-white/80 backdrop-blur-md p-6 rounded-xl shadow border border-gray-100 hover:shadow-lg hover:shadow-teal-200 group transition"
        >
            <motion.div
                whileHover={{ rotate: 5, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="size-10 mb-4 flex justify-center items-center bg-teal-500 p-2 rounded-lg"
            >
                <Icon className={cn("size-8 text-white flex justify-center")} />
            </motion.div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-2">{description}</p>
        </motion.div>
    )
}

export default FeatureCard
