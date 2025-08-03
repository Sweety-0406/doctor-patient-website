"use client";
import { CiSearch } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PiNotepadLight } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface FooterProps{
  page: "home" | "appointment" | "profile" | "records"
}

export default function Footer({page}:FooterProps) {
    const router = useRouter()
  return (
    <footer className="w-full h-full items-center flex justify-between">
      <div onClick={()=>router.push("/patient/dashboard")} className={` items-center hover:text-teal-500 cursor-pointer ${page === "home" && "text-teal-500"}`}>
        <CiSearch className={`size-7   `}/>
        <p className="text-xs">Home</p>
      </div>
      <div onClick={()=>router.push("/patient/appointment")} className={`flex flex-col justify-center items-center hover:text-teal-500 cursor-pointer ${page === "appointment" && "text-teal-500"}`}>
        <FaRegCalendarAlt className={`size-7 r  `}/>
        <p className="text-xs">Appointment</p>
      </div>
      <div onClick={()=>router.push("/patient/records")} className={`flex flex-col justify-center items-center hover:text-teal-500 cursor-pointer ${page === "records" && "text-teal-500"}`}>
        <PiNotepadLight className={`size-7 `}/>
        <p className="text-xs">Records</p>
      </div> 
      <div onClick={()=>router.push("/patient/profile")} className={`flex flex-col justify-center items-center hover:text-teal-500 cursor-pointer ${page === "profile" && "text-teal-500"}`}>
        <FaRegUserCircle className={`size-7 `}/>
        <p className="text-xs">Profile</p>
      </div>
    </footer>
  );
}
