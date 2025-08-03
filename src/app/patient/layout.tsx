
"use client"
import { PatientAuthProvider } from "@/context/patientAuthContext";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const hideNavbarRoutes = ["/doctor/login", "/doctor/signup", "/doctor/forgot-password"];
    const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

    return (
        <PatientAuthProvider>
            {children}
        </PatientAuthProvider>
    );
}

