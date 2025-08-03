'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { LuStethoscope } from "react-icons/lu";

export default function Home() {
  const router = useRouter()
  return (
    <main className="min-h-screen relative flex flex-col bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/images/landing-page3.jpg')] bg-cover bg-center opacity-50 z-0"
        aria-hidden="true"
      />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 flex justify-between items-center ">
        {/* <h2 className="text-white text-xl font-bold"><LuStethoscope className='size-10' /></h2> */}
        <img onClick={()=>router.push("/")} src="/images/logo.png" alt="" width={50} height={50} className='cursor-pointer'/>
        <div className="flex gap-4">
          <Link href="/doctor/login">
            <span className="text-white hover:bg-teal-600 transition bg-teal-500 p-1 px-2 rounded cursor-pointer"> Login as Doctor</span>
          </Link> 
          <Link href="/patient/login">
            <span className="text-white hover:bg-teal-600 transition bg-teal-500 p-1 px-2 rounded cursor-pointer"> Login as Patient</span>
          </Link>
        </div>
      </nav>


      <div className="flex items-center justify-center flex-1 px-4">
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT EMPTY SPACE  */}
          <div className="md:w-1/2" />
          
          {/* RIGHT SECTION */}
          <div className="md:w-1/2 flex flex-col gap-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              <span className="text-teal-600">Patient</span> Management System
            </h1>
            <p className="text-gray-100 text-base sm:text-lg">
              Oncosurgical Unit <br />
              Teaching Hospital Anuradhapura <br />
              Sri Lanka
            </p>

            <Link href="/doctor/login">
              <button className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded w-fit transition">
                Login as Doctor
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
