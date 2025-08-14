
import { useDoctorAuth } from "@/context/authContext";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const SideBar = ()=>{
    const pathname = usePathname()
    const { logout } = useDoctorAuth();
    const router = useRouter();

    const logoutHandler = async() => {
        await router.push("/");
        logout();
    };
    return(
        <aside className="w-full border-r-2  h-screen bg-teal-500 shadow-md py-6 px-2 flex flex-col justify-between">
            <div>
                <Link href="/" className="text-4xl font-bold text-white ">Doc-Center</Link>
                <nav className="flex flex-col text-white gap-4 mt-8">
                    <Link href="/doctor/dashboard" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/dashboard') && "bg-white text-teal-500 font-semibold text-lg"}`}>🏠 Dashboard</Link>
                    <Link href="/doctor/appointments" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/appointments') && "bg-white text-teal-500 font-semibold text-lg"}`}>📅 Appointments</Link>
                    <Link href="/doctor/patients" className={`hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/patients') && "bg-white text-teal-500 font-semibold text-lg"}`}>👥 Patient List</Link>
                    <Link href="/doctor/prescriptions" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/prescriptions') && "bg-white text-teal-500 font-semibold text-lg"}`}>📝 Prescriptions</Link>
                    <Link href="/doctor/feedbacks" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/feedbacks') && "bg-white text-teal-500 font-semibold text-lg"}`}>🎗️ Feedbacks</Link>
                    <Link href="/doctor/profile" className={` hover:text-teal-600  hover:bg-muted   rounded py-1 px-1 ${pathname.includes('doctor/profile') && "bg-white text-teal-500 font-semibold text-lg"}`}>🩺 Profile</Link>
                </nav>
            </div>

            <div className="mt-10">
                <button onClick={logoutHandler} className="w-full cursor-pointer bg-white hover:bg-muted text-teal-500 font-bold py-2 rounded">
                    Logout
                </button>
            </div>
      </aside>
    )
}

export default SideBar