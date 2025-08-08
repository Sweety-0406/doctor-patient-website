import { useDoctorAuth } from "@/context/authContext";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const SideBar = ()=>{
    const pathname = usePathname()
    const { logout } = useDoctorAuth();
    const router = useRouter();

    const logoutHandler = () => {
        router.push("/");
        logout();
    };
    return(
        <aside className="w-full border-r-2  h-screen bg-white shadow-md p-6 flex flex-col justify-between">
            <div>
                <Link href="/" className="text-2xl font-bold text-teal-600 ">Doc-Center</Link>
                <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/doctor/dashboard" className={`text-gray-700 hover:text-teal-600 hover:text-white hover:bg-teal-500 rounded py-1 px-1 ${pathname.includes('doctor/dashboard') && "bg-teal-500 text-white font-semibold text-lg"}`}>🏠 Dashboard</Link>
                    <Link href="/doctor/appointments" className={`text-gray-700 hover:text-teal-600 hover:text-white hover:bg-teal-500 rounded py-1 px-1 ${pathname.includes('doctor/appointments') && "bg-teal-500 text-white font-semibold text-lg"}`}>📅 Appointments</Link>
                    <Link href="/doctor/patients" className={`text-gray-700 hover:text-teal-600 hover:text-white hover:bg-teal-500 rounded py-1 px-1 ${pathname.includes('doctor/patients') && "bg-teal-500 text-white font-semibold text-lg"}`}>👥 Patient List</Link>
                    <Link href="/doctor/prescriptions" className={`text-gray-700 hover:text-teal-600 hover:text-white hover:bg-teal-500 rounded py-1 px-1 ${pathname.includes('doctor/prescriptions') && "bg-teal-500 text-white font-semibold text-lg"}`}>📝 Prescriptions</Link>
                    <Link href="/doctor/profile" className={`text-gray-700 hover:text-teal-600 hover:text-white hover:bg-teal-500 rounded py-1 px-1 ${pathname.includes('doctor/profile') && "bg-teal-600 text-white font-semibold text-lg"}`}>🩺 Profile</Link>
                </nav>
            </div>

            <div className="mt-10">
                <button onClick={logoutHandler} className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white py-2 rounded">
                    Logout
                </button>
            </div>
      </aside>
    )
}

export default SideBar



// import { useDoctorAuth } from "@/context/authContext";
// import Link from "next/link"
// import { usePathname, useRouter } from "next/navigation"

// const SideBar = ()=>{
//     const pathname = usePathname()
//     const { logout } = useDoctorAuth();
//     const router = useRouter();

//     const logoutHandler = () => {
//         router.push("/");
//         logout();
//     };
//     return(
//         <aside className="w-full border-r-2  h-screen bg-teal-500 shadow-md p-6 flex flex-col justify-between">
//             <div>
//                 <Link href="/" className="text-2xl font-bold text-white ">Doc-Center</Link>
//                 <nav className="flex flex-col text-white gap-4 mt-8">
//                     <Link href="/doctor/dashboard" className={` hover:text-teal-600  hover:bg-muted rounded py-1 px-1 ${pathname.includes('doctor/dashboard') && "bg-white text-teal-500 font-semibold text-lg"}`}>🏠 Dashboard</Link>
//                     <Link href="/doctor/appointments" className={` hover:text-teal-600  hover:bg-muted rounded py-1 px-1 ${pathname.includes('doctor/appointments') && "bg-white text-teal-500 font-semibold text-lg"}`}>📅 Appointments</Link>
//                     <Link href="/doctor/patients" className={`hover:text-teal-600  hover:bg-muted rounded py-1 px-1 ${pathname.includes('doctor/patients') && "bg-white text-teal-500 font-semibold text-lg"}`}>👥 Patient List</Link>
//                     <Link href="/doctor/prescriptions" className={` hover:text-teal-600  hover:bg-muted rounded py-1 px-1 ${pathname.includes('doctor/prescriptions') && "bg-white text-teal-500 font-semibold text-lg"}`}>📝 Prescriptions</Link>
//                     <Link href="/doctor/profile" className={` hover:text-teal-600  hover:bg-muted rounded py-1 px-1 ${pathname.includes('doctor/profile') && "bg-white text-teal-500 font-semibold text-lg"}`}>🩺 Profile</Link>
//                 </nav>
//             </div>

//             <div className="mt-10">
//                 <button onClick={logoutHandler} className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white py-2 rounded">
//                     Logout
//                 </button>
//             </div>
//       </aside>
//     )
// }

// export default SideBar