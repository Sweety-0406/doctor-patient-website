
"use client"
import Navbar from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { DoctorAuthProvider } from "@/context/authContext";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const hideNavbarRoutes = ["/doctor/login", "/doctor/signup", "/doctor/forgot-password"];
    const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

    return (
        <DoctorAuthProvider>
            {!shouldHideNavbar && (
                <div className="lg:hidden w-full">
                    <Navbar />
                </div>
            )}

            <div className="flex">
                {!shouldHideNavbar && (
                    <div className="hidden lg:block w-64">
                        <SideBar />
                    </div>
                )}

                <div className="flex-1 bg-gray-50 overflow-auto">
                    {children}
                </div>
            </div>
        </DoctorAuthProvider>
    );
}

