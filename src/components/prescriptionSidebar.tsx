
"use client";

import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";


interface PrescriptionItem {
  prescriptionId: string;
  patientName: string;
  patientImage: string;
  diagnosis: string;
}

interface SidebarProps {
  prescriptions: PrescriptionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PrescriptionSidebar({ prescriptions, selectedId, onSelect }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full  mt-20 lg:mt-0  md:w-1/4 bg-white  border-r h-screen ">
        <div className="h-[20vh]">
            <div className=" p-4 border-b text-xl lg:text-2xl font-bold mt-2 text-teal-600">Prescriptions</div>
            {/* Search Input */}
            <div className=" relative mb-2 mt-4 px-2 ">
                <input
                type="text"
                value={searchTerm}
                placeholder="Search patients..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-500 px-4 pl-12 py-3 bg-gray-100 rounded-lg shadow-sm text-sm focus:border focus:outline-none focus:border-teal-400"
                />
                <span className="absolute left-8 top-3 text-gray-400">
                <IoSearchOutline className="size-5" />
                </span>
            </div>
        </div>
      
      {/* Prescription List */}
        <div className=" h-[80vh] overflow-y-auto ">
            <ul className="space-y-2  p-2 pt-2">
                {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm">No prescriptions found.</p>
                ) : (
                filtered.map((p) => (
                    <li
                    key={p.prescriptionId}
                    onClick={() => onSelect(p.prescriptionId)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                        selectedId === p.prescriptionId
                        ? "bg-teal-50 border border-teal-500"
                        : "hover:bg-gray-100 hover:border border-gray-200"
                    }`}
                    >
                    <img
                        src={p.patientImage|| "/images/patient.png"}
                        alt={p.patientName}
                        width={45}
                        height={45}
                        className="rounded-full object-cover border-2 border-teal-500"
                    />
                    <div>
                        <p className="font-medium">{p.patientName}</p>
                        <p className="text-xs text-gray-500">{p.diagnosis || "No diagnosis"}</p>
                    </div>
                    </li>
                ))
                )}
            </ul>
        </div>
    </div>
  );
}
