import { useDoctorAuth } from "@/context/authContext";
import Link from "next/link"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {  usePathname, useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ()=>{
    const pathname = usePathname()
    const { logout } = useDoctorAuth();
    const router = useRouter();

    const logoutHandler = () => {
        router.push("/");
        logout();
    };
    return(
        <nav className="w-full z-10 absolute  h-20 flex justify-between bg-teal-500 shadow-md p-6 flex  justify-between">
            <div className="flex justify-between w-full">
                <Link href="/" className="text-2xl font-bold text-white ">Doc-Center</Link>
                <Sheet >
                    <SheetTrigger className="cursor-pointer" ><GiHamburgerMenu className="text-white" /></SheetTrigger>
                    <SheetContent className="w-48 bg-teal-500">
                        <SheetHeader className="border-b-2">
                            <SheetTitle className="text-white">Doctor Menu</SheetTitle>
                        </SheetHeader>
                            <div className="px-4"> 
                                <div className="flex flex-col text-white gap-4 ">
                                    <Link href="/doctor/dashboard" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/dashboard') && "bg-white text-teal-500 font-semibold text-lg"}`}>🏠 Dashboard</Link>
                                    <Link href="/doctor/appointments" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/appointments') && "bg-white text-teal-500 font-semibold text-lg"}`}>📅 Appointments</Link>
                                    <Link href="/doctor/patients" className={`hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/patients') && "bg-white text-teal-500 font-semibold text-lg"}`}>👥 Patient List</Link>
                                    <Link href="/doctor/prescriptions" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/prescriptions') && "bg-white text-teal-500 font-semibold text-lg"}`}>📝 Prescriptions</Link>
                                    <Link href="/doctor/profile" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/profile') && "bg-white text-teal-500 font-semibold text-lg"}`}>🩺 Profile</Link>
                                </div>
                            </div>
                        <SheetFooter>  
                            <Button onClick={logoutHandler} variant="white">
                                Logout
                            </Button>
                            <SheetClose asChild>
                                <Button variant="white">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

        </nav>
    )
}

export default Navbar

