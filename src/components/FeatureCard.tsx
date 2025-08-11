"use client"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface FeatureCardProps{
    title: string,
    description: string,
    icon:IconType | LucideIcon,
}

const FeatureCard = ({
    title,
    description,
    icon:Icon
}:FeatureCardProps)=>{
    return(
        <div
            className="flex cursor-pointer flex-col justify-start bg-white/80 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 group hover:shadow-teal-200 transition border border-gray-100"
        > 
            <div className="size-10 group-hover:scale-125 transition mb-4 flex justify-center items-center bg-teal-500  p-2 rounded-lg">
                <Icon className={cn("size-8 text-white flex justify-center")} />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-2">
            {description}
            </p>
        </div>
    )
}

export default FeatureCard