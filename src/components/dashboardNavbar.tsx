"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { GiHamburgerMenu } from "react-icons/gi"


const DashboardNavbar = ()=>{
    const router = useRouter()
    return(
        <nav className="absolute h-[58px] fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-5 ">
            <img onClick={()=>router.push("/")} src="/images/logo.png" alt="" width={50} height={50} className='cursor-pointer'/>
            <nav className="hidden md:flex space-x-6 lg:space-x-10 text-sm lg:text-lg font-medium text-teal-500">
                <Link href="#features">Features</Link>
                <Link href="#about">About</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="#contact">Contact</Link>
            </nav>
            <div className="flex gap-4">
                <Link href="/doctor/login">
                    <span className="text-white hover:bg-teal-600 transition bg-teal-500 p-1 px-2 rounded cursor-pointer"> Login as Doctor</span>
                </Link> 
                <Link href="/patient/login">
                    <span className="text-white hover:bg-teal-600 transition bg-teal-500 p-1 px-2 rounded cursor-pointer"> Login as Patient</span>
                </Link>
                <div className="block md:hidden">
                    <Sheet >
                        <SheetTrigger className="cursor-pointer" ><GiHamburgerMenu /></SheetTrigger>
                        <SheetContent className="w-48 bg-teal-500">
                            <SheetHeader className="border-b-2">
                                <SheetTitle className="text-white">Doctor Menu</SheetTitle>
                            </SheetHeader>
                                <div className="px-4"> 
                                    <div className="flex flex-col text-white gap-4 ">
                                        <Link href="#features" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 `}>Features</Link>
                                        <Link href="#about" className={`hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 `}>About</Link>
                                        <Link href="#pricing" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 `}>Pricing</Link>
                                        <Link href="#contact" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 `}>Contact</Link>
                                    </div>
                                </div>
                            <SheetFooter>  
                                <SheetClose asChild>
                                    <Button variant="white">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
      </nav>
    )
}

export default DashboardNavbar