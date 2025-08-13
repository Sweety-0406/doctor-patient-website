
"use client"
import { cn } from "@/lib/utils"
import { LiaRupeeSignSolid } from "react-icons/lia";
import { RxCheck } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PricingCardProps {
    title: string,
    cost: string,
    costText: string,
    features: string[],
    description: string,
    popular?: boolean
}

const PricingCard = ({
    title,
    cost,
    costText,
    features,
    description,
    popular
}: PricingCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`
                cursor-pointer relative bg-white/80 backdrop-blur-md p-6 py-10 rounded-xl shadow-lg transition
                ${popular
                    ? "border-2 shadow-teal-200 scale-y-110 scale-x-105 border-teal-500"
                    : "border border-gray-200"}
            `}
        >
            {popular && (
                <div className="absolute mx-auto hover:cursor-default -top-5 w-full">
                    <Button variant="teal" className="items-center hover:cursor-default text-white">
                        Most popular
                    </Button>
                </div>
            )}
            <div className="flex flex-col gap-3">
                <div className="font-bold text-start text-xl md:text-3xl">{title}</div>
                <div className="flex">
                    <div className="font-bold flex gap-0 text-3xl md:text-4xl">
                        <LiaRupeeSignSolid className="mt-[3px]" />{cost}
                    </div>
                    <p className="mt-3 ml-1 text-gray-500">/{costText}</p>
                </div>
                <div className="text-start text-gray-500">{description}</div>
            </div>
            <div className="my-8 space-y-2">
                {features.map((f, i) => (
                    <div key={i} className="text-gray-700 flex gap-2">
                        <RxCheck className="text-cyan-500 size-7" /> {f}
                    </div>
                ))}
            </div>
            <Button
                variant="teal"
                className="w-full hover:scale-105 transition text-white font-bold px-6 py-3 rounded-lg shadow-md hover:opacity-70"
            >
                Get Started
            </Button>
        </motion.div>
    )
}

export default PricingCard;
