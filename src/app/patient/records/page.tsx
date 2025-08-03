"use client"

import { Appointment } from "@/app/types";
import AppointmentCard from "@/components/appointmentCard";
import Footer from "@/components/footer";
import NoAppointmentCard from "@/components/noAppointment";
import { usePatientAuth } from "@/context/patientAuthContext";
import { cancelAppointment, getPatientAppointments } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function RecordsPage(){
    const[appointments, setAppointments] = useState<Appointment[]>([])
    const { patient, loading } = usePatientAuth();
    const router = useRouter()


    useEffect(() => { 
    if (!loading && patient) {
        console.log(patient)
        fetchAppointments();
        console.log(appointments)
    } else if (!loading && !patient) {
        router.push("/patient/login");
    }
    }, [loading, patient]);

    const fetchAppointments = async () => {
        if(!patient) return null;
        const res = await getPatientAppointments(patient.id);
        const data = await res.json();
        console.log("data",data)
        setAppointments(data);
    
    };   
    const handleCancel = async (appointmentId: string, reason:string) => {
        const res = await cancelAppointment(appointmentId, "cancelled", reason);
        if (res.ok) {
            toast.success("Appointment cancelled successfully.");
            fetchAppointments()
        } else {
            toast.error("Failed to cancel appointment.");
        }
    }; 

    const updateAppointment = (id: string, date: string, time: string) => {
        setAppointments((prev) =>
            prev.map((appt) =>
            appt.id === id ? { ...appt, date, time } : appt
            )
        );
    };

    return(
        <div className=" max-h-screen mx-auto lg:mx-10">
            <div className="h-[90vh] overflow-y-scroll p-4">
                <h1 className="text-xl lg:text-3xl font-semibold mb-4">My Appointments Records</h1>
                {appointments.length == 0 ? (
                    <NoAppointmentCard />
                ):(
                    <div className="mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {appointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} data={appointment} onCancel={handleCancel} onReschedule={updateAppointment} />
                        ))}
                    </div>
                )}
            </div>
            <div className="h-[10vh] p-4">
                <Footer page="records" />
            </div>
        </div>
    )
}