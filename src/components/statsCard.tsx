"use client"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface StatsCardProps{
    title: string,
    description: string,
    icon:IconType | LucideIcon,
    color:string
}

const StatsCard = ({
    title,
    description,
    icon:Icon,
    color
}:StatsCardProps)=>{
    return(
        <div
            className="flex cursor-pointer flex-col justify-center items-center bg-white/80 backdrop-blur-md p-6 py-10 rounded-xl shadow hover:shadow-lg hover:scale-105 group hover:shadow-teal-200 transition border border-gray-100"
        > 
            <div className="size-16 item group-hover:scale-125 transition mb-4 flex justify-center items-center bg-teal-500  p-2 rounded-lg">
                <Icon className={cn("size-8 text-white flex justify-center")} />
            </div>
            <h3 className={`text-2xl md:text-5xl font-semibold ${color}`}>{title}</h3>
            <p className="text-sm text-gray-500 mt-2">
            {description}
            </p>
        </div>
    )
}

export default StatsCard