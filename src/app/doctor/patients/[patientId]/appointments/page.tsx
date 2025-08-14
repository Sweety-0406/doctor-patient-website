

"use client"

import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Appointment, FullPrescription, Prescription } from "@/app/types";
import { useDoctorAuth } from "@/context/authContext";
import { useParams, useRouter } from "next/navigation";
import { getDoctorAppointments, getPrescriptions } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TiChartLine } from "react-icons/ti";
import { format } from "date-fns";
import { capitalizeName } from "@/lib/utils";
import { FaArrowLeft, FaLightbulb, FaRegCreditCard, FaStethoscope } from "react-icons/fa6";
import { FaExternalLinkAlt, FaMapMarkerAlt, FaRegCalendar, FaRupeeSign, FaUserCircle } from "react-icons/fa";
import StatusIndicator from "@/components/statusIndicator";
import Link from "next/link";
import { PiMapPinAreaFill, PiNotepadBold } from "react-icons/pi";
import { MdDeleteSweep, MdOutlineNoteAdd } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { LuAlarmClock, LuCalendar, LuNotebookText } from "react-icons/lu";
import LoaderSection from "@/components/loader";
import ErrorSection from "@/components/error";

type Medicine = {
    medicineName: string;
    dosage: string;
    interval: string;
    duration: string;
    notes?: string;
}

