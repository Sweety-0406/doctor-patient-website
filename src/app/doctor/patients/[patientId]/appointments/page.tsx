

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
import { FaArrowLeft } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import StatusIndicator from "@/components/statusIndicator";
import Link from "next/link";

type Medicine = {
    medicineName: string;
    dosage: string;
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

    if (!doctor ) return null;

    return(
        <div className="pt-16 relative md:pt-24 pb-8 h-screen px-6 lg:pt-8 ">
            <span className="cursor-pointer absolute top-20 lg:top-1 lg:left-4 mt-1" onClick={() => router.back()}>
                <FaArrowLeft onClick={()=>router.push("/doctor/patients")} className="size-8 text-teal-500" />
            </span>
            <div className="flex items-center gap-4 mb-6 mt-12 md:mt-6 lg:mt-0">
                <img
                    src={appointments[0]?.patientImage || "/images/patient.png"}
                    alt={appointments[0]?.patient || "Patient"}
                    className="size-16 sm:size-20 border-3 border-teal-500 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-teal-500">
                    {appointments[0] ? capitalizeName(appointments[0].patient) : "Loading..."}
                    </h2>
                    <p className="text-sm  text-gray-500">
                    {appointments[0]?.address || ""}
                    </p>
                    <Link href={`/doctor/patients/${patientId}/profile`} 
                        className="flex text-sm text-teal-500 cursor-pointer"
                    >
                        view profile 
                    </Link>
                </div>
            </div>
             
             {/* filter dates */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
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
                >
                    Clear Filter
                </button>
                <button
                    className="mt-5 cursor-pointer bg-teal-500 text-white px-4 py-1 rounded-md hover:bg-teal-600"
                    onClick={handlePrint}
                >
                    Download Data
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
                    <TabsTrigger className="cursor-pointer " value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger className="cursor-pointer " value="prescriptions">Prescriptions</TabsTrigger>
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
                                <p className="text-teal-500">Total appointments: {filteredAppointments.length}</p>
                                {filteredAppointments.map((item, index:number) => (
                                    <div key={index} className="mb-8">
                                        <div className="text-lg font-bold text-teal-500 mt-1 mb-2">
                                        {format(new Date(item.date), "dd MMM yyyy")} 
                                        </div>
                                        <div key={index} className="border-l-4 border-teal-500 p-4 rounded-lg max-w-lg bg-white shadow-sm">
                                            <div className="flex flex-col gap-2 justify-between">
                                                <h3 className="font-bold text-gray-800">{item.diagnosis}</h3>
                                                <p className="text-xs  text-gray-400 mt-1">
                                                    App ID: {item.id}
                                                </p>
                                                <p className="text-sm  text-gray-500">⏰ Timing: {item.time}</p>
                                                <p className={`text-sm text-gray-500  flex`}><FaRupeeSign className="text-yellow-500 mt-1 mr-2"/>Payment: <span className={`  ${item.payment==="paid"?"text-green-500":"text-red-500"}`}>{item.payment}</span></p>
                                                <div className="text-sm text-gray-600 flex gap-2 ">
                                                    Status:  <StatusIndicator status={item.status} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* <div className="flex pl-1  gap-2">
                            <button onClick={() => onEdit()} className="text-teal-600 rounded-lg bg-teal-100 flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-teal-200  p-1 border border-teal-500 hover:text-teal-800">
                            <MdEditNote size={24} /> Edit
                            </button>
                            <button onClick={() => onDelete(id)} className="text-red-500 rounded-lg bg-red-100  flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-red-200 border border-red-500 p-1 hover:text-red-700">
                            <MdDeleteSweep size={24} /> Delete
                            </button>
                        </div> */}
                    </div>
                </TabsContent>
                <TabsContent value="prescriptions">
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
                            <div className="space-y-4  ">
                                <p className="text-teal-500">Total prescriptions: {filteredPrescriptions.length}</p>
                                {filteredPrescriptions.map((item, index:number) => (
                                    <div key={index}>
                                        <div className="text-lg font-bold text-teal-500 mt-1 mb-2">
                                        {format(new Date(item.createdAt), "dd MMM yyyy")} 
                                        </div>
                                        <div key={index} className="border-l-4 border-teal-500 p-4 rounded-lg max-w-lg bg-white shadow-sm">
                                            <div className="flex flex-col gap-3 justify-between">
                                                {item.medicines.map((m:Medicine, i:number)=>(
                                                    <div key={i}>
                                                        <h3 className="font-bold text-gray-800">💊Medicine: {m.medicineName}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            🧪Dosages: {m.dosage} 
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                           ⏳ Duration: {m.duration}
                                                        </p>
                                                        <p className="text-xs italic text-gray-500">📝 Note: {m.notes || "no note here"}</p>
                                                    </div>
                                                ))} 
                                                <p className="text-xs italic text-gray-400 mt-1">
                                                    App ID: {item.appointmentId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* <div className="flex pl-1  gap-2">
                            <button onClick={() => onEdit()} className="text-teal-600 rounded-lg bg-teal-100 flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-teal-200  p-1 border border-teal-500 hover:text-teal-800">
                            <MdEditNote size={24} /> Edit
                            </button>
                            <button onClick={() => onDelete(id)} className="text-red-500 rounded-lg bg-red-100  flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-red-200 border border-red-500 p-1 hover:text-red-700">
                            <MdDeleteSweep size={24} /> Delete
                            </button>
                        </div> */}
                    </div>
                </TabsContent>
            </Tabs>            
        </div>
    )
}

export default PatientAppointments