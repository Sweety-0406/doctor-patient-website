


"use client";

import { MdEditNote, MdDeleteSweep } from "react-icons/md";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getPatientAppointments } from "@/lib/api";
import { Appointment } from "@/app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TiChartLine } from "react-icons/ti";



interface Prescription {
  medicineName: string;
  dosage: string;
  duration: string;
  notes?: string;
  appointmentId: string;
  createdAt: string;
}

interface Props {
  prescriptions: Prescription[];
  id: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  blood: string;
  date: string;
  time: string;
  patientId: string;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function PrescriptionList({
  prescriptions,
  onEdit,
  onDelete,
  id,
  gender,
  age,
  phone,
  address,
  blood,
  date,
  time,
  patientId,
}: Props) {
  const [latestDiagnoses, setLatestDiagnoses] = useState<Appointment[] | null>(null);

  useEffect(() => {
    fetchLatestDiagnoses();
  }, [patientId]);

  const fetchLatestDiagnoses = async () => {
    try {
      const res = await getPatientAppointments(patientId);
      const data = await res.json()
      setLatestDiagnoses(data);
    } catch (error) {
      console.error("Failed to fetch diagnoses", error);
    }
  };
  console.log(prescriptions)

  return (
    
    <div className="space-y-6 w-full ">
        <Tabs defaultValue="patient" className="w-full">
        <TabsList className="w-full border mb-4">
            <TabsTrigger className="cursor-pointer " value="patient">Patient Info</TabsTrigger>
            <TabsTrigger className="cursor-pointer " value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="patient" className="mt-4" >
            {latestDiagnoses && latestDiagnoses.length > 0 && (
                <div>
                    <h1 className="text-lg border-b-2 font-semibold text-gray-800 mb-2">Latest Diagnoses</h1>
                    <div className="flex flex-wrap gap-3 mt-4">
                        {latestDiagnoses.slice(0, 3).map((appt) => (
                        <div
                            key={appt.id}
                            className="flex items-center gap-2 px-4 py-2 border-l-4 border-teal-500 rounded-lg shadow-sm bg-white "
                        >
                            <div className="text-teal-600 bg-white p-1 rounded-full">
                            <TiChartLine className="w-5 h-5" />
                            </div>
                            <div>
                            <p className="text-sm font-medium text-gray-800 truncate w-40">{appt.diagnosis}</p>
                            <p className="text-xs text-teal-500">{format(new Date(appt.date), "MMMM d, yyyy")}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div>
                        <div className="text-lg font-semibold py-2 mt-8 border-b-2">General Information</div>
                        <div className="w-full">
                            <InfoCol title="Age" des={age} />
                            <InfoCol title="Gender" des={gender} />
                            <InfoCol title="Blood" des={blood} />
                            <InfoCol title="Phone" des={phone} />
                            <InfoCol title="Address" des={address} />
                        </div>
                    </div>
                </div>
            )}
        </TabsContent>
        <TabsContent value="prescriptions">
            <div className="space-y-4">
                {prescriptions.map((item, index:number) => (
                <div key={index} className="border-l-4 border-teal-500 p-4 rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800">{item.medicineName}</h3>
                        <p className="text-sm text-gray-600">
                        {item.dosage} | {item.duration}
                        </p>
                        <p className="text-xs italic text-gray-500">{item.notes}</p>
                        <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(item.createdAt), "dd MMM yyyy")} • App ID: {item.appointmentId}
                        </p>
                    </div>
                    </div>
                </div>
                ))}
                <div className="flex pl-1  gap-2">
                    <button onClick={() => onEdit()} className="text-teal-600 rounded-lg bg-teal-100 flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-teal-200  p-1 border border-teal-500 hover:text-teal-800">
                    <MdEditNote size={24} /> Edit
                    </button>
                    <button onClick={() => onDelete(id)} className="text-red-500 rounded-lg bg-red-100  flex w-24 items-center justify-center cursor-pointer gap-1 hover:bg-red-200 border border-red-500 p-1 hover:text-red-700">
                    <MdDeleteSweep size={24} /> Delete
                    </button>
                </div>
            </div>
        </TabsContent>
        </Tabs>
    </div>
  );
}


const InfoCol = ({title, des}:{title:string; des:string})=>{
    return(
        <div className="w-full flex justify-between px-1 py-2 border-b-2">
            <div className="text-gray-500 text-sm"> {title} </div>
            <div className="text-black font-semibold text-sm"> {des} </div>
        </div>
    )
}