const PatientAppointments = ()=>{
    const { doctor, loading } = useDoctorAuth();
    const router = useRouter();
    const { patientId } = useParams();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [prescriptions, setPrescriptions] = useState<FullPrescription[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const printRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
    if (!loading && doctor) {
        fetchAppointments();
    } else if (!loading && !doctor) {
        router.push('/doctor/login');
    }
    }, [loading, doctor]);

    const fetchAppointments = async () => {
    if (doctor) {
        const res = await getDoctorAppointments(doctor.id);
        const patientData = res
        .filter((item: Appointment) => item.patientId === patientId)
        .sort(
            (a:Appointment, b:Appointment) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAppointments(patientData);

        const prescriptionRes = await getPrescriptions(doctor.id);
        const prescriptionData = prescriptionRes
        .filter((item: Appointment) => item.patientId === patientId)
        .sort(
            (a:Appointment, b:Appointment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPrescriptions(prescriptionData);

    }
    };

    const filteredAppointments = appointments.filter((item) => {
        if (!startDate || !endDate) return true;
        const appDate = new Date(item.date).getTime();
        return (
            appDate >= new Date(startDate).getTime() &&
            appDate <= new Date(endDate).getTime()
        );
    });

    const filteredPrescriptions = prescriptions.filter((item) => {
        if (!startDate || !endDate) return true;
        const presDate = new Date(item.createdAt).getTime();
        return (
            presDate >= new Date(startDate).getTime() &&
            presDate <= new Date(endDate).getTime()
        );
    });


    const handlePrint = () => {
        if (!printRef.current) return;

        // Open a new window with the printable content
        const printWindow = window.open("", "_blank", "width=800,height=600");
        if (!printWindow) return;

        printWindow.document.write(`
        <html>
            <head>
            <title>Print Patient Data</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
                h2 { color: #059669; margin-bottom: 10px; }
                hr { margin: 15px 0; }
                ul { padding-left: 20px; }
                li { margin-bottom: 5px; }
            </style>
            </head>
            <body>
            ${printRef.current.innerHTML}
            </body>
        </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };


    if (loading )
        return <LoaderSection />;

    if ( !doctor)
        return <ErrorSection />;

    return(
        <div className="h-screen">
            <div className="pt-24 relative md:pt-24 pb-8  px-6 lg:pt-8 ">
                <div className="relative w-full rounded-xl bg-gradient-to-tr from-teal-500 via-teal-700 to-teal-500 p-4 flex items-center gap-4 shadow-lg">
                {/* Back Arrow */}
                <span
                    className="cursor-pointer flex-shrink-0 -mt-16"
                    onClick={() => router.push("/doctor/patients")}
                >
                    <FaArrowLeft className="text-white size-6" />
                </span>

                {/* Profile Image */}
                <div className="relative">
                    <img
                    src={appointments[0]?.patientImage || "/images/patient.png"}
                    alt={appointments[0]?.patient || "Patient"}
                    className="size-16 sm:size-20 rounded-full border-4 border-white object-cover"
                    />
                    {/* Overlay Icon */}
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-[3px] shadow-md">
                    <FaUserCircle className="text-teal-500 size-4" />
                    </div>
                </div>

                {/* Patient Info */}
                <div className="text-white flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold">
                    {appointments[0]?.patient || "Loading..."}
                    </h2>
                    <p className="text-sm flex items-center gap-1">
                    <PiMapPinAreaFill  className="text-pink-400 size-5" />
                    {appointments[0]?.address || "No address available"}
                    </p>
                    <p className="text-sm">Age: {appointments[0]?.age ? `${appointments[0].age} years` : "N/A"}</p>

                    <Link
                    href={`/doctor/patients/${patientId}/profile`}
                    className="flex items-center gap-1 text-sky-300 text-sm mt-1 hover:underline"
                    >
                    View Full Profile <FaExternalLinkAlt className="size-3" />
                    </Link>
                </div>
                </div>            
                
                {/* filter dates */}
                <div className="flex flex-col md:flex-row justify-between bg-white shadow-lg mt-10 py-8 px-4 rounded-lg mb-6">
                    <div className="flex  gap-4 items-center ">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500">Start Date</label>
                            <input
                            type="date"
                            className="border border-teal-500 rounded-md px-3 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-400"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500">End Date</label>
                            <input
                            type="date"
                            className="border border-teal-500 rounded-md px-3 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-400"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <button
                            className="mt-5 bg-red-100 text-red-500 border border-red-400 px-4 py-1 cursor-pointer rounded-md hover:bg-red-200"
                            onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            }}
                        > X
                        </button>
                    </div>
                    <button
                        className="mt-5 cursor-pointer bg-teal-500 font-semibold flex justify-center gap-2 text-white px-4 py-1 rounded-md hover:bg-teal-600"
                        onClick={handlePrint}
                    >
                    <FiDownload className="size-5 mt-[3px] font-semibold" /> Download Report
                    </button>
                </div>

                <div
                    ref={printRef}
                    style={{ display: "none" }}
                >    
                    {appointments.length >0 && (
                        <div>
                            <h2>{appointments[0].patient}</h2> 
                            <div><strong>Age:</strong>{appointments[0].age}</div>
                            <div><strong>Address:</strong>{appointments[0].address}</div>
                            <div><strong>Phone:</strong>{appointments[0].phone}</div>
                        </div>
                    )}
                    <h2>Appointments</h2>
                    {filteredAppointments.length === 0 ? (
                    <p>No appointments available.</p>
                    ) : (
                    filteredAppointments.map((item) => (
                        <div key={item.id} style={{ marginBottom: 12 }}>
                            <div>
                                <strong>Date:</strong> {format(new Date(item.date), "dd MMM yyyy")}
                            </div>
                            <div>
                                <strong>Diagnosis:</strong> {item.diagnosis}
                            </div>
                            <div>
                                <strong>Time:</strong> {item.time}
                            </div>
                            <div>
                                <strong>Payment:</strong> {item.payment}
                            </div>
                            <div>
                                <strong>Status:</strong> {item.status}
                            </div>
                            <hr />
                        </div>
                    ))
                    )}

                    <h2 style={{ marginTop: 20 }}>Prescriptions</h2>
                    {filteredPrescriptions.length === 0 ? (
                    <p>No prescriptions available.</p>
                    ) : (
                    filteredPrescriptions.map((item) => (
                        <div key={item.id} style={{ marginBottom: 12 }}>
                        <div>
                            <strong>Date:</strong> {format(new Date(item.createdAt), "dd MMM yyyy")}
                        </div>
                        <div>
                            <strong>Appointment ID:</strong> {item.appointmentId}
                        </div>
                        <div>
                            <strong>Medicines:</strong>
                            <ul>
                            {item.medicines.map((m: Medicine, i: number) => (
                                <li key={i}>
                                {m.medicineName} — Dosage: {m.dosage}, Duration: {m.duration},{" "}
                                Note: {m.notes || "None"}
                                </li>
                            ))}
                            </ul>
                        </div>
                        <hr />
                        </div>
                    ))
                    )}
                </div>

                <Tabs defaultValue="appointments" className="w-full ">
                    <TabsList className="w-full border mb-4">
                        <TabsTrigger className="cursor-pointer " value="appointments"><FaRegCalendar /> Appointments</TabsTrigger>
                        <TabsTrigger className="cursor-pointer " value="prescriptions"><MdOutlineNoteAdd /> Prescriptions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="appointments" className="mt-4 " >
                        <div className="">
                            {filteredAppointments.length === 0? (
                                <div>
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <img
                                        src="/images/no-user-found.png"
                                        alt="No Patients"
                                        className="w-32 h-32 md:w-40 md:h-80 md:w-80 mb-4 opacity-70"
                                        />
                                        <span>No appointments is there.</span>
                                    </div>
                                </div>
                            ):(
                                <div className="space-y-4 md:space-x-8 ">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-xl md:text-2xl text-black">Appointments</h3>
                                        <p className="bg-teal-100 rounded-full px-4 font-semibold  items-center flex justify-center text-xs text-teal-500"> {filteredAppointments.length} Total</p>
                                    </div>
                                    {filteredAppointments.map((item, index:number) => (
                                        <div key={index} className="mb-12">
                                            <div className="text-lg flex gap-2 font-semibold text-blue-500 mt-1 mb-2">
                                                <LuCalendar className="mt-1" />{format(new Date(item.date), "dd MMM yyyy")} 
                                            </div>
                                            <div key={index} className="border-l-4 border-teal-500  p-4 rounded-lg max-w-2xl hover:shadow-lg cursor-pointer transition hover:scale-103 bg-white shadow-sm">
                                                <div className="flex flex-col gap-2 justify-between">
                                                    <h3 className="font-semibold flex gap-2 text-lg text-slate-600 "><span className="px-2 py-1 flex justify-center items-center rounded bg-green-100"><FaStethoscope className="mt- text-green-500 "/></span>{capitalizeName(item.diagnosis)}</h3>
                                                    <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                                                        <p className="text-sm  text-gray-500 flex gap-2"><LuAlarmClock className="size-5 text-green-500" />  {item.time}</p>
                                                        <p className={`text-sm text-gray-500  flex gap-2`}><FaRegCreditCard  className="size-5 text-yellow-500 mt-1" /> <span className={`  ${item.payment==="Paid"?"text-green-500 border border-green-500 bg-green-100 px-3 py-1 rounded-full":"text-red-500 bg-red-100 border border-red-500 px-3 py-1 rounded-full"}`}>{item.payment}</span></p>
                                                        <div className="text-sm text-gray-600 flex gap-2 ">
                                                            <StatusIndicator status={item.status} />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs border-t pt-2 font-semibold text-yellow-500 mt-1">
                                                        App ID: {item.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="prescriptions" className="mt-4">
                        <div className="">
                            {filteredPrescriptions.length === 0? (
                                <div>
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <img
                                        src="/images/no-user-found.png"
                                        alt="No Patients"
                                        className="w-32 h-32 md:w-40 md:h-80 md:w-80 mb-4 opacity-70"
                                        />
                                        <span>No prescriptions is there.</span>
                                    </div>
                                </div>
                            ):(
                                <div className="space-y-4 md:space-x-8 ">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-xl md:text-2xl text-black">Prescriptions</h3>
                                        <p className="bg-teal-100 rounded-full px-4 font-semibold  items-center flex justify-center text-xs text-teal-500"> {filteredPrescriptions.length} Total</p>
                                    </div>
                                    {filteredPrescriptions.map((item, index:number) => (
                                        <div key={index} className="mb-12">
                                            <div className="text-lg flex gap-2 font-semibold text-blue-500 mt-1 mb-2">
                                                <LuCalendar className="mt-1" />{format(new Date(item.createdAt), "dd MMM yyyy")} 
                                            </div>
                                            <div key={index} className="border-l-4  border-teal-500 hover:shadow-lg cursor-pointer transition hover:scale-102 p-4 rounded-lg bg-white shadow-sm">
                                                <h3 className="font-semibold flex gap-2 text-lg text-slate-600 "><span className="px-2 py-1 flex justify-center items-center rounded bg-green-100"><FaStethoscope className="mt- text-green-500 "/></span>{capitalizeName(item.diagnosis)}</h3>
                                                <h3 className="font-semibold flex gap-1 text-slate-600 "><LuNotebookText className="text-green-500 size-4 mt-1" /> Prescribed Medicines:</h3>
                                                <div className="flex flex-col gap-3 mt-3 ">
                                                    {item.medicines.map((m:Medicine, i:number)=>(
                                                        <div key={i} className=" p-4 bg-teal-0  rounded-lg border border-teal-100 shadow shadow-teal-50">
                                                            <p className="text-sm font-bold text-slate-600 ">
                                                                <span className="font-bold text-green-500">Medicine:</span> {m.medicineName} 
                                                            </p>
                                                            <div className="flex flex-col mt-2 md:flex-row md:justify-between">
                                                                <p className="text-sm text-gray-600 ">
                                                                    <span className="font-bold">Dosages:</span> {m.dosage} 
                                                                </p>
                                                                <p className="text-sm text-gray-600 ">
                                                                <span className="font-bold"> Interval: </span>{m.interval}
                                                                </p>
                                                                <p className="text-sm text-gray-600  mb-2">
                                                                <span className="font-bold"> Duration: </span>{m.duration}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs italic py-2 border-t mt-4 border-teal-500 px-2 rounded-md bg-teal-100 flex gap-2 border-gray-200 text-gray-500"><span className="font-bold flex gap-1 text-teal-500"> <FaLightbulb className="size-4" /> Note: </span>{m.notes || "no note here"}</p>
                                                        </div>
                                                    ))} 
                                                    <p className="text-xs border-t border-gray-200 pt-2 italic text-yellow-400 mt-1">
                                                        App ID: {item.appointmentId}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>            
            </div>
        </div>
    )
}

export default PatientAppointments